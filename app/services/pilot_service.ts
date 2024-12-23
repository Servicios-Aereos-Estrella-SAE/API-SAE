import Pilot from '#models/pilot'
import Person from '#models/person'
import { PilotFilterSearchInterface } from '../interfaces/pilot_filter_search_interface.js'
import Employee from '#models/employee'
import PilotProceedingFile from '#models/pilot_proceeding_file'
import FlightAttendant from '#models/flight_attendant'
import Customer from '#models/customer'

export default class PilotService {
  async index(filters: PilotFilterSearchInterface) {
    const pilots = await Pilot.query()
      .whereNull('pilot_deleted_at')
      .if(filters.search, (query) => {
        query.where((subQuery) => {
          subQuery.whereHas('person', (personQuery) => {
            personQuery.whereRaw('UPPER(person_rfc) LIKE ?', [`%${filters.search.toUpperCase()}%`])
            personQuery.orWhereRaw('UPPER(person_curp) LIKE ?', [
              `%${filters.search.toUpperCase()}%`,
            ])
            personQuery.orWhereRaw('UPPER(person_imss_nss) LIKE ?', [
              `%${filters.search.toUpperCase()}%`,
            ])
            personQuery.orWhereRaw(
              'UPPER(CONCAT(person_firstname, " ", person_lastname, " ", person_second_lastname)) LIKE ?',
              [`%${filters.search.toUpperCase()}%`]
            )
          })
        })
      })
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

  async getProceedingFiles(employeeId: number) {
    const proceedingFiles = await PilotProceedingFile.query()
      .whereNull('pilot_proceeding_file_deleted_at')
      .where('pilot_id', employeeId)
      .preload('proceedingFile', (query) => {
        query.preload('proceedingFileType')
        query.preload('proceedingFileStatus')
      })
      .orderBy('pilot_id')
    return proceedingFiles ? proceedingFiles : []
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
      const existFlightAttendantPersonId = await FlightAttendant.query()
        .whereNull('flight_attendant_deleted_at')
        .where('person_id', pilot.personId)
        .first()
      if (existFlightAttendantPersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another flight attendant',
          message: `The pilot resource cannot be ${action} because the person id is already assigned to another flight attendant`,
          data: { ...pilot },
        }
      }
      const existCustomerPersonId = await Customer.query()
        .whereNull('customer_deleted_at')
        .where('person_id', pilot.personId)
        .first()
      if (existCustomerPersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another customer',
          message: `The pilot resource cannot be ${action} because the person id is already assigned to another customer`,
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
