import { HttpContext } from '@adonisjs/core/http'
import SystemSettingSystemModuleService from '#services/system_setting_system_module_service'
import {
  createSystemSettingSystemModuleValidator,
  updateSystemSettingSystemModuleValidator,
} from '#validators/system_setting_system_module'
import SystemSettingSystemModule from '#models/system_setting_system_module'

export default class SystemSettingSystemModuleController {
  /**
   * @swagger
   * /api/system-settings-system-modules:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - SystemSettings SystemModules
   *     summary: create new relation system-setting-system-module
   *     produces:
   *       - application/json
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               systemSettingId:
   *                 type: number
   *                 description: SystemSetting id
   *                 required: true
   *                 default: ''
   *               systemModuleId:
   *                 type: number
   *                 description: SystemModule id
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
      const systemSettingId = request.input('systemSettingId')
      const systemModuleId = request.input('systemModuleId')
      const systemSettingSystemModule = {
        systemSettingId: systemSettingId,
        systemModuleId: systemModuleId,
      } as SystemSettingSystemModule
      const systemSettingSystemModuleService = new SystemSettingSystemModuleService()
      const data = await request.validateUsing(createSystemSettingSystemModuleValidator)
      const exist =
        await systemSettingSystemModuleService.verifyInfoExist(systemSettingSystemModule)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo =
        await systemSettingSystemModuleService.verifyInfo(systemSettingSystemModule)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const newSystemSettingSystemModule =
        await systemSettingSystemModuleService.create(systemSettingSystemModule)
      if (newSystemSettingSystemModule) {
        response.status(201)
        return {
          type: 'success',
          title: 'SystemSettings SystemModules',
          message: 'The relation system-setting-system-module was created successfully',
          data: { systemSettingSystemModule: newSystemSettingSystemModule },
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
   * /api/system-settings-system-modules/{systemSettingSystemModuleId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - SystemSettings SystemModules
   *     summary: update relation system-setting-system-module
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: systemSettingSystemModuleId
   *         schema:
   *           type: number
   *         description: SystemSetting-SystemModule id
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               systemSettingId:
   *                 type: number
   *                 description: System setting id
   *                 required: true
   *                 default: ''
   *               systemModuleId:
   *                 type: number
   *                 description: SystemModule id
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
      const systemSettingSystemModuleId = request.param('systemSettingSystemModuleId')
      const systemSettingId = request.input('systemSettingId')
      const systemModuleId = request.input('systemModuleId')
      const systemSettingSystemModule = {
        systemSettingSystemModuleId: systemSettingSystemModuleId,
        systemSettingId: systemSettingId,
        systemModuleId: systemModuleId,
      } as SystemSettingSystemModule
      if (!systemSettingSystemModuleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module Id was not found',
          message: 'Missing data to process',
          data: { ...systemSettingSystemModule },
        }
      }
      const currentSystemSettingSystemModule = await SystemSettingSystemModule.query()
        .whereNull('system_setting_system_module_deleted_at')
        .where('system_setting_system_module_id', systemSettingSystemModuleId)
        .first()
      if (!currentSystemSettingSystemModule) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module was not found',
          message: 'The relation system-setting-system-module was not found with the entered ID',
          data: { ...systemSettingSystemModule },
        }
      }
      const systemSettingSystemModuleService = new SystemSettingSystemModuleService()
      const data = await request.validateUsing(updateSystemSettingSystemModuleValidator)
      const exist =
        await systemSettingSystemModuleService.verifyInfoExist(systemSettingSystemModule)
      if (exist.status !== 200) {
        response.status(exist.status)
        return {
          type: exist.type,
          title: exist.title,
          message: exist.message,
          data: { ...data },
        }
      }
      const verifyInfo =
        await systemSettingSystemModuleService.verifyInfo(systemSettingSystemModule)
      if (verifyInfo.status !== 200) {
        response.status(verifyInfo.status)
        return {
          type: verifyInfo.type,
          title: verifyInfo.title,
          message: verifyInfo.message,
          data: { ...data },
        }
      }
      const updateSystemSettingSystemModule = await systemSettingSystemModuleService.update(
        currentSystemSettingSystemModule,
        systemSettingSystemModule
      )
      if (updateSystemSettingSystemModule) {
        response.status(201)
        return {
          type: 'success',
          title: 'SystemSettings - SystemModules',
          message: 'The relation system-setting-system-module was updated successfully',
          data: { systemSettingSystemModule: updateSystemSettingSystemModule },
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
   * /api/system-settings-system-modules/{systemSettingSystemModuleId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - SystemSettings SystemModules
   *     summary: delete relation SystemSetting-SystemModule
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: systemSettingSystemModuleId
   *         schema:
   *           type: number
   *         description: SystemSetting-SystemModule id
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
      const systemSettingSystemModuleId = request.param('systemSettingSystemModuleId')
      if (!systemSettingSystemModuleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module Id was not found',
          message: 'Missing data to process',
          data: { systemSettingSystemModuleId },
        }
      }
      const currentSystemSettingSystemModule = await SystemSettingSystemModule.query()
        .whereNull('system_setting_system_module_deleted_at')
        .where('system_setting_system_module_id', systemSettingSystemModuleId)
        .first()
      if (!currentSystemSettingSystemModule) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module was not found',
          message: 'The relation system-setting-system-module was not found with the entered ID',
          data: { systemSettingSystemModuleId },
        }
      }
      const systemSettingSystemModuleService = new SystemSettingSystemModuleService()
      const deleteSystemSettingSystemModule = await systemSettingSystemModuleService.delete(
        currentSystemSettingSystemModule
      )
      if (deleteSystemSettingSystemModule) {
        response.status(201)
        return {
          type: 'success',
          title: 'SystemSettings - SystemModules',
          message: 'The relation system-setting-system-module was deleted successfully',
          data: { systemSettingSystemModule: deleteSystemSettingSystemModule },
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
   * /api/system-settings-system-modules/{systemSettingId}/{systemModuleId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - SystemSettings SystemModules
   *     summary: delete relation SystemSetting-SystemModule by SystemSetting and SystemModule id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: systemSettingId
   *         schema:
   *           type: number
   *         description: SystemSetting id
   *         required: true
   *       - in: path
   *         name: systemModuleId
   *         schema:
   *           type: number
   *         description: SystemModule id
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
  async deleteRelation({ request, response }: HttpContext) {
    try {
      const systemSettingId = request.param('systemSettingId')
      const systemModuleId = request.param('systemModuleId')
      if (!systemSettingId || !systemModuleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module Id was not found',
          message: 'Missing data to process',
          data: { systemSettingId, systemModuleId },
        }
      }

      const currentSystemSettingSystemModule = await SystemSettingSystemModule.query()
        .whereNull('system_setting_system_module_deleted_at')
        .where('system_setting_id', systemSettingId)
        .where('system_module_id', systemModuleId)
        .first()

      if (!currentSystemSettingSystemModule) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module was not found',
          message: 'The relation system-setting-system-module was not found with the entered ID',
          data: { systemSettingId, systemModuleId },
        }
      }
      const systemSettingSystemModuleService = new SystemSettingSystemModuleService()
      const deleteSystemSettingSystemModule = await systemSettingSystemModuleService.delete(
        currentSystemSettingSystemModule
      )
      if (deleteSystemSettingSystemModule) {
        response.status(201)
        return {
          type: 'success',
          title: 'SystemSettings - SystemModules',
          message: 'The relation system-setting-system-module was deleted successfully',
          data: { systemSettingSystemModule: deleteSystemSettingSystemModule },
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
   * /api/system-settings-system-modules/{systemSettingSystemModuleId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - SystemSettings SystemModules
   *     summary: get relation system-setting-system-module by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: systemSettingSystemModuleId
   *         schema:
   *           type: number
   *         description: SystemSetting-SystemModule id
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
      const systemSettingSystemModuleId = request.param('systemSettingSystemModuleId')
      if (!systemSettingSystemModuleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The relation system-setting-system-module Id was not found',
          data: { systemSettingSystemModuleId },
        }
      }
      const systemSettingSystemModuleService = new SystemSettingSystemModuleService()
      const showSystemSettingSystemModule = await systemSettingSystemModuleService.show(
        systemSettingSystemModuleId
      )
      if (!showSystemSettingSystemModule) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The relation system-setting-system-module was not found',
          message: 'The relation system-setting-system-module was not found with the entered ID',
          data: { systemSettingSystemModuleId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'SystemSettings - SystemModules',
          message: 'The relation system-setting-system-module was found successfully',
          data: { systemSettingSystemModule: showSystemSettingSystemModule },
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
