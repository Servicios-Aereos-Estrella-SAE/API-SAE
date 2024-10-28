import { HttpContext } from '@adonisjs/core/http'

export default class EmployeeVacationController {
  /**
   * @swagger
   * /api/v1/assists/get-excel:
   *   get:
   *     summary: get assists excel by position
   *     security:
   *       - bearerAuth: []
   *     tags: [Assists]
   *     parameters:
   *       - name: date
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2022-01-01"
   *         description: Date from get list
   *       - name: date-end
   *         in: query
   *         required: true
   *         schema:
   *           type: string
   *         default: "2024-12-31"
   *         description: Date limit to get list
   *       - name: employeeId
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *         description: Employee id
   *       - name: departmentId
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *         description: Department id
   *     responses:
   *       200:
   *         description: Resource action successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example: {}
   *       400:
   *         description: Invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  async getExcel({ request, response }: HttpContext) {
    try {
      return request
      /*    const employeeId = request.input('employeeId')
      const departmentId = request.input('departmentId')
      const filterDate = request.input('date')
      const filterDateEnd = request.input('date-end')
      const filters = {
        employeeId: employeeId,
        departmentId: departmentId,
        filterDate: filterDate,
        filterDateEnd: filterDateEnd,
      } as EmployeeVacationExcelFilterInterface */
      /*  const emplpoyeeVacationService = new EmployeeVacationService()
      const buffer = await emplpoyeeVacationService.getExcel(filters)
      if (buffer.status === 201) {
        response.header(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response.header('Content-Disposition', 'attachment; filename=datos.xlsx')
        response.status(201)
        response.send(buffer.buffer)
      } else {
        response.status(500)
        return {
          type: buffer.type,
          title: buffer.title,
          message: buffer.message,
          error: buffer.error,
        }
      } */
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
