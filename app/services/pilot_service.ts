import Pilot from '#models/pilot'
import Person from '#models/person'
import { PilotFilterSearchInterface } from '../interfaces/pilot_filter_search_interface.js'
import Employee from '#models/employee'

export default class PilotService {
  async index(filters: PilotFilterSearchInterface) {
    const pilots = await Pilot.query()
      .whereNull('pilot_deleted_at')
      .preload('person')
      .orderBy('pilot_id')
      .paginate(filters.page, filters.limit)
    return pilots
  }

  async create(pilot: Pilot) {
    const newPilot = new Pilot()
    newPilot.personId = await pilot.personId
    newPilot.pilotHireDate = pilot.pilotHireDate
    newPilot.pilotPhoto = pilot.pilotPhoto
    await newPilot.save()
    return newPilot
  }

  async update(currentPilot: Pilot, pilot: Pilot) {
    currentPilot.pilotHireDate = pilot.pilotHireDate
    currentPilot.pilotPhoto = pilot.pilotPhoto
    await currentPilot.save()
    return currentPilot
  }

  async delete(currentPilot: Pilot) {
    await currentPilot.delete()
    return currentPilot
  }

  async show(pilotId: number) {
    const pilot = await Pilot.query()
      .whereNull('pilot_deleted_at')
      .where('pilot_id', pilotId)
      .preload('person')
      .first()
    return pilot ? pilot : null
  }

  async verifyInfoExist(pilot: Pilot) {
    if (!pilot.pilotId) {
      const existPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', pilot.personId)
        .first()

      if (!existPerson && pilot.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...pilot },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...pilot },
    }
  }

  async verifyInfo(pilot: Pilot) {
    const action = pilot.pilotId > 0 ? 'updated' : 'created'
    if (!pilot.pilotId) {
      const existPersonId = await Pilot.query()
        .if(pilot.pilotId > 0, (query) => {
          query.whereNot('pilot_id', pilot.pilotId)
        })
        .whereNull('pilot_deleted_at')
        .where('person_id', pilot.personId)
        .first()

      if (existPersonId && pilot.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The pilot person id exists for another pilot',
          message: `The pilot resource cannot be ${action} because the person id is already assigned to another pilot`,
          data: { ...pilot },
        }
      }
      const existEmployeePersonId = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('person_id', pilot.personId)
        .first()
      if (existEmployeePersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another employee',
          message: `The pilot resource cannot be ${action} because the person id is already assigned to another employee`,
          data: { ...pilot },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...pilot },
    }
  }
}
