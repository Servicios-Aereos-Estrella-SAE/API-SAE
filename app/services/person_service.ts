import Person from '#models/person'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'

export default class PersonService {
  async syncCreate(employee: BiometricEmployeeInterface) {
    const newPerson = new Person()
    newPerson.personFirstname = employee.firstName
    newPerson.personLastname = employee.lastName
    await newPerson.save()
    return newPerson
  }
}
