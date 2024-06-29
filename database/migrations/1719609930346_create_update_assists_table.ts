import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assists'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('id', 'assist_id')
      table.renameColumn('emp_code', 'assist_emp_code')
      table.renameColumn('punch_time', 'assist_punch_time')
      table.renameColumn('punch_time_utc', 'assist_punch_time_utc')
      table.renameColumn('punch_time_origin', 'assist_punch_time_origin')
      table.renameColumn('terminal_sn', 'assist_terminal_sn')
      table.renameColumn('terminal_alias', 'assist_terminal_alias')
      table.renameColumn('area_alias', 'assist_area_alias')
      table.renameColumn('longitude', 'assist_longitude')
      table.renameColumn('latitude', 'assist_latitude')
      table.renameColumn('upload_time', 'assist_upload_time')
      table.renameColumn('emp_id', 'assist_emp_id')
      table.renameColumn('terminal_id', 'assist_terminal_id')
      table.renameColumn('created_at', 'assist_created_at')
      table.renameColumn('updated_at', 'assist_updated_at')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('assist_id', 'id')
      table.renameColumn('assist_emp_code', 'emp_code')
      table.renameColumn('assist_punch_time', 'punch_time')
      table.renameColumn('assist_punch_time_utc', 'punch_time_utc')
      table.renameColumn('assist_punch_time_origin', 'punch_time_origin')
      table.renameColumn('assist_terminal_sn', 'terminal_sn')
      table.renameColumn('assist_terminal_alias', 'terminal_alias')
      table.renameColumn('assist_area_alias', 'area_alias')
      table.renameColumn('assist_longitude', 'longitude')
      table.renameColumn('assist_latitude', 'latitude')
      table.renameColumn('assist_upload_time', 'upload_time')
      table.renameColumn('assist_emp_id', 'emp_id')
      table.renameColumn('assist_terminal_id', 'terminal_id')
      table.renameColumn('assist_created_at', 'created_at')
      table.renameColumn('assist_updated_at', 'updated_at')
    })
  }
}
