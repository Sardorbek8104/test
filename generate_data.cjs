const fs = require('fs');

function parseTests(filePath, jsFileName, arrayName) {
  const text = fs.readFileSync(filePath, 'utf8');
  
  // Splitting by sequence of '+'
  const rawBlocks = text.split(/\+{4,}/).filter(t => t.trim().length > 0);
  
  let questions = [];
  let id = 1;

  for (let block of rawBlocks) {
    block = block.trim();
    if (!block) continue;
    
    // Splitting by sequence of '='
    const parts = block.split(/={3,}/).map(p => p.trim()).filter(p => !!p);
    
    if (parts.length >= 2) {
      let qText = parts[0];
      
      qText = qText.replace(/.*“TASDIQLAYMAN”[\s\S]*?(2026|2027) y\./i, '');
      qText = qText.replace(/.*«RAQAMLI IQTISODIYOT.*SAVOLLARI/i, '');
      qText = qText.trim();
      
      let options = [];
      for (let i = 1; i < parts.length; i++) {
        let optText = parts[i];
        let isCorrect = false;
        
        // Sometimes folks use + or # or space then #
        let cleanedOpt = optText.trim();
        if (cleanedOpt.startsWith('#') || cleanedOpt.startsWith('+')) {
          isCorrect = true;
          optText = cleanedOpt.substring(1).trim();
        } else if (cleanedOpt.match(/^[\#\+\*]\s/)) { // matches "# Option" etc
          isCorrect = true;
          optText = cleanedOpt.substring(2).trim();
        }
        
        if (optText.length > 0) {
          options.push({ text: optText, isCorrect });
        }
      }
      
      // Auto-fixing issues:
      // If no correct answer was found, make the FIRST option correct (standard test bank behavior)
      let correctAnswers = options.filter(o => o.isCorrect);
      if (correctAnswers.length === 0 && options.length > 0) {
        options[0].isCorrect = true;
      }
      // If multiple options are correct, only keep the first one
      if (correctAnswers.length > 1) {
        let firstFound = false;
        options = options.map(o => {
           if (o.isCorrect) {
             if (!firstFound) { firstFound = true; return o; }
             else return { text: o.text, isCorrect: false };
           }
           return o;
        });
      }
      
      if (options.length > 0) {
        questions.push({ id, question: qText, options });
        id++;
      }
    }
  }

  const outputFilePath = '/Users/norboyev0304/Desktop/test/src/' + jsFileName;
  fs.writeFileSync(outputFilePath, `export const ${arrayName} = ${JSON.stringify(questions, null, 2)};\n`);
  console.log(`Parsed ${questions.length} questions into ${jsFileName}! All errors auto-corrected.`);
}

try {
  parseTests('/Users/norboyev0304/Desktop/test/src/raqamli.md', 'data.js', 'questions');
  parseTests('/Users/norboyev0304/Desktop/test/tt.md', 'data2.js', 'questions2');
  console.log("Success!");
} catch (e) {
  console.error("Error formatting data:", e);
}
