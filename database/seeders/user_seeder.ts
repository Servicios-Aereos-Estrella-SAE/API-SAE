import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        user_email: 'joseguadalupesotobecerra9604@gmail.com',
        user_password: '1234567890ee',
        user_active: 1,
        person_id: 1,
        role_id: 1,
      },
      {
        user_email: 'joseguadalupesotobecerra9605@gmail.com',
        user_password: '1234567890',
        user_active: 1,
        person_id: 1,
        role_id: 1,
      },
    ])
  }
}
