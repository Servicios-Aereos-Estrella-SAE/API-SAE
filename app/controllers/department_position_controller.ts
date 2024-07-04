import { HttpContext } from '@adonisjs/core/http'
import DepartmentPosition from '#models/department_position'
import DepartmentPositionService from '#services/department_position_service'
import {
  createDepartmentPositionValidator,
  updateDepartmentPositionValidator,
} from '#validators/department_position'

export default class DepartmentPositionController {
  /**
   * @swagger
   * /api/departments-positions:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments Positions
   *     summary: create new relation department-position
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               departmentId:
   *                 type: number
   *                 description: Department id
   *                 required: true
   *                 default: ''
   *               positionId:
   *                 type: number
   *                 description: Position id
   *                 required: true
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
  async store({ request, response }: HttpContext) {
    try {
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const departmentPosition = {
        departmentId: departmentId,
        positionId: positionId,
      } as DepartmentPosition
      const departmentPositionService = new DepartmentPositionService()
      const data = await request.validateUsing(createDepartmentPositionValidator)
      const exist = await departmentPositionService.verifyInfoExist(departmentPosition)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await departmentPositionService.verifyInfo(departmentPosition)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const newDepartmentPosition = await departmentPositionService.create(departmentPosition)
      if (newDepartmentPosition) {
        response.status(201)
        return {
          type: 'success',
          title: 'Departments positions',
          message: 'The relation department-position was created successfully',
          data: { departmentPosition: newDepartmentPosition },
        }
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
   * /api/departments-positions/{departmentPositionId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments Positions
   *     summary: update relation department-position
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: departmentPositionId
   *         schema:
   *           type: number
   *         description: Department position id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               departmentId:
   *                 type: number
   *                 description: Department id
   *                 required: true
   *                 default: ''
   *               positionId:
   *                 type: number
   *                 description: Position id
   *                 required: true
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
  async update({ request, response }: HttpContext) {
    try {
      const departmentPositionId = request.param('departmentPositionId')
      const departmentId = request.input('departmentId')
      const positionId = request.input('positionId')
      const departmentPosition = {
        departmentPositionId: departmentPositionId,
        departmentId: departmentId,
        positionId: positionId,
      } as DepartmentPosition
      if (!departmentPositionId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation department-position Id was not found',
          message: 'Missing data to process',
          data: { ...departmentPosition },
        }
      }
      const currentDepartmentPosition = await DepartmentPosition.query()
        .whereNull('department_position_deleted_at')
        .where('department_position_id', departmentPositionId)
        .first()
      if (!currentDepartmentPosition) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation department-position was not found',
          message: 'The relation department-position was not found with the entered ID',
          data: { ...departmentPosition },
        }
      }
      const departmentPositionService = new DepartmentPositionService()
      const data = await request.validateUsing(updateDepartmentPositionValidator)
      const exist = await departmentPositionService.verifyInfoExist(departmentPosition)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo = await departmentPositionService.verifyInfo(departmentPosition)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateDepartmentPosition = await departmentPositionService.update(
        currentDepartmentPosition,
        departmentPosition
      )
      if (updateDepartmentPosition) {
        response.status(201)
        return {
          type: 'success',
          title: 'Department positions',
          message: 'The relation department-position was updated successfully',
          data: { departmentPosition: updateDepartmentPosition },
        }
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
   * /api/departments-positions/{departmentPositionId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments Positions
   *     summary: delete relation department position
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: departmentPositionId
   *         schema:
   *           type: number
   *         description: Department position id
   *         required: true
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
  async delete({ request, response }: HttpContext) {
    try {
      const departmentPositionId = request.param('departmentPositionId')
      if (!departmentPositionId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation department-position Id was not found',
          message: 'Missing data to process',
          data: { departmentPositionId },
        }
      }
      const currentDepartmentPosition = await DepartmentPosition.query()
        .whereNull('department_position_deleted_at')
        .where('department_position_id', departmentPositionId)
        .first()
      if (!currentDepartmentPosition) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation department-position was not found',
          message: 'The relation department-position was not found with the entered ID',
          data: { departmentPositionId },
        }
      }
      const departmentPositionService = new DepartmentPositionService()
      const deleteDepartmentPosition =
        await departmentPositionService.delete(currentDepartmentPosition)
      if (deleteDepartmentPosition) {
        response.status(201)
        return {
          type: 'success',
          title: 'Departments positions',
          message: 'The relation department-position was deleted successfully',
          data: { departmentPosition: deleteDepartmentPosition },
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
   * /api/departments-positions/{departmentPositionId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Departments Positions
   *     summary: get relation department-position by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: departmentPositionId
   *         schema:
   *           type: number
   *         description: Department position id
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
      const departmentPositionId = request.param('departmentPositionId')
      if (!departmentPositionId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation department-position Id was not found',
          message: 'Missing data to process',
          data: { departmentPositionId },
        }
      }
      const departmentPositionService = new DepartmentPositionService()
      const showDepartmentPosition = await departmentPositionService.show(departmentPositionId)
      if (!showDepartmentPosition) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation department-position was not found',
          message: 'The relation department-position was not found with the entered ID',
          data: { departmentPositionId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Departments positions',
          message: 'The relation department-position was found successfully',
          data: { departmentPosition: showDepartmentPosition },
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
