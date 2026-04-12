import json
import re

# Read questions
with open('/Users/norboyev0304/Desktop/test/src/bolalar.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Read answers
answers_map = {}
with open('/Users/norboyev0304/Desktop/test/src/answers.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        # Format: "1. #B"
        match = re.search(r'(\d+)\.\s*#([A-D])', line)
        if match:
            q_num = int(match.group(1))
            ans_letter = match.group(2)
            answers_map[q_num] = ans_letter

parts = re.split(r'\n(?=\d+\.)', '\n' + text.strip())

questions = []
for p in parts:
    p = p.strip()
    if not p:
        continue
    
    lines = p.split('\n')
    question_text = ""
    options = []
    
    current_option = None
    q_num = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        m_q = re.match(r'^(\d+)\.\s*(.*)', line)
        m_A = re.match(r'^A\)\s*(.*)', line)
        m_B = re.match(r'^B\)\s*(.*)', line)
        m_C = re.match(r'^C\)\s*(.*)', line)
        m_D = re.match(r'^D\)\s*(.*)', line)
        
        if m_q and current_option is None:
            q_num = int(m_q.group(1))
            question_text += m_q.group(2) + " "
        elif m_A:
            current_option = 'A'
            options.append(('A', m_A.group(1)))
        elif m_B:
            current_option = 'B'
            options.append(('B', m_B.group(1)))
        elif m_C:
            current_option = 'C'
            options.append(('C', m_C.group(1)))
        elif m_D:
            current_option = 'D'
            options.append(('D', m_D.group(1)))
        else:
            if current_option is None:
                question_text += line + " "
            else:
                options[-1] = (options[-1][0], options[-1][1] + " " + line)
                
    if len(options) >= 2 and q_num is not None:
        correct_letter = answers_map.get(q_num, 'A')
        
        formatted_options = []
        for opt_letter, opt_text in options:
            formatted_options.append({
                "text": opt_text.strip(),
                "isCorrect": opt_letter == correct_letter
            })
        
        questions.append({
            "id": q_num, # use the parsed id just in case
            "question": question_text.strip(),
            "options": formatted_options
        })

with open('/Users/norboyev0304/Desktop/test/src/data.js', 'w', encoding='utf-8') as f:
    f.write('export const questions = ' + json.dumps(questions, indent=2, ensure_ascii=False) + ';\n')
