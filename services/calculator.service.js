const studentRepository = require('../repositories/student.repository')
const answerRepository = require('../repositories/answer.repository')
const questionRepository = require('../repositories/question.repository')

const calculate = exam => {
  let questions = questionRepository.listByExam(exam)
  let students = studentRepository.listForExam(exam)

  let scores = []

  return students.map(student => {
    return {
      student: student,
      grade: answerRepository
        .getByExamAndStudent(exam, student)
        .filter(
          answer =>
            questions.find(q => q.id == answer.questionId).correctAnswer ==
            answer.chosen
        ).length,
    }
  })
}

module.exports = {
  calculate,
}
