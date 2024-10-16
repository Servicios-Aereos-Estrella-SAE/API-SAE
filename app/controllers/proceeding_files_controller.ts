import mail from '@adonisjs/mail/services/main'
import axios from 'axios'
import { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class ProceedingFilesController {
  /**
   * @swagger
   * /api/send-expiring:
   *   get:
   *     tags:
   *       - Proceeding Files
   *     summary: Get expiring and expired proceeding files report
   *     description: This endpoint fetches the expired and expiring proceeding files for aircraft, employees, and pilots, and sends the report via email.
   *     parameters:
   *       - in: query
   *         name: dateStart
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: The start date for the report. Default is '2024-01-01'.
   *       - in: query
   *         name: dateEnd
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: The end date for the report. Default is '2024-10-15'.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Email sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Email sent successfully
   *       401:
   *         description: Authorization token is missing
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Authorization token is missing
   *       500:
   *         description: Failed to send email
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Failed to send email
   */

  async sendExpiringAndExpiredFilesReport({ request, response }: HttpContext) {
    try {
      const dateStart = request.input('dateStart') || '2024-01-01'
      const dateEnd = request.input('dateEnd') || '2024-10-15'
      const token = request.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        return response.status(401).send({ error: 'Authorization token is missing' })
      }
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const aircraftUrl = `http://${env.get('HOST')}:${env.get('PORT')}/api/aircraft-proceeding-files/get-expired-and-expiring`
      const employeeUrl = `http://${env.get('HOST')}:${env.get('PORT')}/api/employees-proceeding-files/get-expired-and-expiring`
      const pilotsUrl = `http://${env.get('HOST')}:${env.get('PORT')}/api/pilots-proceeding-files/get-expired-and-expiring`
      const params = {
        dateStart,
        dateEnd,
      }
      const [aircraftFiles, employeeFiles, pilotFiles] = await Promise.all([
        axios.get(aircraftUrl, { params, ...axiosConfig }),
        axios.get(employeeUrl, { params, ...axiosConfig }),
        axios.get(pilotsUrl, { params, ...axiosConfig }),
      ])

      const allFiles = {
        aircraft: aircraftFiles.data,
        employee: employeeFiles.data,
        pilots: pilotFiles.data,
      }
      const userEmail = env.get('SMTP_USERNAME')
      if (userEmail) {
        await mail.send((message) => {
          message
            .to('aescobar@siler-mx.com')
            .from(userEmail, 'SAE')
            .subject('Expiring and Expired Proceeding Files Report')
            .htmlView('emails/proceeding_files_report', {
              expiredFiles:
                allFiles.aircraft.data?.aircraftProceedingFiles?.proceedingFilesExpired || [],
              expiredFilesEmployee:
                allFiles.employee.data?.employeeProceedingFiles?.proceedingFilesExpired || [],
              expiredFilesPilots:
                allFiles.pilots.data?.pilotProceedingFiles?.proceedingFilesExpired || [],
            })
        })
      }
      return response.status(200).send({ message: 'Email sent successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).send({ error: 'Failed to send email' })
    }
  }
}
