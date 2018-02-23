const studentRepository = require('../repositories/student.repository')
const roomRepository = require('../repositories/room.repository')

const sumCapacity = rooms =>
  rooms.reduce((total, room) => total + room.capacity, 0)

const selectRooms = numberOfStudents => (selected, room) =>
  sumCapacity(selected) < numberOfStudents ? [...selected, room] : selected

const distributeStudents = students => (selected, room) => [
  ...selected,
  {
    room,
    students: students.splice(0, room.capacity),
  },
]

const distribute = exam => {
  const students = studentRepository.listForExam(exam)
  const numberOfStudents = students.length
  const rooms = roomRepository
    .listForExam(exam)
    .reduce(selectRooms(numberOfStudents), [])

  if (sumCapacity(rooms) < numberOfStudents) 
    throw new Error('Capacidade das salas é insuficiente para os alunos.')

  return rooms.reduce(distributeStudents(students), [])
}

module.exports = {
  distribute,
}
