import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Person from '../../app/models/person.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Person.createMany([
      {
        person_firstname: 'Beto Simon',
        person_lastname: '',
        person_second_lastname: '',
        person_gender: 'Hombre',
        person_birthday: '1995-01-01',
        person_phone: '123456789',
        person_curp: '123456789',
        person_rfc: '123456789',
        person_imss_nss: '123456789',
      },
      {
        person_firstname: 'Raúl',
        person_lastname: 'Muñoz',
        person_second_lastname: '',
        person_gender: 'Hombre',
        person_birthday: '1995-01-01',
        person_phone: '123456789',
        person_curp: '123456789',
        person_rfc: '123456789',
        person_imss_nss: '123456789',
      },
      {
        person_firstname: 'Wilvardo',
        person_lastname: 'Ramirez',
        person_second_lastname: 'Colunga',
        person_gender: 'Hombre',
        person_birthday: '1995-01-01',
        person_phone: '123456789',
        person_curp: '123456789',
        person_rfc: '123456789',
        person_imss_nss: '123456789',
      },
      {
        person_firstname: 'SAE Developer Admin',
        person_lastname: '',
        person_second_lastname: '',
        person_gender: 'Hombre',
        person_birthday: '1995-01-01',
        person_phone: '123456789',
        person_curp: '123456789',
        person_rfc: '123456789',
        person_imss_nss: '123456789',
      },
      {
        person_firstname: 'Jose Guadalupe',
        person_lastname: 'Soto',
        person_second_lastname: 'Becerra',
        person_gender: 'Hombre',
        person_birthday: '1996-09-06',
        person_phone: '8711384461',
        person_curp: 'SOBG960906HCLTCD07',
        person_rfc: 'SOBG960906U66',
        person_imss_nss: '41169601873',
      },
    ])
  }
}
