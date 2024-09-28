import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'proceeding_files'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('proceeding_file_observations', 'longtext').nullable()
      table.text('proceeding_file_afac_rights', 'longtext').nullable()
      table.timestamp('proceeding_file_signature_date').nullable()
      table.timestamp('proceeding_file_effective_start_date').nullable()
      table.timestamp('proceeding_file_effective_end_date').nullable()
      table.timestamp('proceeding_file_inclusion_in_the_files_date').nullable()
      table.double('proceeding_file_operation_cost', 10, 2).nullable().defaultTo(0)
      table.tinyint('proceeding_file_complete_process').nullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('proceeding_file_observations')
      table.dropColumn('proceeding_file_afac_rights')
      table.dropColumn('proceeding_file_signature_date')
      table.dropColumn('proceeding_file_effective_start_date')
      table.dropColumn('proceeding_file_effective_end_date')
      table.dropColumn('proceeding_file_inclusion_in_the_files_date')
      table.dropColumn('proceeding_file_operation_cost')
      table.dropColumn('proceeding_file_complete_process')
    })
  }
}
