import Position from '#models/position'
import BiometricPositionInterface from '../interfaces/biometric_position_interface.js'

export default class PositionService {
  async syncCreate(position: BiometricPositionInterface) {
    const newPosition = new Position()
    newPosition.positionSyncId = position.id
    newPosition.parentPositionSyncId = position.parentPositionId
    newPosition.positionCode = position.positionCode
    newPosition.positionName = position.positionName
    newPosition.positionIsDefault = position.isDefault
    newPosition.positionActive = 1
    newPosition.parentPositionId = position.parentPositionId
      ? await this.getIdBySyncId(position.parentPositionId)
      : null
    newPosition.companyId = position.companyId
    newPosition.positionLastSynchronizationAt = new Date()
    await newPosition.save()
    return newPosition
  }

  async syncUpdate(position: BiometricPositionInterface, currentPosition: Position) {
    currentPosition.parentPositionSyncId = position.parentPositionId
    currentPosition.positionCode = position.positionCode
    currentPosition.positionName = position.positionName
    currentPosition.positionIsDefault = position.isDefault
    currentPosition.parentPositionId = position.parentPositionId
      ? await this.getIdBySyncId(position.parentPositionId)
      : null
    currentPosition.companyId = position.companyId
    currentPosition.positionLastSynchronizationAt = new Date()
    await currentPosition.save()
    return currentPosition
  }

  async create(position: Position) {
    const newPosition = new Position()
    newPosition.positionCode = position.positionCode
    newPosition.positionName = position.positionName
    newPosition.positionAlias = position.positionAlias
    newPosition.positionIsDefault = position.positionIsDefault
    newPosition.positionActive = position.positionActive
    newPosition.parentPositionId = position.parentPositionId
    newPosition.companyId = position.companyId
    await newPosition.save()
    return newPosition
  }

  async update(currentPosition: Position, position: Position) {
    currentPosition.positionCode = position.positionCode
    currentPosition.positionName = position.positionName
    currentPosition.positionAlias = position.positionAlias
    currentPosition.positionIsDefault = position.positionIsDefault
    currentPosition.positionActive = position.positionActive
    currentPosition.parentPositionId = position.parentPositionId
    currentPosition.companyId = position.companyId
    await currentPosition.save()
    return currentPosition
  }

  async delete(currentPosition: Position) {
    await currentPosition.delete()
    return currentPosition
  }

  async getIdBySyncId(positionSyncId: number) {
    const position = await Position.query().where('position_sync_id', positionSyncId).first()
    if (position) {
      return position.positionId
    } else {
      return 0
    }
  }

  async verifyExistPositionByName(positionName: string) {
    const position = await Position.query().where('position_name', positionName).first()
    if (position) {
      return position.positionId
    } else {
      return null
    }
  }

  async show(positionId: number) {
    const position = await Position.query()
      .whereNull('position_deleted_at')
      .where('position_id', positionId)
      .first()
    return position ? position : null
  }

  async verifyInfoExist(position: Position) {
    if (position.parentPositionId) {
      const existPositionParent = await Position.query()
        .whereNull('position_deleted_at')
        .where('position_id', position.parentPositionId)
        .first()

      if (!existPositionParent && position.parentPositionId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The position parent was not found',
          message: 'The position parent was not found with the entered ID',
          data: { ...position },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...position },
    }
  }

  async verifyInfo(position: Position) {
    const action = position.positionId > 0 ? 'updated' : 'created'
    const existCode = await Position.query()
      .if(position.positionId > 0, (query) => {
        query.whereNot('position_id', position.positionId)
      })
      .whereNull('position_deleted_at')
      .where('position_code', position.positionCode)
      .first()

    if (existCode && position.positionCode) {
      return {
        status: 400,
        type: 'warning',
        title: 'The position code already exists for another position',
        message: `The position resource cannot be ${action} because the code is already assigned to another position`,
        data: { ...position },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...position },
    }
  }
}
