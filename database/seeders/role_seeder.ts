import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '../../app/models/Role.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      {
        role_name: 'Admin',
        role_slug: 'admin',
        role_description: 'Administrador',
        role_active: 1,
      },
    ])
  }
}
