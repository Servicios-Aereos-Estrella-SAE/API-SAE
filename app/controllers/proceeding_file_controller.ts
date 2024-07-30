import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UploadService from '#services/upload_service'
import ProceedingFileService from '#services/proceeding_file_service'
import ProceedingFile from '#models/proceeding_file'
export default class ProceedingFileController {
  /**
   * @swagger
   * /api/proceeding-files/:
   *   post:
   *     summary: Upload a file
   *     tags:
   *       - Proceeding file
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               photo:
   *                 type: string
   *                 format: binary
   *                 description: The file to upload
   *               proceedingFileTypeId:
   *                 type: number
   *                 description: Proceeding file type id
   *                 required: true
   *                 default: ''
   *               proceedingFileName:
   *                 type: string
   *                 description: Proceeding file name
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
   *                 required: true
   *                 default: true
   *     responses:
   *       200:
   *         description: Photo uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: string
   *                   description: URL of the uploaded photo
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *                 error:
   *                   type: object
   *                   description: Error details
   */
  @inject()
  async store({ request, response }: HttpContext) {
    const validationOptions = {
      types: ['image'],
      size: '2mb',
    }
    const file = request.file('photo', validationOptions)
    // validate file required
    if (!file) {
      return response.status(400).send({ message: 'Please upload a file' })
    }
    // get file name and extension
    const fileName = `${new Date().getTime()}_${file.clientName}`
    const uploadService = new UploadService()
    const proceedingFileService = new ProceedingFileService()
    try {
      const fileUrl = await uploadService.fileUpload(file, 'proceeding_files', fileName)
      const proceedingFile = {
        proceedingFileName: '',
        proceedingFilePath: fileUrl,
        proceedingFileTypeId: 0,
        proceedingFileExpirationAt: '',
        proceedingFileActive: 1,
      } as ProceedingFile
      const newFile = await proceedingFileService.create(proceedingFile)
      return response.status(200).send({ newFile })
    } catch (error) {
      return response.status(500).send({ message: 'Error uploading file', error })
    }
  }
}
