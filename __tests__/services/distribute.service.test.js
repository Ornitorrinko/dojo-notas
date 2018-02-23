jest.mock('../../repositories/student.repository')
const studentRepository = require('../../repositories/student.repository')

jest.mock('../../repositories/room.repository')
const roomRepository = require('../../repositories/room.repository')

const distributeService = require('../../services/distribute.service')

const exam = { id: 345 }

describe('distribute', () => {
  it('should select rooms', () => {
    const students = createStudentList({ quantity: 20 })
    studentRepository.listForExam.mockImplementation(() => [...students])
    const rooms = [createRoom({ capacity: 9 }), createRoom({ capacity: 12 })]
    roomRepository.listForExam.mockImplementation(e => [...rooms])

    const [first, second] = distributeService.distribute(exam)

    expect(first.room).toEqual(rooms[0])
    expect(second.room).toEqual(rooms[1])
  })

  it('should distribute students for each rooms', () => {
    const students = createStudentList({ quantity: 20 })
    studentRepository.listForExam.mockImplementation(() => [...students])
    const rooms = [createRoom({ capacity: 9 }), createRoom({ capacity: 12 })]
    roomRepository.listForExam.mockImplementation(e => [...rooms])

    const [first, second] = distributeService.distribute(exam)

    expect(first.students).toEqual(students.slice(0, 9))
    expect(second.students).toEqual(students.slice(9, 20))
  })

  it('should throw if rooms capacity is not enough', () => {
    const students = createStudentList({ quantity: 30 })
    studentRepository.listForExam.mockImplementation(() => [...students])
    const rooms = [createRoom({ capacity: 9 }), createRoom({ capacity: 12 })]
    roomRepository.listForExam.mockImplementation(e => [...rooms])

    expect(() => distributeService.distribute(exam)).toThrow(
      'Capacidade das salas é insuficiente para os alunos.'
    )
  })
})

const createStudentList = ({ quantity }) =>
  Array(quantity)
    .fill(0)
    .map((x, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      classId: 978,
    }))

const createRoom = (initial = {}) =>
  Object.assign(
    {
      id: randomNumber(),
      description: `Room ${randomNumber()}`,
      capacity: 10,
    },
    initial
  )

const randomNumber = () => Math.floor(Math.random() * 99999 + 1)
