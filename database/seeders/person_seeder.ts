import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Person from '../../app/models/person.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Person.createMany([
      {
        personId: 1,
        personFirstname: 'Beto Simon',
        personLastname: '',
        personSecondLastname: '',
        personGender: 'Hombre',
        personBirthday: '1995-01-01',
        personPhone: '123456789',
        personCurp: '123456789',
        personRfc: '123456789',
        personImssNss: '123456789',
      },
      {
        personId: 2,
        personFirstname: 'Raúl',
        personLastname: 'Muñoz',
        personSecondLastname: '',
        personGender: 'Hombre',
        personBirthday: '1995-01-01',
        personPhone: '123456789',
        personCurp: '123456789',
        personRfc: '123456789',
        personImssNss: '123456789',
      },
      {
        personId: 3,
        personFirstname: 'Wilvardo',
        personLastname: 'Ramirez',
        personSecondLastname: 'Colunga',
        personGender: 'Hombre',
        personBirthday: '1995-01-01',
        personPhone: '123456789',
        personCurp: '123456789',
        personRfc: '123456789',
        personImssNss: '123456789',
      },
      {
        personId: 4,
        personFirstname: 'SAE Developer Admin',
        personLastname: '',
        personSecondLastname: '',
        personGender: 'Hombre',
        personBirthday: '1995-01-01',
        personPhone: '123456789',
        personCurp: '123456789',
        personRfc: '123456789',
        personImssNss: '123456789',
      },
      {
        personId: 5,
        personFirstname: 'Jose Guadalupe',
        personLastname: 'Soto',
        personSecondLastname: 'Becerra',
        personGender: 'Hombre',
        personBirthday: '1996-09-06',
        personPhone: '8711384461',
        personCurp: 'SOBG960906HCLTCD07',
        personRfc: 'SOBG960906U66',
        personImssNss: '41169601873',
      },
    ])
  }
}
