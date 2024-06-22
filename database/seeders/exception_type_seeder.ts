import ExceptionType from '#models/exception_type'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await ExceptionType.createMany([
      {
        exceptionTypeTypeName: 'absence from work',
        exceptionTypeIcon: 'icon_absence_from_work',
        exceptionTypeSlug: 'absence-from-work',
        exceptionTypeCreatedAt: DateTime.now(),
      },
      {
        exceptionTypeTypeName: 'late arrival',
        exceptionTypeIcon: 'icon_late_arrival',
        exceptionTypeSlug: 'late-arrival',
        exceptionTypeCreatedAt: DateTime.now(),
      },
      {
        exceptionTypeTypeName: 'early departure',
        exceptionTypeIcon: 'icon_early_departure',
        exceptionTypeSlug: 'early-departure',
        exceptionTypeCreatedAt: DateTime.now(),
      },
      {
        exceptionTypeTypeName: 'leaving during work hours',
        exceptionTypeIcon: 'icon_leaving_during_work_hours',
        exceptionTypeSlug: 'leaving-during-work-hours',
        exceptionTypeCreatedAt: DateTime.now(),
      },
      {
        exceptionTypeTypeName: 'working during non-working hours',
        exceptionTypeIcon: 'icon_working_during_non_working_hours',
        exceptionTypeSlug: 'working-during-non-working-hours',
        exceptionTypeCreatedAt: DateTime.now(),
      },
      {
        exceptionTypeTypeName: 'vacation',
        exceptionTypeIcon: 'icon_vacation',
        exceptionTypeSlug: 'vacation',
        exceptionTypeCreatedAt: DateTime.now(),
      },
      {
        exceptionTypeTypeName: 'overtime',
        exceptionTypeIcon: 'icon_overtime',
        exceptionTypeSlug: 'overtime',
        exceptionTypeCreatedAt: DateTime.now(),
      },
    ])
  }
}
