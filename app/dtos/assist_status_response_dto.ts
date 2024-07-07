import AssistStatusSync from '#models/assist_status_sync'
import AssistPageSync from '#models/assist_page_sync'
import PaginationDto from '#dtos/pagination_api_dto'
/**
 * @swagger
 * components:
 *   schemas:
 *     AssistStatusResponseDto:
 *       type: object
 *       properties:
 *         assistStatusSyncs:
 *           $ref: '#/components/schemas/AssistStatusSync'
 *         lastAssistPageSync:
 *           $ref: '#/components/schemas/AssistPageSync'
 *         paginationApiBiometrics:
 *          $ref: '#/components/schemas/PaginationDto'
 */
export default class AssistStatusResponseDto {
  declare assistStatusSyncs: AssistStatusSync
  declare lastAssistPageSync: AssistPageSync
  declare paginationApiBiometrics: PaginationDto

  constructor(
    assistStatusSyncs: AssistStatusSync,
    lastAssistPageSync: AssistPageSync,
    paginationApiBiometrics: PaginationDto
  ) {
    this.assistStatusSyncs = assistStatusSyncs
    this.lastAssistPageSync = lastAssistPageSync
    this.paginationApiBiometrics = paginationApiBiometrics
  }
}
