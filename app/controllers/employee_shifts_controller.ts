import { HttpContext } from '@adonisjs/core/http'
import EmployeeShift from '../models/employee_shift.js'
import {
  createEmployeeShiftValidator,
  updateEmployeeShiftValidator,
} from '../validators/employee_shift.js'
import { DateTime } from 'luxon'

export default class EmployeeShiftController {
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createEmployeeShiftValidator)
      const employeeShift = await EmployeeShift.create(data)
      return response.status(201).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource created',
        data: employeeShift.toJSON(),
      })
    } catch (error) {
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages,
        data: null,
      })
    }
  }

  async index({ response }: HttpContext) {
    try {
      const employeeShifts = await EmployeeShift.query().whereNull('employeShiftsDeletedAt')
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        data: employeeShifts,
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

  async show({ params, response }: HttpContext) {
    try {
      const employeeShift = await EmployeeShift.findOrFail(params.id)
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource fetched',
        data: employeeShift,
      })
    } catch (error) {
      return response.status(404).json({
        type: 'error',
        title: 'Not found',
        message: 'Resource not found',
        data: null,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateEmployeeShiftValidator)
      const employeeShift = await EmployeeShift.findOrFail(params.id)
      employeeShift.merge(data)
      await employeeShift.save()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource updated',
        data: employeeShift.toJSON(),
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          type: 'error',
          title: 'Not found',
          message: 'Resource not found',
          data: null,
        })
      }
      return response.status(400).json({
        type: 'error',
        title: 'Validation error',
        message: error.messages || error.message,
        data: null,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const employeeShift = await EmployeeShift.findOrFail(params.id)
      employeeShift.employeShiftsDeletedAt = DateTime.now()
      await employeeShift.save()
      return response.status(200).json({
        type: 'success',
        title: 'Successfully action',
        message: 'Resource deleted',
        data: null,
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          type: 'error',
          title: 'Not found',
          message: 'Resource not found',
          data: null,
        })
      }
      return response.status(500).json({
        type: 'error',
        title: 'Server error',
        message: 'An error occurred while deleting the resource',
        data: null,
      })
    }
  }
}
