import { HttpContext } from '@adonisjs/core/http'
import { fetchRecordsValidator } from '../validators/shift_for_employees.js'
import { DateTime } from 'luxon'
import EmployeeShift from '#models/employee_shift'

type ShiftRecord = {
  shiftId: number
  shiftDate: any
  employeeShiftId: any
  employeShiftsApplySince: any
  employeeId: any
  shift: {
    shiftId: number
    shiftName: string
    shiftDayStart: number
    shiftTimeStart: string
    shiftActiveHours: number
    shiftRestDays: string
    shiftCreatedAt: any
    shiftUpdatedAt: any
  }
}

type EmployeeRecord = {
  employeeId: number
  employeeSyncId: number
  employeeCode: any
  employeeFirstName: any
  employeeLastName: any
  employeePayrollNum: any
  employeeHireDate: any
  companyId: any
  departmentId: any
  positionId: any
  departmentSyncId: any
  positionSyncId: any
  employeeLastSynchronizationAt: any
  employeeCreatedAt: any
  employeeUpdatedAt: any
  employeeShifts: ShiftRecord[]
}

/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: Shift management
 */

/**
 * @swagger
 * /api/shift-for-employees:
 *   post:
 *     summary: Get shift records for employees
 *     tags: [Shifts]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Start date for filtering records
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: End date for filtering records
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Employee ID to filter records
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Department ID to filter records
 *       - in: query
 *         name: positionId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Position ID to filter records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successfully fetched records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: success
 *                 title:
 *                   type: string
 *                   example: Successfully fetched
 *                 message:
 *                   type: string
 *                   example: Records fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 100
 *                         per_page:
 *                           type: integer
 *                           example: 10
 *                         current_page:
 *                           type: integer
 *                           example: 1
 *                         last_page:
 *                           type: integer
 *                           example: 10
 *                         first_page:
 *                           type: integer
 *                           example: 1
 *                         first_page_url:
 *                           type: string
 *                           example: '/api/shift-for-employees?page=1'
 *                         last_page_url:
 *                           type: string
 *                           example: '/api/shift-for-employees?page=10'
 *                         next_page_url:
 *                           type: string
 *                           example: '/api/shift-for-employees?page=2'
 *                         previous_page_url:
 *                           type: string
 *                           example: null
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           employeeId:
 *                             type: integer
 *                             example: 178
 *                           employeeSyncId:
 *                             type: string
 *                             example: '191'
 *                           employeeCode:
 *                             type: string
 *                             example: '28000008'
 *                           employeeFirstName:
 *                             type: string
 *                             example: 'Fernando'
 *                           employeeLastName:
 *                             type: string
 *                             example: 'Hernández Cruz'
 *                           employeePayrollNum:
 *                             type: string
 *                             example: 'SILER'
 *                           employeeHireDate:
 *                             type: string
 *                             format: date
 *                             example: '2023-02-21'
 *                           companyId:
 *                             type: integer
 *                             example: 1
 *                           departmentId:
 *                             type: integer
 *                             example: 14
 *                           positionId:
 *                             type: integer
 *                             example: 52
 *                           departmentSyncId:
 *                             type: string
 *                             example: '28'
 *                           positionSyncId:
 *                             type: string
 *                             example: '110'
 *                           employeeLastSynchronizationAt:
 *                             type: string
 *                             format: date-time
 *                             example: '2024-06-25T14:23:39.000Z'
 *                           employeeCreatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: '2024-06-23T00:34:10.000Z'
 *                           employeeUpdatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: '2024-06-25T14:23:38.000Z'
 *                           employeeShifts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 employeeShiftId:
 *                                   type: integer
 *                                   example: 1
 *                                 employeeId:
 *                                   type: integer
 *                                   example: 178
 *                                 shiftId:
 *                                   type: integer
 *                                   example: 1
 *                                 employeShiftsApplySince:
 *                                   type: string
 *                                   format: date-time
 *                                   example: '2024-05-01T00:06:00.000Z'
 *                                 shiftDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: '2024-04-30T16:00:16.000Z'
 *                                 shift:
 *                                   type: object
 *                                   properties:
 *                                     shiftId:
 *                                       type: integer
 *                                       example: 1
 *                                     shiftName:
 *                                       type: string
 *                                       example: 'Estandar'
 *                                     shiftDayStart:
 *                                       type: integer
 *                                       example: 1
 *                                     shiftTimeStart:
 *                                       type: string
 *                                       example: '08:00:00'
 *                                     shiftActiveHours:
 *                                       type: integer
 *                                       example: 10
 *                                     shiftRestDays:
 *                                       type: string
 *                                       example: '6,7'
 *                                     shiftCreatedAt:
 *                                       type: string
 *                                       format: date-time
 *                                       example: '2024-04-30T16:00:16.000Z'
 *                                     shiftUpdatedAt:
 *                                       type: string
 *                                       format: date-time
 *                                       example: '2024-04-30T16:00:16.000Z'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: error
 *                 title:
 *                   type: string
 *                   example: Validation error
 *                 message:
 *                   type: string
 *                   example: Invalid input, validation error
 *                 data:
 *                   type: string
 *                   example: Detailed error message
 */

