import { HttpContext } from '@adonisjs/core/http'
import { fetchRecordsValidator } from '../validators/shift_for_employees.js'
import { DateTime } from 'luxon'
import EmployeeShift from '#models/employee_shift'

export default class RecordsController {
  async index({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(fetchRecordsValidator)

      const startDate = DateTime.fromJSDate(payload.startDate).toISO() || ''
      const endDate = DateTime.fromJSDate(payload.endDate).toISO() || ''

      let query = EmployeeShift.query()
        .whereBetween('employeShiftsCreatedAt', [startDate, endDate])
        .preload('employee')
        .whereNull('employeShiftsDeletedAt')

      if (payload.employeeId !== undefined && payload.employeeId !== null) {
        query = query.where('employeeId', payload.employeeId)
      }

      if (payload.departmentId !== undefined && payload.departmentId !== null) {
        query = query.whereHas('employee', (builder) => {
          builder.where('department_id', payload.departmentId)
        })
      }

      if (payload.positionId !== undefined && payload.positionId !== null) {
        query = query.whereHas('employee', (builder) => {
          builder.where('position_id', payload.positionId)
        })
      }

      const records = await query

      const employeeRecords = records.reduce((acc, record) => {
        if (!acc[record.employeeId]) {
          acc[record.employeeId] = {
            employeeId: record.employeeId,
            employeeCode: record.employee.employeeCode,
            shifts: [],
          }
        }
        acc[record.employeeId].shifts.push([record.shiftId, record.employeShiftsCreatedAt])
        return acc
      }, {})

      Object.values(employeeRecords).forEach((employee) => {
        employee.shifts.sort((a, b) => new Date(b[1]) - new Date(a[1]))
      })
      return response.status(200).json({
        type: 'success',
        title: 'Successfully fetched',
        message: 'Records fetched successfully',
        data: Object.values(employeeRecords),
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
