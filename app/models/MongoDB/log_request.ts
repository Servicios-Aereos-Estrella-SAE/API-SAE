import mongoose from 'mongoose'
import Env from '#start/env'

export class LogRequest {
  private static instance: LogRequest
  private connections: { [key: string]: mongoose.Model<any> } = {}
  isConnected = false
  private retryTimeout = 10000
  private isReconnecting = false
  private connectionTimeout = 5000

  static getInstance(): LogRequest {
    if (!LogRequest.instance) {
      LogRequest.instance = new LogRequest()
    }
    return LogRequest.instance
  }
  async dbConnect() {
    if (this.isConnected) return

    const uri = Env.get('MONGODB_USER')
      ? `mongodb://${Env.get('MONGODB_USER')}:${Env.get('MONGODB_PASSWORD')}@${Env.get('MONGODB_HOST')}:${Env.get('MONGODB_PORT')}/${Env.get('MONGODB_DB_NAME')}`
      : `mongodb://${Env.get('MONGODB_HOST')}:${Env.get('MONGODB_PORT')}/${Env.get('MONGODB_DB_NAME')}`

    try {
      await Promise.race([
        mongoose.connect(uri),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timed out')), this.connectionTimeout)
        ),
      ])
      this.isConnected = true
      //console.log("se pudo conectar a MongoDB")
    } catch (error) {
      //console.error("MongoDB conexion error:", error)
      this.isConnected = false
      this.isConnected = false
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.isReconnecting) return

    this.isReconnecting = true
    setTimeout(async () => {
      // console.log("reconectando")
      await this.dbConnect()
      this.isReconnecting = false
    }, this.retryTimeout)
  }

  getModel(collectionName: string): mongoose.Model<any> {
    if (!this.connections[collectionName]) {
      this.connections[collectionName] =
        mongoose.models[collectionName] ||
        mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }))
    }
    return this.connections[collectionName]
  }
}
