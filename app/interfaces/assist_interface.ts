interface AssistInterface {
  id: number | null
  empCode: string
  punchTime: string | Date
  punchTimeUtc: string | Date
  punchTimeOrigin: string | Date
  terminalSn: string
  terminalAlias: string
  areaAlias: string
  longitude: string
  latitude: string
  uploadTime: string | Date | null
  empId: number
  terminalId: number
  assistSyncId: string
  createdAt: string | Date | null
  updatedAt: string | Date | null
}

export type { AssistInterface }
