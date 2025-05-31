import Shift from '#models/shift'
import env from '#start/env'

export default class ShiftService {
  async create(shift: Shift) {
    const newShift = new Shift()
    newShift.shiftName = shift.shiftName
    newShift.shiftCalculateFlag = shift.shiftCalculateFlag
    newShift.shiftDayStart = shift.shiftDayStart
    newShift.shiftTimeStart = shift.shiftTimeStart
    newShift.shiftActiveHours = shift.shiftActiveHours
    newShift.shiftRestDays = shift.shiftRestDays
    newShift.shiftAccumulatedFault = shift.shiftAccumulatedFault
    newShift.shiftBusinessUnits = shift.shiftBusinessUnits
    await newShift.save()

    return newShift
  }

  async verifyInfo(shift: Shift) {
    const businessConf = `${env.get('SYSTEM_BUSINESS')}`
    const businessList = businessConf.split(',')
    const action = shift.shiftId > 0 ? 'updated' : 'created'
    const existCode = await Shift.query()
      .if(shift.shiftId > 0, (query) => {
        query.whereNot('shift_id', shift.shiftId)
      })
      .whereNull('shift_deleted_at')
      .where('shift_name', shift.shiftName)
      .andWhere((subQuery) => {
        businessList.forEach((business) => {
          subQuery.orWhereRaw('FIND_IN_SET(?, shift_business_units)', [business.trim()])
        })
      })
      .first()

    if (existCode && shift.shiftName) {
      return {
        status: 400,
        type: 'warning',
        title: 'The shift name already exists for another shift',
        message: `The shift resource cannot be ${action} because the code is already assigned to another shift`,
        data: { ...shift },
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...shift },
    }
  }
}
