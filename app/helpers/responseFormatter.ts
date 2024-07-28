/* eslint-disable unicorn/filename-case */
interface Meta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  first_page: number
}

interface ResponseData {
  type: string
  title: string
  message: string
  data: {
    meta?: Meta
    data: any
  }
}

export function formatResponse(
  type: string,
  title: string,
  message: string,
  data: any,
  meta?: Meta
): ResponseData {
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
