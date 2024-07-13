import axios from 'axios'
import crypto from 'node:crypto'
import fs from 'node:fs'
import Env from '#start/env'

export default class UploadFileService {
  private accessKeyId: string
  private secretAccessKey: string
  private endpoint: string
  private bucketName: string
  private region: string
  private rootPath: string

  constructor() {
    this.accessKeyId = Env.get('AWS_ACCESS_KEY_ID', '')
    this.secretAccessKey = Env.get('AWS_SECRET_ACCESS_KEY', '')
    this.endpoint = Env.get('AWS_ENDPOINT', '')
    this.bucketName = Env.get('AWS_BUCKET', '')
    this.region = Env.get('AWS_DEFAULT_REGION', '')
    this.rootPath = Env.get('AWS_ROOT_PATH', '')
  }

  private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
    const kDate = crypto.createHmac('sha256', `AWS4${key}`).update(dateStamp).digest()
    const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest()
    const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest()
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()
    return kSigning
  }

  private async uploadFile(
    filePath: string,
    fileName: string,
    folderName = '',
    permission = 'public-read'
  ) {
    const fileContent = fs.readFileSync(filePath)
    const fileKey = `${this.rootPath}/${folderName || 'files'}/${fileName}`

    const method = 'PUT'
    const service = 's3'
    const host = `${this.bucketName}.${this.endpoint}`
    const endpoint = `https://${host}/${fileKey}`
    const region = this.region
    const contentType = 'application/octet-stream'
    const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = amzDate.substr(0, 8)

    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\nx-amz-acl:${permission}\n`
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date;x-amz-acl'
    const payloadHash = 'UNSIGNED-PAYLOAD'

    const canonicalRequest = [
      method,
      `/${fileKey}`,
      '',
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n')

    const algorithm = 'AWS4-HMAC-SHA256'
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
    ].join('\n')

    const signingKey = this.getSignatureKey(this.secretAccessKey, dateStamp, region, service)
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')

    const authorizationHeader = `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const headers = {
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
      'x-amz-acl': permission,
      'Authorization': authorizationHeader,
      'Content-Type': contentType,
    }

    const response = await axios.put(endpoint, fileContent, { headers })
    return response.data
  }

  async fileUpload(file: any, folderName = '', fileName = '', permission = 'public-read') {
    try {
      if (!file) {
        return { status: 404, data: null, message: 'file_not_found' }
      }

      const timestamp = new Date().getTime()
      const randomValue = Math.random().toFixed(10).toString().replace('.', '')
      const fileNameGenerated = fileName || `T${timestamp}R${randomValue}.${file.extname}`

      const response = await this.uploadFile(
        file.tmpPath,
        fileNameGenerated,
        folderName,
        permission
      )
      return { status: 200, data: response }
    } catch (err) {
      return { status: 500, data: err, location: 'UploadService.fileUpload' }
    }
  }

  async base64Upload(
    b64: string,
    type: string,
    folderName = '',
    fileName = '',
    permission = 'public-read'
  ) {
    try {
      if (!b64) {
        return { status: 404, data: null, message: 'file_not_found' }
      }

      const buffer = Buffer.from(b64, 'base64')
      const tmpPath = '/tmp/uploaded_file'
      fs.writeFileSync(tmpPath, buffer)

      const timestamp = new Date().getTime()
      const randomValue = Math.random().toFixed(10).toString().replace('.', '')
      const fileNameGenerated = fileName || `T${timestamp}R${randomValue}.${type}`

      const response = await this.uploadFile(tmpPath, fileNameGenerated, folderName, permission)
      fs.unlinkSync(tmpPath)
      return { status: 200, data: response }
    } catch (err) {
      return { status: 500, data: err, location: 'UploadService.base64Upload' }
    }
  }
}
