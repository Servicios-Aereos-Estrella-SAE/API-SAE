import ProceedingFileType from '#models/proceeding_file_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await ProceedingFileType.createMany([
      {
        proceedingFileTypeName: 'INE',
        proceedingFileTypeSlug: 'ine',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Contrato laboral',
        proceedingFileTypeSlug: 'contrato-laboral',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Licencia de manejo',
        proceedingFileTypeSlug: 'licencia-de-manejo',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Licencia de vuelo',
        proceedingFileTypeSlug: 'licencia-de-vuelo',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Contrato de proveedores',
        proceedingFileTypeSlug: 'contrato-de-proveedores',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Contrato de vuelo',
        proceedingFileTypeSlug: 'contrato-de-vuelo',
        proceedingFileTypeAreaToUse: 'Plane',
        proceedingFileTypeActive: 1,
      },
    ])
  }
}
