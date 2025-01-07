import InsuranceCoverageType from '#models/insurance_coverage_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const dateTime = DateTime.now()

    await InsuranceCoverageType.createMany([
      {
        insuranceCoverageTypeId: 1,
        insuranceCoverageTypeName: 'riesgo de trabajo',
        insuranceCoverageTypeDescription: 'riesgo de trabajo',
        insuranceCoverageTypeSlug: 'riesgo-de-trabajo',
        insuranceCoverageTypeActive: 1,
        insuranceCoverageTypeCreatedAt: dateTime,
        insuranceCoverageTypeUpdatedAt: dateTime,
      },
      {
        insuranceCoverageTypeId: 2,
        insuranceCoverageTypeName: 'enfermedad general',
        insuranceCoverageTypeDescription: 'enfermedad general',
        insuranceCoverageTypeSlug: 'enfermedad-general',
        insuranceCoverageTypeActive: 1,
        insuranceCoverageTypeCreatedAt: dateTime,
        insuranceCoverageTypeUpdatedAt: dateTime,
      },
      {
        insuranceCoverageTypeId: 3,
        insuranceCoverageTypeName: 'maternidad',
        insuranceCoverageTypeDescription: 'maternidad',
        insuranceCoverageTypeSlug: 'maternidad',
        insuranceCoverageTypeActive: 1,
        insuranceCoverageTypeCreatedAt: dateTime,
        insuranceCoverageTypeUpdatedAt: dateTime,
      },
    ])
  }
}
