import FlightAttendants from '#models/flight_attendant'
import Person from '#models/person'
import Employee from '#models/employee'
import FlightAttendantsProceedingFile from '#models/flight_attendant_proceeding_file'
import { FlightAttendantFilterSearchInterface } from '../interfaces/flight_attendant_filter_search_interface.js'
import Pilot from '#models/pilot'
import Customer from '#models/customer'

export default class FlightAttendantService {
  async index(filters: FlightAttendantFilterSearchInterface) {
    const flightAttendants = await FlightAttendants.query()
      .whereNull('flight_attendant_deleted_at')
      .if(filters.search, (query) => {
        query.where((subQuery) => {
          subQuery.whereHas('person', (personQuery) => {
            personQuery.whereRaw(
              'UPPER(CONCAT(person_firstname, " ", person_lastname, " ", person_second_lastname)) LIKE ?',
              [`%${filters.search.toUpperCase()}%`]
            )
          })
        })
      })
      .preload('person')
      .orderBy('flight_attendant_id')
      .paginate(filters.page, filters.limit)
    return flightAttendants
  }

  async create(flightAttendant: FlightAttendants) {
    const newFlightAttendants = new FlightAttendants()
    newFlightAttendants.personId = await flightAttendant.personId
    newFlightAttendants.flightAttendantHireDate = flightAttendant.flightAttendantHireDate
    newFlightAttendants.flightAttendantPhoto = flightAttendant.flightAttendantPhoto
    await newFlightAttendants.save()
    return newFlightAttendants
  }

  async update(currentFlightAttendants: FlightAttendants, flightAttendant: FlightAttendants) {
    currentFlightAttendants.flightAttendantHireDate = flightAttendant.flightAttendantHireDate
    currentFlightAttendants.flightAttendantPhoto = flightAttendant.flightAttendantPhoto
    await currentFlightAttendants.save()
    return currentFlightAttendants
  }

  async delete(currentFlightAttendants: FlightAttendants) {
    await currentFlightAttendants.delete()
    return currentFlightAttendants
  }

  async show(flightAttendantId: number) {
    const flightAttendant = await FlightAttendants.query()
      .whereNull('flight_attendant_deleted_at')
      .where('flight_attendant_id', flightAttendantId)
      .preload('person')
      .first()
    return flightAttendant ? flightAttendant : null
  }

  async verifyInfoExist(flightAttendant: FlightAttendants) {
    if (!flightAttendant.flightAttendantId) {
      const existPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', flightAttendant.personId)
        .first()

      if (!existPerson && flightAttendant.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...flightAttendant },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...flightAttendant },
    }
  }

  async getProceedingFiles(employeeId: number) {
    const proceedingFiles = await FlightAttendantsProceedingFile.query()
      .whereNull('flight_attendant_proceeding_file_deleted_at')
      .where('flight_attendant_id', employeeId)
      .preload('proceedingFile', (query) => {
        query.preload('proceedingFileType')
      })
      .orderBy('flight_attendant_id')
    return proceedingFiles ? proceedingFiles : []
  }

  async verifyInfo(flightAttendant: FlightAttendants) {
    const action = flightAttendant.flightAttendantId > 0 ? 'updated' : 'created'
    if (!flightAttendant.flightAttendantId) {
      const existPersonId = await FlightAttendants.query()
        .if(flightAttendant.flightAttendantId > 0, (query) => {
          query.whereNot('flight_attendant_id', flightAttendant.flightAttendantId)
        })
        .whereNull('flight_attendant_deleted_at')
        .where('person_id', flightAttendant.personId)
        .first()

      if (existPersonId && flightAttendant.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The flight attendant person id exists for another flight attendant',
          message: `The flight attendant resource cannot be ${action} because the person id is already assigned to another flight attendant`,
          data: { ...flightAttendant },
        }
      }
      const existEmployeePersonId = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('person_id', flightAttendant.personId)
        .first()
      if (existEmployeePersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another employee',
          message: `The flight attendant resource cannot be ${action} because the person id is already assigned to another employee`,
          data: { ...flightAttendant },
        }
      }
      const existPilotPersonId = await Pilot.query()
        .whereNull('pilot_deleted_at')
        .where('person_id', flightAttendant.personId)
        .first()
      if (existPilotPersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another pilot',
          message: `The flight attendant resource cannot be ${action} because the person id is already assigned to another pilot`,
          data: { ...flightAttendant },
        }
      }

      const existCustomerPersonId = await Customer.query()
        .whereNull('customer_deleted_at')
        .where('person_id', flightAttendant.personId)
        .first()
      if (existCustomerPersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another customer',
          message: `The flight attendant resource cannot be ${action} because the person id is already assigned to another customer`,
          data: { ...flightAttendant },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...flightAttendant },
    }
  }
}
