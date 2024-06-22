import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        userId: 1,
        userEmail: 'betosimon@sae.com.mx',
        userPassword: 'o3"kJ>=L22^[',
        userActive: 1,
        personId: 1,
        roleId: 1,
      },
      {
        userId: 2,
        userEmail: 'raul.munoz@transformadigital.mx',
        userPassword: 'admin',
        userActive: 1,
        personId: 2,
        roleId: 1,
      },
      {
        userId: 3,
        userEmail: 'wramirez@siler-mx.com',
        userPassword: 'adminSystemSAE123.',
        userActive: 1,
        personId: 3,
        roleId: 1,
      },
      {
        userId: 4,
        userEmail: 'developer@sae.com.mx',
        userPassword: 'adminSystemSAE123.',
        userActive: 1,
        personId: 4,
        roleId: 1,
      },
      {
        userId: 5,
        userEmail: 'joseguadalupesotobecerra9605@gmail.com',
        userPassword: '1234567890',
        userActive: 1,
        personId: 5,
        roleId: 1,
      },
    ])
  }
}
