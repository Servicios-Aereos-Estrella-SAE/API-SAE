import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'system_setting_payroll_configs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('system_setting_payroll_config_id')
      table.enum('system_setting_payroll_config_payment_type', ['biweekly', 'fixed_day_every_n_weeks', 'specific_day_of_month'])
        .nullable()

      table.integer('system_setting_payroll_config_number_of_days_to_be_paid')
        .nullable()
      
      table.integer('system_setting_payroll_config_number_of_overdue_days_to_offset')
        .nullable()

      table.date('system_setting_payroll_config_apply_since')
        .nullable()

      table.integer('system_setting_id').unsigned().notNullable()
      table
        .foreign('system_setting_id')
        .references('system_settings.system_setting_id')

      table.timestamp('system_setting_payroll_config_created_at').notNullable()
      table.timestamp('system_setting_payroll_config_updated_at').notNullable()
      table.timestamp('system_setting_payroll_config_deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}