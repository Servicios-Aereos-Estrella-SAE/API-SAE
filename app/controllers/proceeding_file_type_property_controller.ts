import { HttpContext } from '@adonisjs/core/http'
import { ProceedingFileTypePropertyFilterSearchInterface } from '../interfaces/proceeding_file_type_property_filter_search_interface.js'
import ProceedingFileTypePropertyService from '#services/proceeding_file_type_property_service'
import { ProceedingFileTypePropertyCategoryFilterInterface } from '../interfaces/proceeding_file_type_property_category_filter_interface.js'

export default class ProceedingFileTypePropertyController {
  /**
   * @swagger
   * /api/proceeding-file-type-properties:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Proceeding File Type Properties
   *     summary: get all
   *     parameters:
   *       - name: search
   *         in: query
   *         required: false
   *         description: Search
   *         schema:
   *           type: string
   *       - name: page
   *         in: query
   *         required: true
   *         description: The page number for pagination
   *         default: 1
   *         schema:
   *           type: integer
   *       - name: limit
   *         in: query
   *         required: true
   *         description: The number of records per page
   *         default: 100
   *         schema:
   *           type: integer
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
  async index({ request, response }: HttpContext) {
    try {
      const search = request.input('search')
      const page = request.input('page', 1)
      const limit = request.input('limit', 100)
      const filters = {
        search: search,
        page: page,
        limit: limit,
      } as ProceedingFileTypePropertyFilterSearchInterface
      const proceedingFileTypePropertyService = new ProceedingFileTypePropertyService()
      const proceedingFileTypeProperties = await proceedingFileTypePropertyService.index(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Proceeding file type properties',
        message: 'The proceeding file type properties were found successfully',
        data: {
          proceedingFileTypeProperties: proceedingFileTypeProperties,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server Error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }

  /**
   * @swagger
   * /api/proceeding-file-type-properties/get-categories-by-employee:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: employeeId
   *         in: query
   *         required: true
   *         description: Employee id
   *         schema:
   *           type: number
   *       - name: proceedingFileId
   *         in: query
   *         required: true
   *         description: Proceeding file id
   *         schema:
   *           type: number
   *       - name: proceedingFileTypeId
   *         in: query
   *         required: true
   *         description: Proceeding file type id
   *         schema:
   *           type: number
   *     tags:
   *       - Proceeding File Type Properties
   *     summary: get all categories
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
  async getCategories({ request, response }: HttpContext) {
    try {
      const employeeId = request.input('employeeId')
      const proceedingFileId = request.input('proceedingFileId')
      const proceedingFileTypeId = request.input('proceedingFileTypeId')
      const proceedingFileTypePropertyService = new ProceedingFileTypePropertyService()
      const proceedingFileTypePropertyCategoryFilter = {
        employeeId,
        proceedingFileId,
        proceedingFileTypeId,
      } as ProceedingFileTypePropertyCategoryFilterInterface
      const proceedingFileTypePropertiesCategories =
        await proceedingFileTypePropertyService.getCategories(
          proceedingFileTypePropertyCategoryFilter
        )
      response.status(200)
      return {
        type: 'success',
        title: 'Proceeding file type properties',
        message: 'The proceeding file type property categories were found successfully',
        data: {
          proceedingFileTypePropertiesCategories: proceedingFileTypePropertiesCategories,
        },
      }
    } catch (error) {
      response.status(500)
      return {
        type: 'error',
        title: 'Server Error',
        message: 'An unexpected error has occurred on the server',
        error: error.message,
      }
    }
  }
}
