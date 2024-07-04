/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationDto:
 *       type: object
 *       properties:
 *         totalItems:
 *           type: number
 *           example: 100
 *         page:
 *           type: number
 *           example: 1
 *         pageSize:
 *           type: number
 *           example: 10
 *         totalPages:
 *           type: number
 *           example: 10
 *         DateParam:
 *           type: string
 *           format: date-time
 *           example: "2024-07-01T12:00:00Z"
 */
export default interface PaginationDto {
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  DateParam: Date
}
