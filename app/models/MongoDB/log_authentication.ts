import mongoose from 'mongoose'
import Env from '#start/env'

interface LogAuthenticationModel {
  user_id: Number
  date: String
}

export default class LogAuthentication {
  private static instance: LogAuthentication
  private documentName = 'log_authentication' as const
  private modelSchema: mongoose.Model<any>
  private connection: any

  constructor() {
    this.modelSchema =
      mongoose.models[this.documentName] ||
      mongoose.model(
        this.documentName,
        new mongoose.Schema({
          user_id: Number,
          date: String,
        })
      )
  }

  static getInstance(): LogAuthentication {
    if (!LogAuthentication.instance) {
      LogAuthentication.instance = new LogAuthentication()
    }
    return LogAuthentication.instance
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

  static async save(LogAuthenticationModel: LogAuthenticationModel) {
    const schemaInstance = LogAuthentication.getInstance()
    try {
      await schemaInstance.dbConnect()
      const req = schemaInstance.modelSchema
      const request = new req(LogAuthenticationModel)
      const newLog = await request.save()
      schemaInstance.connection.disconnect()
      return newLog
    } catch (error) {
      schemaInstance.connection.disconnect()
      return null
    }
  }

  static async findByUserId(userId: Number) {
    const schemaInstance = LogAuthentication.getInstance()
    try {
      await schemaInstance.dbConnect()
      const req = schemaInstance.modelSchema
      const logFinded = await req.find({ user_id: userId }).sort({ date: -1 })
      schemaInstance.connection.disconnect()
      return logFinded
    } catch (error) {
      schemaInstance.connection.disconnect()
      return []
    }
  }
}
