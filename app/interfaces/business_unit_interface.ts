import { DateTime } from 'luxon'

interface BusinessUnitInterface {
  business_unit_id: number
  business_unit_name: string
  business_unit_slug: string
  business_unit_legal_name: string
  business_unit_active: number
  business_unit_created_at: DateTime | null
  business_unit_updated_at: DateTime | null
  business_unit_deleted_at: DateTime | null
}

export type { BusinessUnitInterface }
