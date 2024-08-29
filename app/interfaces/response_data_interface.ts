import { ResponseDataMetaInterface } from './response_data_meta_interface.js'

interface ResponseDataInterface {
  status?: number
  type: string
  title: string
  message: string
  data: {
    meta?: ResponseDataMetaInterface
    data: any
  }
}

export type { ResponseDataInterface }
