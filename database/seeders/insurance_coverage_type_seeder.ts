import InsuranceCoverageType from '#models/insurance_coverage_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const dateTime = DateTime.now()

    await InsuranceCoverageType.createMany([
      {
        insuranceCoverageTypeId: 1,
        insuranceCoverageTypeName: 'work risk',
        insuranceCoverageTypeDescription: 'work risk',
        insuranceCoverageTypeSlug: 'work-risk',
        insuranceCoverageTypeCreatedAt: dateTime,
        insuranceCoverageTypeUpdatedAt: dateTime,
      },
      {
        insuranceCoverageTypeId: 2,
        insuranceCoverageTypeName: 'general illness',
        insuranceCoverageTypeDescription: 'general illness',
        insuranceCoverageTypeSlug: 'general-illness',
        insuranceCoverageTypeCreatedAt: dateTime,
        insuranceCoverageTypeUpdatedAt: dateTime,
      },
      {
        insuranceCoverageTypeId: 1,
        insuranceCoverageTypeName: 'maternity',
        insuranceCoverageTypeDescription: 'maternity',
        insuranceCoverageTypeSlug: 'maternity',
        insuranceCoverageTypeCreatedAt: dateTime,
        insuranceCoverageTypeUpdatedAt: dateTime,
      },
    ])
  }
}
