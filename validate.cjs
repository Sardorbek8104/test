const { questions } = require('./src/data.js');
const { questions2 } = require('./src/data2.js');

function validateDataset(dataset, name) {
  console.log(`\n--- Validating ${name} ---`);
  let errors = 0;
  
  for (let q of dataset) {
    if (!q.question || q.question.length < 5) {
      console.log(`[Warning] Q${q.id} has very short or missing question text: "${q.question}"`);
      errors++;
    }
    if (!q.options || q.options.length < 2) {
      console.log(`[Error] Q${q.id} has less than 2 options!`);
      errors++;
    }
    
    let correctCount = q.options.filter(o => o.isCorrect).length;
    if (correctCount === 0) {
      console.log(`[Error] Q${q.id} has NO correct answers!`);
      errors++;
    } else if (correctCount > 1) {
      console.log(`[Error] Q${q.id} has MULTIPLE correct answers (${correctCount})!`);
      errors++;
    }
    
    for (let opt of q.options) {
      if (opt.text.includes('====') || opt.text.includes('++++')) {
        console.log(`[Error] Q${q.id} option text contains invalid separators: "${opt.text.substring(0, 30)}..."`);
        errors++;
      }
    }
  }
  
  if (errors === 0) {
    console.log(`[OK] All ${dataset.length} questions in ${name} passed basic validation.`);
  } else {
    console.log(`Found ${errors} issues in ${name}.`);
  }
}

validateDataset(questions, "Raqamli Iqtisodiyot Data (src/data.js)");
validateDataset(questions2, "Innovatsion Iqtisodiyot Data (src/data2.js)");
