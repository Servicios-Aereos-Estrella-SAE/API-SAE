import { DateTime } from 'luxon'
import { LogFilterSearchInterface } from '../../interfaces/MongoDB/log_filter_search_interface.js'
import { LogRequestModel } from '../../interfaces/MongoDB/log_request_model.js'
import { LogRequest } from './log_request.js'

export class LogStore {
  static async set(collectionName: string, logData: LogRequestModel) {
    const logRequest = LogRequest.getInstance()
    if (!logRequest.isConnected) {
      logRequest.scheduleReconnect()
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
      logRequest.scheduleReconnect()
    }
  }

  static async get(filter: LogFilterSearchInterface) {
    const logRequest = LogRequest.getInstance()
    if (!logRequest.isConnected) {
      logRequest.scheduleReconnect()
      // console.warn("No se conectó a mongo. No se puede obtener el log.")
      return []
    }

    try {
      const model = logRequest.getModel(filter.entity)
      const startDate = DateTime.fromISO(filter.startDate).startOf('day').toISO()
      const endDate = DateTime.fromISO(filter.endDate).endOf('day').toISO()
      const query = {
        user_id: filter.userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
        ...filter.otherFilters,
      }
      const results = await model.find(query)
      return results
    } catch (error) {
      logRequest.isConnected = false
      logRequest.scheduleReconnect()
      return null
    }
  }
}
