import Position from '#models/position'
import BiometricPositionInterface from '../interfaces/biometric_position_interface.js'

export default class PositionService {
  async create(position: BiometricPositionInterface) {
    const newPosition = new Position()
    newPosition.position_sync_id = position.id
    newPosition.parent_position_sync_id = position.parentPositionId
    newPosition.position_code = position.positionCode
    newPosition.position_name = position.positionName
    newPosition.position_is_default = position.isDefault
    newPosition.position_active = 1
    newPosition.parent_position_id = position.parentPositionId
      ? await this.getIdBySyncId(position.parentPositionId)
      : null
    newPosition.company_id = position.companyId
    newPosition.position_last_synchronization_at = new Date()
    await newPosition.save()
    return newPosition
  }

  async update(position: BiometricPositionInterface, currentPosition: Position) {
    currentPosition.parent_position_sync_id = position.parentPositionId
    currentPosition.position_code = position.positionCode
    currentPosition.position_name = position.positionName
    currentPosition.position_is_default = position.isDefault
    currentPosition.parent_position_id = position.parentPositionId
      ? await this.getIdBySyncId(position.parentPositionId)
      : null
    currentPosition.company_id = position.companyId
    currentPosition.position_last_synchronization_at = new Date()
    await currentPosition.save()
    return currentPosition
  }

  async getIdBySyncId(positionSyncId: number) {
    const position = await Position.query().where('position_sync_id', positionSyncId).first()
    if (position) {
      return position.position_id
    } else {
      return 0
    }
  }

  async verifyExistPositionByName(positionName: string) {
    const position = await Position.query().where('position_name', positionName).first()
    if (position) {
      return position.position_id
    } else {
      return null
    }
  }
}
