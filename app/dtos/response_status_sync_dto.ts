export default class StatusSyncDto {
  declare message: string
  declare status: string
  declare statusIdSync: number
  constructor(message: string, status: string, statusIdSync: number) {
    this.message = message
    this.status = status
    this.statusIdSync = statusIdSync
  }
}
