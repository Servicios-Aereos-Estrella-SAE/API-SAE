import Customer from '#models/customer'
import Person from '#models/person'
import { CustomerFilterSearchInterface } from '../interfaces/customer_filter_search_interface.js'
import Employee from '#models/employee'
import CustomerProceedingFile from '#models/customer_proceeding_file'
import FlightAttendant from '#models/flight_attendant'
import Pilot from '#models/pilot'

export default class CustomerService {
  async index(filters: CustomerFilterSearchInterface) {
    const customers = await Customer.query()
      .whereNull('customer_deleted_at')
      .if(filters.search, (query) => {
        query.where((subQuery) => {
          subQuery.whereRaw('UPPER(customer_uuid) LIKE ?', [`%${filters.search.toUpperCase()}%`])
          subQuery.orWhereHas('person', (personQuery) => {
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
      .orderBy('customer_id')
      .paginate(filters.page, filters.limit)
    return customers
  }

  async create(customer: Customer) {
    const newCustomer = new Customer()
    newCustomer.personId = await customer.personId
    newCustomer.customerUuid = customer.customerUuid
    await newCustomer.save()
    return newCustomer
  }

  async update(currentCustomer: Customer, customer: Customer) {
    currentCustomer.customerUuid = customer.customerUuid
    await currentCustomer.save()
    return currentCustomer
  }

  async delete(currentCustomer: Customer) {
    await currentCustomer.delete()
    return currentCustomer
  }

  async show(customerId: number) {
    const customer = await Customer.query()
      .whereNull('customer_deleted_at')
      .where('customer_id', customerId)
      .preload('person')
      .first()
    return customer ? customer : null
  }

  async verifyInfoExist(customer: Customer) {
    if (!customer.customerId) {
      const existPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', customer.personId)
        .first()

      if (!existPerson && customer.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...customer },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...customer },
    }
  }

  async getProceedingFiles(employeeId: number) {
    const proceedingFiles = await CustomerProceedingFile.query()
      .whereNull('customer_proceeding_file_deleted_at')
      .where('customer_id', employeeId)
      .preload('proceedingFile', (query) => {
        query.preload('proceedingFileType')
        query.preload('proceedingFileStatus')
      })
      .orderBy('customer_id')
    return proceedingFiles ? proceedingFiles : []
  }

  async verifyInfo(customer: Customer) {
    const action = customer.customerId > 0 ? 'updated' : 'created'
    const existUuid = await Customer.query()
      .if(customer.customerId > 0, (query) => {
        query.whereNot('customer_id', customer.customerId)
      })
      .whereNull('customer_deleted_at')
      .where('customer_uuid', customer.customerUuid)
      .first()

    if (existUuid && customer.customerUuid) {
      return {
        status: 400,
        type: 'warning',
        title: 'The customer uuid exists for another customer',
        message: `The customer resource cannot be ${action} because the uuid is already assigned to another customer`,
        data: { ...customer },
      }
    }
    if (!customer.customerId) {
      const existPersonId = await Customer.query()
        .if(customer.customerId > 0, (query) => {
          query.whereNot('customer_id', customer.customerId)
        })
        .whereNull('customer_deleted_at')
        .where('person_id', customer.personId)
        .first()

      if (existPersonId && customer.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The customer person id exists for another customer',
          message: `The customer resource cannot be ${action} because the person id is already assigned to another customer`,
          data: { ...customer },
        }
      }
      const existEmployeePersonId = await Employee.query()
        .whereNull('employee_deleted_at')
        .where('person_id', customer.personId)
        .first()
      if (existEmployeePersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another employee',
          message: `The customer resource cannot be ${action} because the person id is already assigned to another employee`,
          data: { ...customer },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...customer },
    }
  }
}
