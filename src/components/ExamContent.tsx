import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  type: 'mcq' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
}

const htmlQuestions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Multi Language', 'Hyper Transfer Markup Language', 'None of the above'],
    correctAnswer: 'Hyper Text Markup Language'
  },
  {
    id: 2,
    type: 'short-answer',
    question: 'What tag is used to create a hyperlink in HTML?',
    correctAnswer: '<a>'
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which HTML tag is used to define an unordered list?',
    options: ['<ol>', '<ul>', '<li>', '<list>'],
    correctAnswer: '<ul>'
  },
  {
    id: 4,
    type: 'short-answer',
    question: 'What attribute is used to specify an image\'s alternative text in HTML?',
    correctAnswer: 'alt'
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Which HTML element is used to define important text?',
    options: ['<strong>', '<b>', '<important>', '<em>'],
    correctAnswer: '<strong>'
  },
  {
    id: 6,
    type: 'short-answer',
    question: 'What HTML tag is used to define a table row?',
    correctAnswer: '<tr>'
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Which HTML attribute is used to define inline styles?',
    options: ['style', 'class', 'font', 'styles'],
    correctAnswer: 'style'
  },
  {
    id: 8,
    type: 'short-answer',
    question: 'What is the correct HTML element for inserting a line break?',
    correctAnswer: '<br>'
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Which HTML element is used to specify a header for a document or section?',
    options: ['<head>', '<header>', '<top>', '<h1>'],
    correctAnswer: '<header>'
  },
  {
    id: 10,
    type: 'short-answer',
    question: 'What attribute is used to specify where to open the linked document in a hyperlink?',
    correctAnswer: 'target'
  }
];

const cssQuestions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'What does CSS stand for?',
    options: ['Counter Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 'Cascading Style Sheets'
  },
  {
    id: 2,
    type: 'short-answer',
    question: 'Which property is used to change the background color of an element?',
    correctAnswer: 'background-color'
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which CSS property is used to control the text size?',
    options: ['text-size', 'font-size', 'text-style', 'font-style'],
    correctAnswer: 'font-size'
  },
  {
    id: 4,
    type: 'short-answer',
    question: 'What CSS property is used to make text bold?',
    correctAnswer: 'font-weight'
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Which CSS property is used to change the text color of an element?',
    options: ['color', 'text-color', 'font-color', 'text-style'],
    correctAnswer: 'color'
  },
  {
    id: 6,
    type: 'short-answer',
    question: 'What CSS property is used to set the spacing between lines of text?',
    correctAnswer: 'line-height'
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Which CSS property is used to specify the padding inside an element?',
    options: ['spacing', 'margin', 'padding', 'border'],
    correctAnswer: 'padding'
  },
  {
    id: 8,
    type: 'short-answer',
    question: 'What CSS property is used to make a grid container?',
    correctAnswer: 'display: grid'
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Which CSS property is used to make a flexible container?',
    options: ['flex', 'display: flex', 'flexible', 'flexbox'],
    correctAnswer: 'display: flex'
  },
  {
    id: 10,
    type: 'short-answer',
    question: 'What CSS property is used to specify the stack order of an element?',
    correctAnswer: 'z-index'
  }
];

const javascriptQuestions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'Which keyword is used to declare a variable in JavaScript?',
    options: ['var', 'let', 'const', 'All of the above'],
    correctAnswer: 'All of the above'
  },
  {
    id: 2,
    type: 'short-answer',
    question: 'What method is used to add an element to the end of an array in JavaScript?',
    correctAnswer: 'push()'
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which operator is used for strict equality comparison in JavaScript?',
    options: ['==', '===', '=', '!='],
    correctAnswer: '==='
  },
  {
    id: 4,
    type: 'short-answer',
    question: 'What keyword is used to define a function in JavaScript?',
    correctAnswer: 'function'
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Which method is used to remove the last element from an array in JavaScript?',
    options: ['pop()', 'push()', 'shift()', 'unshift()'],
    correctAnswer: 'pop()'
  },
  {
    id: 6,
    type: 'short-answer',
    question: 'What is the correct way to write a single-line comment in JavaScript?',
    correctAnswer: '//'
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Which of the following is not a valid JavaScript data type?',
    options: ['Number', 'String', 'Boolean', 'Character'],
    correctAnswer: 'Character'
  },
  {
    id: 8,
    type: 'short-answer',
    question: 'What method is used to convert a string to lowercase in JavaScript?',
    correctAnswer: 'toLowerCase()'
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Which JavaScript method is used to remove the first element from an array?',
    options: ['shift()', 'unshift()', 'pop()', 'push()'],
    correctAnswer: 'shift()'
  },
  {
    id: 10,
    type: 'short-answer',
    question: 'What is the JavaScript keyword used to declare a block-scoped variable that can be reassigned?',
    correctAnswer: 'let'
  }
];

interface ExamContentProps {
  onComplete: (score: number) => void;
  subject: string;
}

const ExamContent: React.FC<ExamContentProps> = ({ onComplete, subject }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    switch (subject.toLowerCase()) {
      case 'html':
        setQuestions(htmlQuestions);
        break;
      case 'css':
        setQuestions(cssQuestions);
        break;
      case 'javascript':
        setQuestions(javascriptQuestions);
        break;
      default:
        setQuestions([]);
    }
    setAnswers(new Array(10).fill(''));
  }, [subject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          handleNext();
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(60);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (question.correctAnswer.toLowerCase() === answers[index].toLowerCase()) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    onComplete(finalScore);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">No questions available for this subject</h2>
        <p>Please contact your instructor or try a different subject.</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Exam Completed</h2>
        <p className="mb-4">Your score: {calculateScore()} out of {questions.length}</p>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Exam
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Question {currentQuestion + 1} of {questions.length}</h2>
      <div className="mb-4 text-right">
        <span className="font-bold">Time left: {timeLeft} seconds</span>
      </div>
      <p className="mb-4">{question.question}</p>
      {question.type === 'mcq' ? (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswer(option)}
                className="mr-2"
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      ) : (
        <textarea
          value={answers[currentQuestion]}
          onChange={(e) => handleAnswer(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        />
      )}
      <button
        onClick={handleNext}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
      </button>
    </div>
  );
};

export default ExamContent;