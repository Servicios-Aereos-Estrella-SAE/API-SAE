import { HttpContext } from '@adonisjs/core/http'
import RoleService from '#services/role_service'
import { RoleFilterSearchInterface } from '../interfaces/role_filter_search_interface.js'
import Role from '#models/role'

export default class RoleController {
  /**
   * @swagger
   * /api/roles:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
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
      } as RoleFilterSearchInterface
      const roleService = new RoleService()
      const roles = await roleService.index(filters)
      response.status(200)
      return {
        type: 'success',
        title: 'Roles',
        message: 'The roles were found successfully',
        data: {
          roles,
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
   * /api/roles/assign/{roleId}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     summary: assign permissions to role
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: roleId
   *         schema:
   *           type: number
   *         description: Role id
   *         required: true
   *     requestBody:
   *       content:
   *          application/json:
   *           schema:
   *             type: object
   *             properties:
   *               permissions:
   *                 type: array
   *                 description: Permissions
   *                 required: true
   *                 default: []
   *               departments:
   *                 type: array
   *                 description: Departments
   *                 required: true
   *                 default: []
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
  async assign({ request, response }: HttpContext) {
    try {
      const roleId = request.param('roleId')
      const data = request.all()
      const role = await Role.query().whereNull('role_deleted_at').where('role_id', roleId).first()
      if (!role) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The role was not found',
          message: 'The role was not found with the entered ID',
          data: { ...request.all() },
        }
      }
      const roleService = new RoleService()
      const roleSystemPermissions = await roleService.assignPermissions(roleId, data.permissions)
      const roleDepartments = await roleService.assignDepartments(roleId, data.departments)
      response.status(201)
      return {
        type: 'success',
        title: 'Role Permissions',
        message: 'The role permissions were assigned successfully',
        data: { roleSystemPermissions: roleSystemPermissions, roleDepartments: roleDepartments },
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
   * /api/roles/{roleId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     summary: get role by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: roleId
   *         schema:
   *           type: number
   *         description: Role id
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
      const roleId = request.param('roleId')
      if (!roleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The role Id was not found',
          message: 'Missing data to process',
          data: { roleId },
        }
      }
      const roleService = new RoleService()
      const showRole = await roleService.show(roleId)
      if (!showRole) {
        response.status(404)
        return {
          type: 'warning',
          title: 'The role was not found',
          message: 'The role was not found with the entered ID',
          data: { roleId },
        }
      } else {
        response.status(200)
        return {
          type: 'success',
          title: 'Roles',
          message: 'The role was found successfully',
          data: { role: showRole },
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
   * /api/roles/has-access/{roleId}/{systemModuleSlug}/{systemPermissionSlug}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     summary: get role has access by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: roleId
   *         schema:
   *           type: number
   *         description: Role id
   *         required: true
   *       - in: path
   *         name: systemModuleSlug
   *         schema:
   *           type: string
   *         description: System module slug
   *         required: true
   *       - in: path
   *         name: systemPermissionSlug
   *         schema:
   *           type: string
   *         description: System permission slug
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
  async hasAccess({ request, response }: HttpContext) {
    try {
      const roleId = request.param('roleId')
      if (!roleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The role Id was not found',
          message: 'Missing data to process',
          data: { roleId },
        }
      }
      const systemModuleSlug = request.param('systemModuleSlug')
      if (!systemModuleSlug) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The system module slug was not found',
          data: { systemModuleSlug },
        }
      }
      const systemPermissionSlug = request.param('systemPermissionSlug')
      if (!systemPermissionSlug) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The system permission slug was not found',
          data: { systemPermissionSlug },
        }
      }
      const roleService = new RoleService()
      const roleHasAccess = await roleService.hasAccess(
        roleId,
        systemModuleSlug,
        systemPermissionSlug
      )
      response.status(200)
      return {
        type: 'success',
        title: 'Roles',
        message: 'The role was found successfully',
        data: { roleHasAccess: roleHasAccess },
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
   * /api/roles/get-access-by-module/{roleId}/{systemModuleSlug}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     summary: get role has access by id and module
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: roleId
   *         schema:
   *           type: number
   *         description: Role id
   *         required: true
   *       - in: path
   *         name: systemModuleSlug
   *         schema:
   *           type: string
   *         description: System module slug
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
  async getAccessByModule({ request, response }: HttpContext) {
    try {
      const roleId = request.param('roleId')
      if (!roleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The role Id was not found',
          message: 'Missing data to process',
          data: { roleId },
        }
      }
      const systemModuleSlug = request.param('systemModuleSlug')
      if (!systemModuleSlug) {
        response.status(400)
        return {
          type: 'warning',
          title: 'Missing data to process',
          message: 'The system module slug was not found',
          data: { systemModuleSlug },
        }
      }
      const roleService = new RoleService()
      const roleGetAccess = await roleService.getAccessByModule(roleId, systemModuleSlug)
      response.status(roleGetAccess.status)
      return {
        type: roleGetAccess.type,
        title: roleGetAccess.title,
        message: roleGetAccess.message,
        data: { permissions: roleGetAccess.data },
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
   * /api/roles/get-access/{roleId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Roles
   *     summary: get role has access by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: roleId
   *         schema:
   *           type: number
   *         description: Role id
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
  async getAccess({ request, response }: HttpContext) {
    try {
      const roleId = request.param('roleId')
      if (!roleId) {
        response.status(400)
        return {
          type: 'warning',
          title: 'The role Id was not found',
          message: 'Missing data to process',
          data: { roleId },
        }
      }
      const roleService = new RoleService()
      const roleGetAccess = await roleService.getAccess(roleId)
      response.status(roleGetAccess.status)
      return {
        type: roleGetAccess.type,
        title: roleGetAccess.title,
        message: roleGetAccess.message,
        data: { permissions: roleGetAccess.data },
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
