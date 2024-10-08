import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UploadService from '#services/upload_service'
import ProceedingFileService from '#services/proceeding_file_service'
import ProceedingFile from '#models/proceeding_file'
import Env from '#start/env'
import {
  createProceedingFileValidator,
  updateProceedingFileValidator,
} from '#validators/proceeding_file'
import { cuid } from '@adonisjs/core/helpers'
import path from 'node:path'
import ProceedingFileHasStatus from '#models/proceeding_file_has_status'
import ProceedingFileHasStatusService from '#services/proceeding_file_has_status_service'
export default class ProceedingFileController {
  /**
   * @swagger
   * /api/proceeding-files:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding Files
   *     summary: get all proceeding files
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Object processed
   *       '404':
   *         description: The resource could not be found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */

  async index({ response }: HttpContext) {
    try {
      const proceedingFiles = await ProceedingFile.query().whereNull('proceeding_file_deleted_at')
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources were found successfully',
        data: proceedingFiles,
      })
    } catch (error) {
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * @swagger
   * /api/proceeding-files/:
   *   post:
   *     summary: Upload a file
   *     tags:
   *       - Proceeding Files
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: The file to upload
   *               proceedingFileName:
   *                 type: string
   *                 description: Proceeding file name
   *                 required: true
   *                 default: ''
   *               proceedingFileTypeId:
   *                 type: number
   *                 description: Proceeding file type id
   *                 required: true
   *                 default: ''
   *               proceedingFileExpirationAt:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file expiration at (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileActive:
   *                 type: boolean
   *                 description: Proceeding file status
   *                 required: false
   *                 default: true
   *               proceedingFileIdentify:
   *                 type: string
   *                 description: Proceeding file identify
   *                 required: false
   *                 default: ''
   *               proceedingFileObservations:
   *                 type: string
   *                 description: Proceeding file observations
   *                 required: false
   *                 default: ''
   *               proceedingFileAfacRights:
   *                 type: string
   *                 description: Proceeding file AFAC rights
   *                 required: false
   *                 default: ''
   *               proceedingFileSignatureDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file signature date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileEffectiveStartDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file effective start date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileEffectiveEndDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file effective end date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileInclusionInTheFilesDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file inclusion in the files date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileOperationCost:
   *                 type: number
   *                 description: Proceeding file operation cost
   *                 required: false
   *                 default: 0
   *               proceedingFileCompleteProcess:
   *                 type: number
   *                 description: Proceeding file complete process
   *                 required: false
   *                 default: '0'
   *               proceedingFileStatusId:
   *                 type: number
   *                 description: Proceeding file status id
   *                 required: false
   *                 default: ''
   *     responses:
   *       '201':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  @inject()
  async store({ request, response }: HttpContext) {
    await request.validateUsing(createProceedingFileValidator)
    const validationOptions = {
      types: ['image', 'document', 'text', 'application', 'archive'],
      size: '',
    }
    const file = request.file('file', validationOptions)
    // validate file required
    if (!file) {
      response.status(400)
      return {
        status: 400,
        type: 'warning',
        title: 'Please upload a file valid',
        message: 'Missing data to process',
        data: file,
      }
    }
    const disallowedExtensions = [
      'mp4',
      'avi',
      'mkv',
      'mov',
      'wmv',
      'flv', // Video
      'mp3',
      'wav',
      'flac',
      'aac',
      'ogg', // Audio
    ]
    // Verificar si la extensión del archivo está en la lista de no permitidas
    if (disallowedExtensions.includes(file.extname ? file.extname : '')) {
      response.status(400)
      return {
        status: 400,
        type: 'warning',
        title: 'Please upload a file valid',
        message: 'Missing data to process',
        data: file,
      }
    }
    const proceedingFileName = request.input('proceedingFileName')
    const proceedingFileTypeId = request.input('proceedingFileTypeId')
    let proceedingFileExpirationAt = request.input('proceedingFileExpirationAt', null)
    if (proceedingFileExpirationAt === 'undefined' || proceedingFileExpirationAt === 'null') {
      proceedingFileExpirationAt = null
    }
    const proceedingFileActive = request.input('proceedingFileActive')
    const proceedingFileIdentify = request.input('proceedingFileIdentify')

    const proceedingFileObservations = request.input('proceedingFileObservations')
    const proceedingFileAfacRights = request.input('proceedingFileAfacRights')
    const proceedingFileSignatureDate = request.input('proceedingFileSignatureDate')
    const proceedingFileEffectiveStartDate = request.input('proceedingFileEffectiveStartDate')
    const proceedingFileEffectiveEndDate = request.input('proceedingFileEffectiveEndDate')
    const proceedingFileInclusionInTheFilesDate = request.input(
      'proceedingFileInclusionInTheFilesDate'
    )
    const proceedingFileOperationCost = request.input('proceedingFileOperationCost')
    const proceedingFileCompleteProcess = request.input('proceedingFileCompleteProcess')
    const proceedingFileStatusId = request.input('proceedingFileStatusId')

    const proceedingFileUuid = cuid()
    const proceedingFile = {
      proceedingFileName: proceedingFileName,
      proceedingFilePath: '',
      proceedingFileTypeId: proceedingFileTypeId,
      proceedingFileExpirationAt: proceedingFileExpirationAt ? proceedingFileExpirationAt : null,
      proceedingFileActive:
        proceedingFileActive && (proceedingFileActive === 'true' || proceedingFileActive === '1')
          ? 1
          : 0,
      proceedingFileIdentify: proceedingFileIdentify,
      proceedingFileUuid: proceedingFileUuid,
      proceedingFileObservations: proceedingFileObservations,
      proceedingFileAfacRights: proceedingFileAfacRights,
      proceedingFileSignatureDate: proceedingFileSignatureDate,
      proceedingFileEffectiveStartDate: proceedingFileEffectiveStartDate,
      proceedingFileEffectiveEndDate: proceedingFileEffectiveEndDate,
      proceedingFileInclusionInTheFilesDate: proceedingFileInclusionInTheFilesDate,
      proceedingFileOperationCost: proceedingFileOperationCost,
      proceedingFileCompleteProcess: proceedingFileCompleteProcess,
    } as ProceedingFile
    // get file name and extension
    const fileName = `${new Date().getTime()}_${file.clientName}`
    const uploadService = new UploadService()
    const proceedingFileService = new ProceedingFileService()
    const isValidInfo = await proceedingFileService.verifyInfo(proceedingFile)
    if (isValidInfo.status !== 200) {
      response.status(isValidInfo.status)
      return {
        status: isValidInfo.status,
        type: isValidInfo.type,
        title: isValidInfo.title,
        message: isValidInfo.message,
        data: isValidInfo.data,
      }
    }
    try {
      const fileUrl = await uploadService.fileUpload(file, 'proceeding-files', fileName)
      proceedingFile.proceedingFilePath = fileUrl
      if (!proceedingFile.proceedingFileName) {
        proceedingFile.proceedingFileName = fileName
      }
      const newProceedingFile = await proceedingFileService.create(proceedingFile)
      if (proceedingFileStatusId > 0) {
        const proceedingFileHasStatus = {
          proceedingFileId: newProceedingFile.proceedingFileId,
          proceedingFileStatusId: proceedingFileStatusId,
        } as ProceedingFileHasStatus
        const proceedingFileHasStatusService = new ProceedingFileHasStatusService()
        const exist = await proceedingFileHasStatusService.verifyInfoExist(proceedingFileHasStatus)
        if (exist.status !== 200) {
          response.status(exist.status)
          return {
            type: exist.type,
            title: exist.title,
            message: exist.message,
            data: { ...proceedingFileHasStatus },
          }
        }
        const verifyInfo = await proceedingFileHasStatusService.verifyInfo(proceedingFileHasStatus)
        if (verifyInfo.status !== 200) {
          response.status(verifyInfo.status)
          return {
            type: verifyInfo.type,
            title: verifyInfo.title,
            message: verifyInfo.message,
            data: { ...proceedingFileHasStatus },
          }
        }
        await proceedingFileHasStatusService.create(proceedingFileHasStatus)
      }
      response.status(201)
      return {
        type: 'success',
        title: 'Proceeding file',
        message: 'The proceeding file was created successfully',
        data: { proceedingFile: newProceedingFile },
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/proceeding-files/{proceedingFileId}:
   *   put:
   *     summary: Update upload a file
   *     tags:
   *       - Proceeding Files
   *     parameters:
   *       - in: path
   *         name: proceedingFileId
   *         schema:
   *           type: number
   *         description: Proceeding file id
   *         required: true
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: The file to upload
   *               proceedingFileName:
   *                 type: string
   *                 description: Proceeding file name
   *                 required: true
   *                 default: ''
   *               proceedingFileTypeId:
   *                 type: number
   *                 description: Proceeding file type id
   *                 required: true
   *                 default: ''
   *               proceedingFileExpirationAt:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file expiration at (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileActive:
   *                 type: boolean
   *                 description: Proceeding file status
   *                 required: false
   *                 default: true
   *               proceedingFileIdentify:
   *                 type: string
   *                 description: Proceeding file identify
   *                 required: false
   *                 default: ''
   *               proceedingFileObservations:
   *                 type: string
   *                 description: Proceeding file observations
   *                 required: false
   *                 default: ''
   *               proceedingFileAfacRights:
   *                 type: string
   *                 description: Proceeding file AFAC rights
   *                 required: false
   *                 default: ''
   *               proceedingFileSignatureDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file signature date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileEffectiveStartDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file effective start date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileEffectiveEndDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file effective end date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileInclusionInTheFilesDate:
   *                 type: string
   *                 format: date
   *                 description: Proceeding file inclusion in the files date (YYYY-MM-DD)
   *                 required: false
   *                 default: ''
   *               proceedingFileOperationCost:
   *                 type: number
   *                 description: Proceeding file operation cost
   *                 required: false
   *                 default: 0
   *               proceedingFileCompleteProcess:
   *                 type: number
   *                 description: Proceeding file complete process
   *                 required: false
   *                 default: '0'
   *               proceedingFileStatusId:
   *                 type: number
   *                 description: Proceeding file status id
   *                 required: false
   *                 default: ''
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  @inject()
  async update({ request, response }: HttpContext) {
    try {
      await request.validateUsing(updateProceedingFileValidator)
      const validationOptions = {
        types: ['image', 'document', 'text', 'application', 'archive'],
        size: '1mb',
      }
      const file = request.file('file', validationOptions)
      const proceedingFileId = request.param('proceedingFileId')
      if (!proceedingFileId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The proceeding file Id was not found',
          message: 'Missing data to process',
          data: { proceedingFileId },
        }
      }
      const currentProceedingFile = await ProceedingFile.query()
        .whereNull('proceeding_file_deleted_at')
        .where('proceeding_file_id', proceedingFileId)
        .first()
      if (!currentProceedingFile) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The proceeding file was not found',
          message: 'The proceeding file was not found with the entered ID',
          data: { proceedingFileId },
        }
      }
      const proceedingFileService = new ProceedingFileService()
      const proceedingFileName = request.input('proceedingFileName')
      const proceedingFileTypeId = request.input('proceedingFileTypeId')
      let proceedingFileExpirationAt = request.input('proceedingFileExpirationAt', null)
      if (proceedingFileExpirationAt === 'undefined' || proceedingFileExpirationAt === 'null') {
        proceedingFileExpirationAt = null
      }
      const proceedingFileActive = request.input('proceedingFileActive')
      let proceedingFileIdentify = request.input('proceedingFileIdentify', null)
      if (proceedingFileIdentify === 'undefined' || proceedingFileIdentify === 'null') {
        proceedingFileIdentify = null
      }

      const proceedingFileObservations = request.input('proceedingFileObservations')
      const proceedingFileAfacRights = request.input('proceedingFileAfacRights')
      const proceedingFileSignatureDate = request.input('proceedingFileSignatureDate')
      const proceedingFileEffectiveStartDate = request.input('proceedingFileEffectiveStartDate')
      const proceedingFileEffectiveEndDate = request.input('proceedingFileEffectiveEndDate')
      const proceedingFileInclusionInTheFilesDate = request.input(
        'proceedingFileInclusionInTheFilesDate'
      )
      const proceedingFileOperationCost = request.input('proceedingFileOperationCost')
      const proceedingFileCompleteProcess = request.input('proceedingFileCompleteProcess')
      const proceedingFileStatusId = request.input('proceedingFileStatusId')

      const proceedingFile = {
        proceedingFileId: proceedingFileId,
        proceedingFileName: proceedingFileName
          ? proceedingFileName
          : currentProceedingFile.proceedingFileName,
        proceedingFilePath: currentProceedingFile.proceedingFilePath
          ? currentProceedingFile.proceedingFilePath
          : '',
        proceedingFileTypeId: proceedingFileTypeId
          ? proceedingFileTypeId
          : currentProceedingFile.proceedingFileTypeId,
        proceedingFileExpirationAt: proceedingFileExpirationAt
          ? proceedingFileService.formatDate(proceedingFileExpirationAt)
          : null,
        proceedingFileActive:
          proceedingFileActive && (proceedingFileActive === 'true' || proceedingFileActive === '1')
            ? 1
            : 0,
        proceedingFileIdentify: proceedingFileIdentify
          ? proceedingFileIdentify
          : currentProceedingFile.proceedingFileIdentify,
        proceedingFileObservations: proceedingFileObservations,
        proceedingFileAfacRights: proceedingFileAfacRights,
        proceedingFileSignatureDate: proceedingFileSignatureDate,
        proceedingFileEffectiveStartDate: proceedingFileEffectiveStartDate,
        proceedingFileEffectiveEndDate: proceedingFileEffectiveEndDate,
        proceedingFileInclusionInTheFilesDate: proceedingFileInclusionInTheFilesDate,
        proceedingFileOperationCost: proceedingFileOperationCost,
        proceedingFileCompleteProcess: proceedingFileCompleteProcess,
      } as ProceedingFile
      const isValidInfo = await proceedingFileService.verifyInfo(proceedingFile)
      if (isValidInfo.status !== 200) {
        response.status(isValidInfo.status)
        return {
          status: isValidInfo.status,
          type: isValidInfo.type,
          title: isValidInfo.title,
          message: isValidInfo.message,
          data: isValidInfo.data,
        }
      }
      if (file) {
        const disallowedExtensions = [
          'mp4',
          'avi',
          'mkv',
          'mov',
          'wmv',
          'flv', // Video
          'mp3',
          'wav',
          'flac',
          'aac',
          'ogg', // Audio
        ]
        if (disallowedExtensions.includes(file.extname ? file.extname : '')) {
          response.status(400)
          return {
            status: 400,
            type: 'warning',
            title: 'Please upload a file valid',
            message: 'Missing data to process',
            data: file,
          }
        }
        const fileName = `${new Date().getTime()}_${file.clientName}`
        const uploadService = new UploadService()
        const fileUrl = await uploadService.fileUpload(file, 'proceeding-files', fileName)
        if (currentProceedingFile.proceedingFilePath) {
          const fileNameWithExt = path.basename(currentProceedingFile.proceedingFilePath)
          const fileKey = `${Env.get('AWS_ROOT_PATH')}/proceeding-files/${fileNameWithExt}`
          await uploadService.deleteFile(fileKey)
        }
        proceedingFile.proceedingFilePath = fileUrl
        if (!proceedingFile.proceedingFileName) {
          proceedingFile.proceedingFileName = fileName
        }
      }
      const updateProceedingFile = await proceedingFileService.update(
        currentProceedingFile,
        proceedingFile
      )
      if (proceedingFileStatusId > 0) {
        const existStatus = await ProceedingFileHasStatus.query()
          .whereNull('proceeding_file_has_status_deleted_at')
          .where('proceeding_file_id', proceedingFile.proceedingFileId)
          .where('proceeding_file_status_id', proceedingFileStatusId)
          .first()
        if (!existStatus) {
          const proceedingFileHasStatusAll = await ProceedingFileHasStatus.query()
            .whereNull('proceeding_file_has_status_deleted_at')
            .where('proceeding_file_id', proceedingFile.proceedingFileId)
            .orderBy('proceeding_file_id')
          for await (const status of proceedingFileHasStatusAll) {
            // quitar el status anterior y borrar este comentario
            await status.delete()
          }
          const proceedingFileHasStatus = {
            proceedingFileId: proceedingFile.proceedingFileId,
            proceedingFileStatusId: proceedingFileStatusId,
          } as ProceedingFileHasStatus
          const proceedingFileHasStatusService = new ProceedingFileHasStatusService()
          const exist =
            await proceedingFileHasStatusService.verifyInfoExist(proceedingFileHasStatus)
          if (exist.status !== 200) {
            response.status(exist.status)
            return {
              type: exist.type,
              title: exist.title,
              message: exist.message,
              data: { ...proceedingFileHasStatus },
            }
          }
          const verifyInfo =
            await proceedingFileHasStatusService.verifyInfo(proceedingFileHasStatus)
          if (verifyInfo.status !== 200) {
            response.status(verifyInfo.status)
            return {
              type: verifyInfo.type,
              title: verifyInfo.title,
              message: verifyInfo.message,
              data: { ...proceedingFileHasStatus },
            }
          }
          await proceedingFileHasStatusService.create(proceedingFileHasStatus)
        }
      }

      response.status(200)
      return {
        type: 'success',
        title: 'Proceeding file',
        message: 'The proceeding file was updated successfully',
        data: { proceedingFile: updateProceedingFile },
      }
    } catch (error) {
      const messageError =
        error.code === 'E_VALIDATION_ERROR' ? error.messages[0].message : error.message
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: messageError,
      }
    }
  }

  /**
   * @swagger
   * /api/proceeding-files/{proceedingFileId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding Files
   *     summary: delete proceeding file
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: proceedingFileId
   *         schema:
   *           type: number
   *         description: Proceeding file id
   *         required: true
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async delete({ request, response }: HttpContext) {
    try {
      const proceedingFileId = request.param('proceedingFileId')
      if (!proceedingFileId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The proceeding file Id was not found',
          message: 'Missing data to process',
          data: { proceedingFileId },
        }
      }
      const currentProceedingFile = await ProceedingFile.query()
        .whereNull('proceeding_file_deleted_at')
        .where('proceeding_file_id', proceedingFileId)
        .first()
      if (!currentProceedingFile) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The proceeding file was not found',
          message: 'The proceeding file was not found with the entered ID',
          data: { proceedingFileId },
        }
      }
      const proceedingFileService = new ProceedingFileService()
      const deleteProceedingFile = await proceedingFileService.delete(currentProceedingFile)
      if (deleteProceedingFile) {
        response.status(201)
        return {
          type: 'success',
          title: 'Proceeding file',
          message: 'The proceeding file was deleted successfully',
          data: { proceedingFile: deleteProceedingFile },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/proceeding-files/{proceedingFileId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding Files
   *     summary: get proceeding file by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: proceedingFileId
   *         schema:
   *           type: number
   *         description: Proceeding file id
   *         required: true
   *     responses:
   *       '200':
   *         description: Resource processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Processed object
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       '400':
   *         description: The parameters entered are invalid or essential data is missing to process the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: List of parameters set by the client
   *       default:
   *         description: Unexpected error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   description: Type of response generated
   *                 title:
   *                   type: string
   *                   description: Title of response generated
   *                 message:
   *                   type: string
   *                   description: Message of response
   *                 data:
   *                   type: object
   *                   description: Error message obtained
   *                   properties:
   *                     error:
   *                       type: string
   */
  async show({ request, response }: HttpContext) {
    try {
      const proceedingFileId = request.param('proceedingFileId')
      if (!proceedingFileId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The proceeding file Id was not found',
          message: 'Missing data to process',
          data: { proceedingFileId },
        }
      }
      const proceedingFileService = new ProceedingFileService()
      const showProceedingFile = await proceedingFileService.show(proceedingFileId)
      if (!showProceedingFile) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The proceeding file was not found',
          message: 'The proceeding file was not found with the entered ID',
          data: { proceedingFileId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Proceeding file',
          message: 'The proceeding file was found successfully',
          data: { showProceedingFile: showProceedingFile },
        }
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }
}
