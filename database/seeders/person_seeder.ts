import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Person from '../../app/models/person.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Person.createMany([
      {
        person_firstname: 'Jose Guadalupe',
        person_lastname: 'Soto',
        person_second_lastname: 'Becerra',
        person_gender: 'Hombre',
        person_birthday: '1996-09-06',
        person_phone: '8711384461',
        person_curp: 'SOBG960906HCLTCD',
        person_rfc: 'SOBG960906U66',
        person_imss_nss: '123456789',
      },
    ])
  }
}
