import Person from '#models/person'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'

export default class PersonService {
  async syncCreate(employee: BiometricEmployeeInterface) {
    const newPerson = new Person()
    newPerson.personFirstname = employee.firstName
    const lastNames = await this.getLastNames(employee.lastName)
    newPerson.personLastname = lastNames.lastName
    newPerson.personSecondLastname = lastNames.secondLastName
    await newPerson.save()
    return newPerson
  }

  private getLastNames(lastNames: string) {
    const names = {
      lastName: '',
      secondLastName: '',
    }
    if (lastNames) {
      const lastNameParts = lastNames.trim().split(' ')
      if (lastNameParts.length > 1) {
        names.lastName = lastNameParts[0]
        names.secondLastName = lastNameParts.slice(1).join(' ')
      } else {
        names.lastName = lastNameParts[0]
      }
    }
    return names
  }
}
