jest.mock('../../repositories/question.repository')
const questionRepository = require('../../repositories/question.repository')

jest.mock('../../repositories/student.repository')
const studentRepository = require('../../repositories/student.repository')

jest.mock('../../repositories/answer.repository')
const answerRepository = require('../../repositories/answer.repository')

const exam = { id: 123 }

const calculator = require('../../services/calculator.service')

var question = {
  id: 88192,
  title: 'Qual a pior linguagem de programação?',
  options: ['java', 'cobol', 'assembly', 'c++'],
  correctAnswer: 0,
}

let createQuestions = function() {
  return [question, question, question]
}

const createStudentList = ({ quantity }) =>
  Array(quantity)
    .fill(0)
    .map((x, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      classId: 978,
    }))

const responseList = ({ quantity }) =>
  Array(quantity)
    .fill(0)
    .map((x, i) => `Response number + ${i + 1}`)

const createQuestionList = ({ quantity }) =>
  Array(quantity)
    .fill(0)
    .map((x, i) => ({
      id: i + 1,
      title: `Question number + ${i + 1}`,
      options: responseList({ quantity: 4 }),
      correctAnswer: 0,
    }))

const createAnswerList = ({ questions, numberOfCorrect }) =>
  questions
    .map((question, index) => ({
      questionId: question.id,
      chosen: index < numberOfCorrect ? 0 : 1,
    }))


describe('calculator', () => {
  it('should calculate score', () => {
    
    let questions = createQuestionList({ quantity: 10 });

    questionRepository.listByExam.mockImplementation(exam =>
        questions
    )
    studentRepository.listForExam.mockImplementation(exam =>
      createStudentList({ quantity: 1 })
    )
    answerRepository.getByExamAndStudent.mockImplementation((exam, student) =>
      createAnswerList({ questions, numberOfCorrect: 7 })
    )

    var [score] = calculator.calculate(exam)

    expect(score.grade).toEqual(7)
  })

  it('should calculate score', () => {
    let questions = createQuestionList({ quantity: 10 });

    questionRepository.listByExam.mockImplementation(exam =>
        questions
    )
    studentRepository.listForExam.mockImplementation(exam =>
      createStudentList({ quantity: 2 })
    )
    answerRepository.getByExamAndStudent.mockImplementation((exam, student) =>
      createAnswerList({ questions, numberOfCorrect: 5 })
    )

    var scores = calculator.calculate(exam)

    expect(scores[0].grade).toEqual(5)
    expect(scores[1].grade).toEqual(5)
  })
})
