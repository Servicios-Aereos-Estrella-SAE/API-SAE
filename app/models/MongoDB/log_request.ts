import mongoose from 'mongoose'
import Env from '#start/env'

interface LogRequestModel {
  user_id: number
  route: string
  user_agent: string | null
  sec_ch_ua_platform: string | null
  sec_ch_ua: string | null
  date: string
}

export default class LogRequest {
  private static instance: LogRequest
  private documentName = 'log_request' as const
  private modelSchema: mongoose.Model<any>
  private connection: any
  constructor() {
    this.modelSchema =
      mongoose.models[this.documentName] ||
      mongoose.model(
        this.documentName,
        new mongoose.Schema({
          user_id: Number,
          route: String,
          user_agent: String,
          sec_ch_ua_platform: String,
          sec_ch_ua: String,
          date: String,
        })
      )
  }

  static getInstance(): LogRequest {
    if (!LogRequest.instance) {
      LogRequest.instance = new LogRequest()
    }

    return LogRequest.instance
  }

  private async dbConnect() {
    if (Env.get('MONGODB_USER')) {
      this.connection = await mongoose.connect(
        `mongodb://${Env.get('MONGODB_USER')}:${Env.get('MONGODB_PASSWORD')}@${Env.get('MONGODB_HOST')}:${Env.get('MONGODB_PORT')}/${Env.get('MONGODB_DB_NAME')}`
      )
    } else {
      this.connection = await mongoose.connect(
        `mongodb://${Env.get('MONGODB_HOST')}:${Env.get('MONGODB_PORT')}/${Env.get('MONGODB_DB_NAME')}`
      )
    }
  }

  static async save(LogRequestModel: LogRequestModel) {
    const schemaInstance = LogRequest.getInstance()
    try {
      await schemaInstance.dbConnect()
      const req = schemaInstance.modelSchema
      const request = new req(LogRequestModel)
      const newLog = await request.save()
      schemaInstance.connection.disconnect()
      return newLog
    } catch (error) {
      schemaInstance.connection.disconnect()
      return null
    }
  }
}
