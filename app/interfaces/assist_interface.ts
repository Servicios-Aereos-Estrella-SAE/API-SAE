import { DateTime } from 'luxon'

interface AssistInterface {
  assistId: number | null
  assistEmpCode: string
  assistPunchTime: DateTime
  assistPunchTimeUtc: DateTime
  assistPunchTimeOrigin: DateTime
  assistTerminalSn: string
  assistTerminalAlias: string
  assistAreaAlias: string
  assistLongitude: string
  assistLatitude: string
  assistUploadTime: string | Date | null
  assistEmpId: number
  assistTerminalId: number
  assistAssistSyncId: string
  assistCreatedAt: string | Date | null
  assistUpdatedAt: string | Date | null
}

export type { AssistInterface }