export default class RecordsController {
  async index({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(fetchRecordsValidator)

      const startDate = DateTime.fromJSDate(payload.startDate).toISO() || ''
      const endDate = DateTime.fromJSDate(payload.endDate).toISO() || ''
      const page = payload.page || 1
      const limit = payload.limit || 10

      if (DateTime.fromISO(startDate) >= DateTime.fromISO(endDate)) {
        return response.status(400).json({
          type: 'error',
          title: 'Validation error',
          message: 'startDate must be less than endDate',
        })
      }

      let query = EmployeeShift.query()
        .whereBetween('employeShiftsCreatedAt', [startDate, endDate])
        .preload('employee')
        .preload('shift')
        .whereNull('employeShiftsDeletedAt')

      if (payload.employeeId !== undefined) {
        query = query.where('employeeId', payload.employeeId)
      }

      if (payload.departmentId !== undefined) {
        query = query.whereHas('employee', (builder) => {
          builder.where('department_id', payload.departmentId!)
        })
      }

      if (payload.positionId !== undefined) {
        query = query.whereHas('employee', (builder) => {
          builder.where('position_id', payload.positionId!)
        })
      }

      const records = await query.paginate(page, limit)

      const employeeRecords = records.reduce(
        (acc, record) => {
          if (!acc[record.employeeId]) {
            acc[record.employeeId] = {
              employeeId: record.employeeId,
              employeeSyncId: record.employee.employeeSyncId,
              employeeCode: record.employee.employeeCode,
              employeeFirstName: record.employee.employeeFirstName,
              employeeLastName: record.employee.employeeLastName,
              employeePayrollNum: record.employee.employeePayrollNum,
              employeeHireDate: record.employee.employeeHireDate,
              companyId: record.employee.companyId,
              departmentId: record.employee.departmentId,
              positionId: record.employee.positionId,
              departmentSyncId: record.employee.departmentSyncId,
              positionSyncId: record.employee.positionSyncId,
              employeeLastSynchronizationAt: record.employee.employeeLastSynchronizationAt,
              employeeCreatedAt: record.employee.employeeCreatedAt,
              employeeUpdatedAt: record.employee.employeeUpdatedAt,
              employeeShifts: [],
            }
          }
          acc[record.employeeId].employeeShifts.push({
            employeeShiftId: record.employeeShiftId,
            employeeId: record.employeeId,
            shiftId: record.shiftId,
            employeShiftsApplySince: record.employeShiftsApplySince,
            shiftDate: record.employeShiftsCreatedAt,
            shift: {
              shiftId: record.shift.shiftId,
              shiftName: record.shift.shiftName,
              shiftDayStart: record.shift.shiftDayStart,
              shiftTimeStart: record.shift.shiftTimeStart,
              shiftActiveHours: record.shift.shiftActiveHours,
              shiftRestDays: record.shift.shiftRestDays,
              shiftCreatedAt: record.shift.shiftCreatedAt,
              shiftUpdatedAt: record.shift.shiftUpdatedAt,
            },
          })
          return acc
        },
        {} as { [key: number]: EmployeeRecord }
      )

      Object.values(employeeRecords).forEach((employee: EmployeeRecord) => {
        employee.employeeShifts.sort(
          (a, b) => new Date(b.shiftDate).getTime() - new Date(a.shiftDate).getTime()
        )
      })

      return response.status(200).json({
        type: 'success',
        title: 'Successfully fetched',
        message: 'Records fetched successfully',
        data: {
          meta: {
            total: records.total,
            per_page: records.perPage,
            current_page: records.currentPage,
            last_page: records.lastPage,
            first_page: 1,
          },
          data: Object.values(employeeRecords),
        },
      })
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: 'Invalid input, validation error',
        data: error.messages || error.message,
      })
    }
  }
}
