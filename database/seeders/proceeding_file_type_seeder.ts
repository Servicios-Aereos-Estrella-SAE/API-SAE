import ProceedingFileType from '#models/proceeding_file_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await ProceedingFileType.createMany([
      {
        proceedingFileTypeName: 'INE',
        proceedingFileTypeIcon: '',
        proceedingFileTypeSlug: 'ine',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Contrato laboral',
        proceedingFileTypeIcon: '',
        proceedingFileTypeSlug: 'contrato-laboral',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Licencia de manejo',
        proceedingFileTypeIcon: '',
        proceedingFileTypeSlug: 'licencia-de-manejo',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Licencia de vuelo',
        proceedingFileTypeIcon: '',
        proceedingFileTypeSlug: 'licencia-de-vuelo',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Contrato de proveedores',
        proceedingFileTypeIcon: '',
        proceedingFileTypeSlug: 'contrato-de-proveedores',
        proceedingFileTypeAreaToUse: 'Employee',
        proceedingFileTypeActive: 1,
      },
      {
        proceedingFileTypeName: 'Contrato de vuelo',
        proceedingFileTypeIcon: '',
        proceedingFileTypeSlug: 'contrato-de-vuelo',
        proceedingFileTypeAreaToUse: 'Plane',
        proceedingFileTypeActive: 1,
      },
    ])
  }
}
