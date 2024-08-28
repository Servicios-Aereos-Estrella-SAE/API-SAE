/* eslint-disable unicorn/filename-case */

import { ResponseDataInterface } from '../interfaces/response_data_interface.js'
import { ResponseDataMetaInterface } from '../interfaces/response_data_meta_interface.js'

export function formatResponse(
  type: string,
  title: string,
  message: string,
  data: any,
  meta?: ResponseDataMetaInterface
): ResponseDataInterface {
  return {
    type,
    title,
    message,
    data: {
      meta,
      data,
    },
  }
}
