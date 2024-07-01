import Person from '#models/person'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
import { PersonFilterSearchInterface } from '../interfaces/person_filter_search_interface.js'

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

  async index(filters: PersonFilterSearchInterface) {
    const persons = await Person.query()
      .if(filters.search, (query) => {
        query.whereRaw(
          'UPPER(CONCAT(person_firstname, " ", person_lastname, " ", person_second_lastname)) LIKE ?',
          [`%${filters.search.toUpperCase()}%`]
        )
        query.orWhereRaw('UPPER(person_phone) LIKE ?', [`%${filters.search.toUpperCase()}%`])
        query.orWhereRaw('UPPER(person_curp) LIKE ?', [`%${filters.search.toUpperCase()}%`])
        query.orWhereRaw('UPPER(person_rfc) LIKE ?', [`%${filters.search.toUpperCase()}%`])
        query.orWhereRaw('UPPER(person_imss_nss) LIKE ?', [`%${filters.search.toUpperCase()}%`])
      })
      .orderBy('person_id')
      .paginate(filters.page, filters.limit)
    return persons
  }

  async create(person: Person) {
    const newPerson = new Person()
    newPerson.personFirstname = person.personFirstname
    newPerson.personLastname = person.personLastname
    newPerson.personSecondLastname = person.personSecondLastname
    newPerson.personBirthday = person.personBirthday
    newPerson.personGender = person.personGender
    newPerson.personPhone = person.personPhone
    newPerson.personCurp = person.personCurp
    newPerson.personRfc = person.personRfc
    newPerson.personImssNss = person.personImssNss
    await newPerson.save()
    return newPerson
  }

  async update(currentPerson: Person, person: Person) {
    currentPerson.personFirstname = person.personFirstname
    currentPerson.personLastname = person.personLastname
    currentPerson.personSecondLastname = person.personSecondLastname
    currentPerson.personBirthday = person.personBirthday
    currentPerson.personGender = person.personGender
    currentPerson.personPhone = person.personPhone
    currentPerson.personCurp = person.personCurp
    currentPerson.personRfc = person.personRfc
    currentPerson.personImssNss = person.personImssNss
    await currentPerson.save()
    return currentPerson
  }

  async delete(currentPerson: Person) {
    await currentPerson.delete()
    return currentPerson
  }

  async show(personId: number) {
    const person = await Person.query()
      .whereNull('person_deleted_at')
      .where('person_id', personId)
      .first()
    return person ? person : null
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

  async verifyInfo(person: Person) {
    const action = person.personId > 0 ? 'updated' : 'created'
    const existCurp = await Person.query()
      .if(person.personId > 0, (query) => {
        query.whereNot('person_id', person.personId)
      })
      .whereNull('person_deleted_at')
      .where('person_curp', person.personCurp)
      .first()

    if (existCurp && person.personCurp) {
      return {
        status: 400,
        type: 'warning',
        title: 'The person curp already exists for another person',
        message: `The person resource cannot be ${action} because the curp is already assigned to another person`,
        data: { ...person },
      }
    }
    const existRfc = await Person.query()
      .if(person.personId > 0, (query) => {
        query.whereNot('person_id', person.personId)
      })
      .whereNull('person_deleted_at')
      .where('person_rfc', person.personRfc)
      .first()

    if (existRfc && person.personRfc) {
      return {
        status: 400,
        type: 'warning',
        title: 'The person rfc already exists for another person',
        message: `The person resource cannot be ${action} because the rfc is already assigned to another person`,
        data: { ...person },
      }
    }
    const existImssNss = await Person.query()
      .if(person.personId > 0, (query) => {
        query.whereNot('person_id', person.personId)
      })
      .whereNull('person_deleted_at')
      .where('person_imss_nss', person.personImssNss)
      .first()

    if (existImssNss && person.personImssNss) {
      return {
        status: 400,
        type: 'warning',
        title: 'The person imss nss already exists for another person',
        message: `The person resource cannot be ${action} because the imss nss is already assigned to another person`,
        data: { ...person },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...person },
    }
  }
}
