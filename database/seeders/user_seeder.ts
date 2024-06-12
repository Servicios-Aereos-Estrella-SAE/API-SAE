import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        user_email: 'betosimon@sae.com.mx',
        user_password: 'o3"kJ>=L22^[',
        user_active: 1,
        person_id: 1,
        role_id: 1,
      },
      {
        user_email: 'raul.munoz@transformadigital.mx',
        user_password: 'admin',
        user_active: 1,
        person_id: 2,
        role_id: 1,
      },
      {
        user_email: 'wramirez@siler-mx.com',
        user_password: 'adminSystemSAE123.',
        user_active: 1,
        person_id: 3,
        role_id: 1,
      },
      {
        user_email: 'developer@sae.com.mx',
        user_password: 'adminSystemSAE123.',
        user_active: 1,
        person_id: 4,
        role_id: 1,
      },
      {
        user_email: 'joseguadalupesotobecerra9605@gmail.com',
        user_password: '1234567890',
        user_active: 1,
        person_id: 5,
        role_id: 1,
      },
    ])
  }
}
