import { LogRequestModel } from '../../interfaces/MongoDB/log_request_model.js'
import { LogRequest } from './log_request.js'

export class LogStore {
  static async set(collectionName: string, logData: LogRequestModel) {
    const logRequest = LogRequest.getInstance()
    if (!logRequest.isConnected) {
      // console.warn("No se conecto a mongo. no se guardo el log")
      return
    }

    try {
      const model = logRequest.getModel(collectionName)
      const logDocument = new model(logData)
      await logDocument.save()
    } catch (error) {
      // console.error("Error guardando el log:", error)
      logRequest.isConnected = false
    }
  }
}
