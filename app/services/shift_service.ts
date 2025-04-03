import Shift from '#models/shift'

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
}
