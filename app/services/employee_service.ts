import Department from '#models/department'
import Employee from '#models/employee'
import EmployeeProceedingFile from '#models/employee_proceeding_file'
import ExceptionType from '#models/exception_type'
import Person from '#models/person'
import Position from '#models/position'
import ShiftException from '#models/shift_exception'
import User from '#models/user'
import { DateTime } from 'luxon'
import BiometricEmployeeInterface from '../interfaces/biometric_employee_interface.js'
import { EmployeeFilterSearchInterface } from '../interfaces/employee_filter_search_interface.js'
import DepartmentService from './department_service.js'
import PersonService from './person_service.js'
import PositionService from './position_service.js'
import VacationSetting from '#models/vacation_setting'
import FlightAttendant from '#models/flight_attendant'
import Customer from '#models/customer'
import env from '#start/env'
import BusinessUnit from '#models/business_unit'
import EmployeeType from '#models/employee_type'
import axios from 'axios'
import EmployeeContract from '#models/employee_contract'
import EmployeeBank from '#models/employee_bank'

export default class EmployeeService {
  async syncCreate(employee: BiometricEmployeeInterface) {
    const newEmployee = new Employee()
    const personService = new PersonService()
    const newPerson = await personService.syncCreate(employee)
    if (newPerson) {
      newEmployee.personId = newPerson.personId
    }
    newEmployee.employeeSyncId = employee.id
    newEmployee.employeeCode = employee.empCode
    newEmployee.employeeFirstName = employee.firstName
    newEmployee.employeeLastName = employee.lastName
    newEmployee.employeePayrollNum = employee.payrollNum
    newEmployee.employeeHireDate = employee.hireDate
    newEmployee.companyId = employee.companyId
    newEmployee.departmentId = employee.departmentId
    newEmployee.positionId = employee.positionId
    if (employee.empCode) {
      const urlPhoto = `${env.get('API_BIOMETRICS_EMPLOYEE_PHOTO_URL')}/${employee.empCode}.jpg`
      const existPhoto = await this.verifyExistPhoto(urlPhoto)
      if (existPhoto) {
        newEmployee.employeePhoto = urlPhoto
      }
    }
    newEmployee.employeeLastSynchronizationAt = new Date()
    await newEmployee.save()
    return newEmployee
  }

  async syncUpdate(
    employee: BiometricEmployeeInterface,
    currentEmployee: Employee,
    departmentService: DepartmentService,
    positionService: PositionService
  ) {
    if (!currentEmployee.personId) {
      const personService = new PersonService()
      const newPerson = await personService.syncCreate(employee)
      currentEmployee.personId = newPerson ? newPerson.personId : 0
    }
    currentEmployee.employeeSyncId = employee.id
    currentEmployee.employeeCode = employee.empCode
    currentEmployee.employeeFirstName = employee.firstName
    currentEmployee.employeeLastName = employee.lastName
    currentEmployee.employeePayrollNum = employee.payrollNum
    currentEmployee.employeeHireDate = employee.hireDate
    currentEmployee.companyId = employee.companyId
    currentEmployee.departmentId = await departmentService.getIdBySyncId(employee.departmentId)
    const positionRealId = await positionService.getIdBySyncId(employee.positionId)
    if (positionRealId) {
      currentEmployee.positionId = positionRealId
    } else {
      currentEmployee.positionId = await this.getNewPosition(
        employee,
        positionService,
        departmentService
      )
    }
    currentEmployee.departmentSyncId = employee.departmentId
    currentEmployee.positionSyncId = employee.positionId
    currentEmployee.employeeLastSynchronizationAt = new Date()
    await currentEmployee.save()
    return currentEmployee
  }

  async index(filters: EmployeeFilterSearchInterface, departmentsList: Array<number>) {
    const businessConf = `${env.get('SYSTEM_BUSINESS')}`
    const businessList = businessConf.split(',')
    const businessUnits = await BusinessUnit.query()
      .where('business_unit_active', 1)
      .whereIn('business_unit_slug', businessList)
    const businessUnitsList = businessUnits.map((business) => business.businessUnitId)
    const employees = await Employee.query()
      .whereIn('businessUnitId', businessUnitsList)
      .if(filters.search, (query) => {
        query.where((subQuery) => {
          subQuery
            .whereRaw('UPPER(CONCAT(employee_first_name, " ", employee_last_name)) LIKE ?', [
              `%${filters.search.toUpperCase()}%`,
            ])
            .orWhereRaw('UPPER(employee_code) = ?', [`${filters.search.toUpperCase()}`])
            .orWhereHas('person', (personQuery) => {
              personQuery.whereRaw('UPPER(person_rfc) LIKE ?', [
                `%${filters.search.toUpperCase()}%`,
              ])
              personQuery.orWhereRaw('UPPER(person_curp) LIKE ?', [
                `%${filters.search.toUpperCase()}%`,
              ])
              personQuery.orWhereRaw('UPPER(person_imss_nss) LIKE ?', [
                `%${filters.search.toUpperCase()}%`,
              ])
              personQuery.orWhereRaw('UPPER(person_email) LIKE ?', [
                `%${filters.search.toUpperCase()}%`,
              ])
            })
        })
      })
      .if(filters.employeeWorkSchedule, (query) => {
        query.where((subQuery) => {
          subQuery.whereRaw('UPPER(employee_work_schedule) LIKE ?', [
            `%${filters.employeeWorkSchedule.toUpperCase()}%`,
          ])
        })
      })
      .if(filters.departmentId, (query) => {
        query.where('department_id', filters.departmentId)
      })
      .if(filters.departmentId && filters.positionId, (query) => {
        query.where('department_id', filters.departmentId)
        query.where('position_id', filters.positionId)
      })
      .if(filters.ignoreDiscriminated === 1, (query) => {
        query.where('employeeAssistDiscriminator', 0)
      })
      .if(filters.ignoreExternal === 1, (query) => {
        query.where('employee_type_of_contract', 'Internal')
      })
      .if(
        filters.onlyInactive && (filters.onlyInactive === 'true' || filters.onlyInactive === true),
        (query) => {
          query.whereNotNull('employee_deleted_at')
          query.withTrashed()
        }
      )
      .if(filters.employeeTypeId, (query) => {
        query.where('employee_type_id', filters.employeeTypeId ? filters.employeeTypeId : 0)
      })
      .whereIn('departmentId', departmentsList)
      .preload('department')
      .preload('position')
      .preload('person')
      .preload('businessUnit')
      .preload('address')
      .orderBy('employee_id')
      .paginate(filters.page, filters.limit)
    return employees
  }

  async create(employee: Employee) {
    const newEmployee = new Employee()
    newEmployee.employeeFirstName = employee.employeeFirstName
    newEmployee.employeeLastName = employee.employeeLastName
    newEmployee.employeeCode = employee.employeeCode
    newEmployee.employeePayrollNum = employee.employeePayrollNum
    newEmployee.employeeHireDate = employee.employeeHireDate
    newEmployee.employeeTerminatedDate = employee.employeeTerminatedDate
    newEmployee.companyId = employee.companyId
    newEmployee.departmentId = employee.departmentId
    newEmployee.positionId = employee.positionId
    newEmployee.personId = employee.personId
    newEmployee.businessUnitId = employee.businessUnitId
    newEmployee.employeeWorkSchedule = employee.employeeWorkSchedule
    newEmployee.employeeAssistDiscriminator = employee.employeeAssistDiscriminator
    newEmployee.employeeTypeOfContract = employee.employeeTypeOfContract
    newEmployee.employeeTypeId = employee.employeeTypeId
    newEmployee.employeeBusinessEmail = employee.employeeBusinessEmail
    await newEmployee.save()
    await newEmployee.load('businessUnit')
    return newEmployee
  }

  async update(currentEmployee: Employee, employee: Employee) {
    currentEmployee.employeeFirstName = employee.employeeFirstName
    currentEmployee.employeeLastName = employee.employeeLastName
    currentEmployee.employeeCode = employee.employeeCode
    currentEmployee.employeePayrollNum = employee.employeePayrollNum
    currentEmployee.employeeHireDate = employee.employeeHireDate
    currentEmployee.employeeTerminatedDate = employee.employeeTerminatedDate
    currentEmployee.companyId = employee.companyId
    currentEmployee.departmentId = employee.departmentId
    currentEmployee.positionId = employee.positionId
    currentEmployee.businessUnitId = employee.businessUnitId
    currentEmployee.employeeWorkSchedule = employee.employeeWorkSchedule
    currentEmployee.employeeAssistDiscriminator = employee.employeeAssistDiscriminator
    currentEmployee.employeeTypeOfContract = employee.employeeTypeOfContract
    currentEmployee.employeeTypeId = employee.employeeTypeId
    currentEmployee.employeeBusinessEmail = employee.employeeBusinessEmail
    await currentEmployee.save()
    await currentEmployee.load('businessUnit')
    return currentEmployee
  }

  async updateEmployeePhotoUrl(employeeId: number, photoUrl: string) {
    const currentEmployee = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('employee_id', employeeId)
      .first()
    if (!currentEmployee) {
      return null
    }
    currentEmployee.employeePhoto = photoUrl
    await currentEmployee.save()
    return Employee.query()
      .preload('person')
      .preload('department')
      .preload('position')
      .where('employee_id', employeeId)
      .first()
  }

  async delete(currentEmployee: Employee) {
    currentEmployee.employeeCode = `${currentEmployee.employeeCode}-IN${DateTime.now().toSeconds().toFixed(0)}`
    await currentEmployee.save()
    await currentEmployee.delete()
    return currentEmployee
  }

  async show(employeeId: number) {
    const employee = await Employee.query()
      .where('employee_id', employeeId)
      .preload('department')
      .preload('position')
      .preload('person')
      .preload('businessUnit')
      .preload('spouse')
      .preload('emergencyContact')
      .preload('children')
      .withTrashed()
      .first()
    return employee ? employee : null
  }

  async getByCode(employeeCode: number) {
    const employee = await Employee.query()
      .where('employee_code', employeeCode)
      .preload('department')
      .preload('position')
      .preload('person')
      .preload('businessUnit')
      .withTrashed()
      .first()
    return employee ? employee : null
  }

  async getNewPosition(
    employee: BiometricEmployeeInterface,
    positionService: PositionService,
    departmentService: DepartmentService
  ) {
    let positionId = 0
    const department = await departmentService.showSync(employee.departmentId)
    if (department) {
      const existPosition = await positionService.verifyExistPositionByName(
        department.departmentName
      )
      if (existPosition) {
        positionId = existPosition
      } else {
        positionId = await departmentService.addPosition(department)
      }
    }
    return positionId
  }

  async verifyInfoExist(employee: Employee) {
    if (!employee.departmentId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department was not found',
        message: 'The department was not found with the entered ID',
        data: { ...employee },
      }
    }
    const existDepartment = await Department.query()
      .whereNull('department_deleted_at')
      .where('department_id', employee.departmentId)
      .first()

    if (!existDepartment && employee.departmentId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The department was not found',
        message: 'The department was not found with the entered ID',
        data: { ...employee },
      }
    }
    if (!employee.positionId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The position was not found',
        message: 'The position was not found with the entered ID',
        data: { ...employee },
      }
    }

    const existPosition = await Position.query()
      .whereNull('position_deleted_at')
      .where('position_id', employee.positionId)
      .first()

    if (!existPosition && employee.positionId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The position was not found',
        message: 'The position was not found with the entered ID',
        data: { ...employee },
      }
    }

    const existEmployeeType = await EmployeeType.query()
      .whereNull('employee_type_deleted_at')
      .where('employee_type_id', employee.employeeTypeId)
      .first()

    if (!existEmployeeType && employee.employeeTypeId) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee type was not found',
        message: 'The employee type was not found with the entered ID',
        data: { ...employee },
      }
    }
    if (!employee.employeeId) {
      const existPerson = await Person.query()
        .whereNull('person_deleted_at')
        .where('person_id', employee.personId)
        .first()

      if (!existPerson && employee.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person was not found',
          message: 'The person was not found with the entered ID',
          data: { ...employee },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verify successfully',
      data: { ...employee },
    }
  }

  async verifyInfo(employee: Employee) {
    const action = employee.employeeId > 0 ? 'updated' : 'created'
    const existCode = await Employee.query()
      .if(employee.employeeId > 0, (query) => {
        query.whereNot('employee_id', employee.employeeId)
      })
      .whereNull('employee_deleted_at')
      .where('employee_code', employee.employeeCode)
      .first()

    if (existCode && employee.employeeCode) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee code already exists for another employee',
        message: `The employee resource cannot be ${action} because the code is already assigned to another employee`,
        data: { ...employee },
      }
    }
    const existBusinessEmail = await Employee.query()
      .if(employee.employeeId > 0, (query) => {
        query.whereNot('employee_id', employee.employeeId)
      })
      .whereNull('employee_deleted_at')
      .where('employee_business_email', employee.employeeBusinessEmail)
      .first()

    if (existBusinessEmail && employee.employeeBusinessEmail) {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee business email already exists for another employee',
        message: `The employee resource cannot be ${action} because the business email is already assigned to another employee`,
        data: { ...employee },
      }
    }
    if (!employee.employeeId) {
      const existPersonId = await Employee.query()
        .if(employee.employeeId > 0, (query) => {
          query.whereNot('employee_id', employee.employeeId)
        })
        .whereNull('employee_deleted_at')
        .where('person_id', employee.personId)
        .first()
      if (existPersonId && employee.personId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The employee person id exists for another employee',
          message: `The employee resource cannot be ${action} because the person id is already assigned to another employee`,
          data: { ...employee },
        }
      }
      const existFlightAttendantPersonId = await FlightAttendant.query()
        .whereNull('flight_attendant_deleted_at')
        .where('employee_id', employee.employeeId)
        .first()
      if (existFlightAttendantPersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The employee id exists for another flight attendant',
          message: `The employee resource cannot be ${action} because the person id is already assigned to another flight attendant`,
          data: { ...employee },
        }
      }
      const existCustomerPersonId = await Customer.query()
        .whereNull('customer_deleted_at')
        .where('person_id', employee.personId)
        .first()
      if (existCustomerPersonId) {
        return {
          status: 400,
          type: 'warning',
          title: 'The person id exists for another customer',
          message: `The employee resource cannot be ${action} because the person id is already assigned to another customer`,
          data: { ...employee },
        }
      }
    }
    return {
      status: 200,
      type: 'success',
      title: 'Info verifiy successfully',
      message: 'Info verifiy successfully',
      data: { ...employee },
    }
  }

  async indexWithOutUser(filters: EmployeeFilterSearchInterface) {
    const personUsed = await User.query()
      .whereNull('user_deleted_at')
      .select('person_id')
      .distinct('person_id')
      .orderBy('person_id')
    const persons = [] as Array<number>
    for await (const user of personUsed) {
      persons.push(user.personId)
    }
    const employees = await Employee.query()
      .if(filters.search, (query) => {
        query.whereRaw('UPPER(CONCAT(employee_first_name, " ", employee_last_name)) LIKE ?', [
          `%${filters.search.toUpperCase()}%`,
        ])
        query.orWhereRaw('UPPER(employee_code) = ?', [`${filters.search.toUpperCase()}`])
      })
      .if(filters.departmentId && filters.positionId, (query) => {
        query.where('department_id', filters.departmentId)
        query.where('position_id', filters.positionId)
      })
      .whereNotIn('person_id', persons)
      .preload('department')
      .preload('position')
      .orderBy('employee_id')
      .paginate(filters.page, filters.limit)
    return employees
  }

  async getWorkSchedules() {
    const workSchedules = await Employee.query()
      .whereNull('employee_deleted_at')
      .select('employee_work_schedule')
      .distinct('employee_work_schedule')
    return workSchedules
  }

  async getProceedingFiles(employeeId: number, fileType: number) {
    const proceedingFiles = await EmployeeProceedingFile.query()
      .whereNull('employee_proceeding_file_deleted_at')
      .where('employee_id', employeeId)
      .whereHas('proceedingFile', (fileQuery) => {
        fileQuery.if(fileType, (query) => {
          query.where('proceedingFileTypeId', fileType)
        })
      })
      .preload('proceedingFile', (query) => {
        query.preload('proceedingFileType')
        query.preload('proceedingFileStatus')
        query.if(fileType, (subquery) => {
          subquery.where('proceedingFileTypeId', fileType)
        })
      })
      .orderBy('employee_id')
      .paginate(1, 9999999)

    return proceedingFiles ? proceedingFiles : []

    // AircraftProceedingFile.query()
    //         .whereNull('deletedAt')
    //         .where('aircraftId', aircraftId)
    //         .whereHas('proceedingFile', (fileQuery) => {
    //           fileQuery.if(fileType, (query) => {
    //             query.where('proceedingFileTypeId', fileType)
    //           })
    //         })
    //         .preload('proceedingFile', (fileQuery) => {
    //           fileQuery.preload('proceedingFileType')
    //           fileQuery.preload('proceedingFileStatus')
    //           fileQuery.if(fileType, (query) => {
    //             query.where('proceedingFileTypeId', fileType)
    //           })
    //         })
    //         .orderBy('aircraftProceedingFileCreatedAt', 'desc')
  }

  async getVacationsUsed(employee: Employee) {
    const shiftExceptionVacation = await ExceptionType.query()
      .whereNull('exception_type_deleted_at')
      .where('exception_type_slug', 'vacation')
      .first()
    if (!shiftExceptionVacation) {
      return {
        status: 404,
        type: 'warning',
        title: 'The exception type vacation was not found',
        message: 'The exception type vacation was not found with the entered ID',
        data: {},
      }
    }
    const period = await this.getCurrentVacationPeriod(employee)
    if (period && period.vacationPeriodStart) {
      const vacations = await ShiftException.query()
        .whereNull('shift_exceptions_deleted_at')
        .where('employee_id', employee.employeeId)
        .where('exception_type_id', shiftExceptionVacation.exceptionTypeId)
        .whereRaw('DATE(shift_exceptions_date) >= ?', [period.vacationPeriodStart])
        .whereRaw('DATE(shift_exceptions_date) <= ?', [period.vacationPeriodEnd])
        .orderBy('employee_id')
      const vacationsUsed = vacations ? vacations.length : 0
      return {
        status: 200,
        type: 'success',
        title: 'Info verifiy successfully',
        message: 'Info verifiy successfully',
        data: vacationsUsed,
      }
    } else {
      return {
        status: 400,
        type: 'warning',
        title: 'The vacation period was not found',
        message: 'The vacation period was not found ',
        data: {},
      }
    }
  }

  async getDaysVacationsCorresponing(employee: Employee) {
    const employeeVacationsInfo = await this.getCurrentVacationPeriod(employee)
    if (employeeVacationsInfo && employeeVacationsInfo.yearsWorked) {
      const yearWorked = Math.floor(employeeVacationsInfo.yearsWorked)
      const employeeType = await EmployeeType.query()
        .whereNull('employee_type_deleted_at')
        .where('employee_type_id', employee.employeeTypeId)
        .first()
      let employeeIsCrew = false
      if (employeeType) {
        if (
          employeeType.employeeTypeSlug === 'pilot' ||
          employeeType.employeeTypeSlug === 'flight-attendant'
        ) {
          employeeIsCrew = true
        }
      }
      let vacationSetting = await VacationSetting.query()
        .whereNull('vacation_setting_deleted_at')
        .where('vacation_setting_years_of_service', yearWorked)
        .if(employeeIsCrew, (query) => {
          query.where('vacation_setting_crew', 1)
        })
        .first()
      if (!vacationSetting) {
        vacationSetting = await VacationSetting.query()
          .whereNull('vacation_setting_deleted_at')
          .orderBy('vacation_setting_years_of_service', 'desc')
          .if(employeeIsCrew, (query) => {
            query.where('vacation_setting_crew', 1)
          })
          .first()
        if (!vacationSetting) {
          return {
            status: 404,
            type: 'warning',
            title: 'The vacation setting was not found',
            message: `The vacation setting was not found with the years worked ${yearWorked}`,
            data: {},
          }
        }
      }
      const vacationSettingVacationDays = vacationSetting.vacationSettingVacationDays
      return {
        status: 200,
        type: 'success',
        title: 'Info verifiy successfully',
        message: 'Info verifiy successfully',
        data: vacationSettingVacationDays,
      }
    } else {
      return {
        status: 400,
        type: 'warning',
        title: 'The vacation period was not found',
        message: 'The vacation period was not found ',
        data: {},
      }
    }
  }

  private getCurrentVacationPeriod(employee: Employee) {
    if (!employee.employeeHireDate) {
      return null
    }
    const currentDate = DateTime.now()
    const startDate = DateTime.fromISO(employee.employeeHireDate.toString())
    if (!startDate.isValid) {
      return null
    }
    const yearsWorked = currentDate.diff(startDate, 'years').years
    if (yearsWorked < 1) {
      return null
    }
    const vacationYear = Math.floor(yearsWorked)
    const vacationPeriodStart = startDate.plus({ years: vacationYear }).startOf('day')
    const vacationPeriodEnd = vacationPeriodStart.plus({ years: 1 }).minus({ days: 1 }).endOf('day')
    return {
      yearsWorked,
      startDate,
      vacationYear,
      vacationPeriodStart: vacationPeriodStart.toISODate(),
      vacationPeriodEnd: vacationPeriodEnd.toISODate(),
    }
  }

  async hasEmployeesPosition(positionId: number): Promise<boolean> {
    const employees = await Employee.query()
      .whereNull('employee_deleted_at')
      .where('position_id', positionId)
    return employees.length > 0
  }

  async getYearsWorked(employee: Employee, yearTemp: number) {
    if (yearTemp) {
      if (yearTemp > 3000) {
        return {
          status: 400,
          type: 'warning',
          title: 'The year is incorrect',
          message: 'the year must be less than 3000',
          data: { yearTemp: yearTemp },
        }
      }
    }
    if (employee.employeeHireDate) {
      const employeeType = await EmployeeType.query()
        .whereNull('employee_type_deleted_at')
        .where('employee_type_id', employee.employeeTypeId)
        .first()
      let employeeIsCrew = false
      if (employeeType) {
        if (
          employeeType.employeeTypeSlug === 'pilot' ||
          employeeType.employeeTypeSlug === 'flight-attendant'
        ) {
          employeeIsCrew = true
        }
      }
      const start = DateTime.fromISO(employee.employeeHireDate.toString())
      const startYear = yearTemp ? yearTemp : start.year
      const currentYear = yearTemp ? yearTemp : DateTime.now().year + 1
      let yearsPassed = startYear - start.year
      if (yearsPassed < 0) {
        return {
          status: 400,
          type: 'warning',
          title: 'The year is incorrect',
          message: 'The year is not valid ',
          data: { startYear: startYear },
        }
      }
      const month = start.month
      const day = start.day
      const yearsWroked = []
      for (let year = startYear; year <= currentYear; year++) {
        yearsPassed = year - start.year
        const formattedDate = DateTime.fromObject({
          year: year,
          month: month,
          day: day,
        }).toFormat('yyyy-MM-dd')
        const vacationSetting = await VacationSetting.query()
          .whereNull('vacation_setting_deleted_at')
          .where('vacation_setting_years_of_service', yearsPassed)
          .where('vacation_setting_apply_since', '<=', formattedDate ? formattedDate : '')
          .if(employeeIsCrew, (query) => {
            query.where('vacation_setting_crew', 1)
          })
          .first()
        let vacationsUsedList = [] as Array<ShiftException>
        if (vacationSetting) {
          vacationsUsedList = await ShiftException.query()
            .whereNull('shift_exceptions_deleted_at')
            .where('vacation_setting_id', vacationSetting.vacationSettingId)
            .where('employee_id', employee.employeeId)
            .orderBy('shift_exceptions_date', 'asc')
        }
        yearsWroked.push({ year, yearsPassed, vacationSetting, vacationsUsedList })
      }
      return {
        status: 200,
        type: 'success',
        title: 'Info get successfully',
        message: 'Info get successfully',
        data: yearsWroked,
      }
    } else {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee hire date was not found',
        message: 'The employee hire date was not found ',
        data: {},
      }
    }
  }

  async getYearWorked(employee: Employee, yearTemp: number) {
    if (yearTemp) {
      if (yearTemp > 3000) {
        return {
          status: 400,
          type: 'warning',
          title: 'The year is incorrect',
          message: 'the year must be less than 3000',
          data: { yearTemp: yearTemp },
        }
      }
    }
    if (employee.employeeHireDate) {
      const start = DateTime.fromISO(employee.employeeHireDate.toString())
      const startYear = yearTemp ? yearTemp : start.year
      const yearsPassed = startYear - start.year
      if (yearsPassed < 0) {
        return {
          status: 400,
          type: 'warning',
          title: 'The year is incorrect',
          message: 'The year is not valid ',
          data: { startYear: startYear },
        }
      }
      const month = start.month
      const day = start.day
      const yearsPassedToEnd = yearTemp - start.year
      const formattedDate = DateTime.fromObject({
        year: yearTemp,
        month: month,
        day: day,
      }).toFormat('yyyy-MM-dd')
      const employeeType = await EmployeeType.query()
        .whereNull('employee_type_deleted_at')
        .where('employee_type_id', employee.employeeTypeId)
        .first()
      let employeeIsCrew = false
      if (employeeType) {
        if (
          employeeType.employeeTypeSlug === 'pilot' ||
          employeeType.employeeTypeSlug === 'flight-attendant'
        ) {
          employeeIsCrew = true
        }
      }
      const vacationSetting = await VacationSetting.query()
        .whereNull('vacation_setting_deleted_at')
        .where('vacation_setting_years_of_service', yearsPassed)
        .where('vacation_setting_apply_since', '<=', formattedDate ? formattedDate : '')
        .if(employeeIsCrew, (query) => {
          query.where('vacation_setting_crew', 1)
        })
        .first()
      let vacationsUsedList = [] as Array<ShiftException>
      if (vacationSetting) {
        vacationsUsedList = await ShiftException.query()
          .whereNull('shift_exceptions_deleted_at')
          .where('vacation_setting_id', vacationSetting.vacationSettingId)
          .where('employee_id', employee.employeeId)
          .orderBy('shift_exceptions_date', 'asc')
      }
      return {
        status: 200,
        type: 'success',
        title: 'Info get successfully',
        message: 'Info get successfully',
        data: {
          year: yearTemp,
          yearsPassed: yearsPassedToEnd,
          vacationSetting: vacationSetting,
          vacationUsedList: vacationsUsedList,
        },
      }
    } else {
      return {
        status: 400,
        type: 'warning',
        title: 'The employee hire date was not found',
        message: 'The employee hire date was not found ',
        data: {},
      }
    }
  }

  getYearsBetweenDates(startDate: string, endDate: string) {
    const start = DateTime.fromISO(startDate)
    const end = DateTime.fromISO(endDate)
    const yearsDifference = end.diff(start, 'years').years
    return yearsDifference.toFixed(2)
  }

  async getVacationsByPeriod(employeeId: number, vacationSettingId: number) {
    const vacations = await ShiftException.query()
      .whereNull('shift_exceptions_deleted_at')
      .where('vacation_setting_id', vacationSettingId)
      .where('employee_id', employeeId)
      .orderBy('shift_exceptions_date', 'asc')

    return vacations ? vacations : []
  }

  async verifyExistPhoto(url: string) {
    try {
      const response = await axios.head(url)
      if (response.status === 200) {
        return true
      }
    } catch (error) {}
    return false
  }

  async getContracts(employeeId: number) {
    const employeeContracts = await EmployeeContract.query()
      .whereNull('employee_contract_deleted_at')
      .where('employee_id', employeeId)
      .orderBy('employee_id')
      .preload('employeeContractType')
      .preload('department')
      .preload('position')
      .preload('payrollBusinessUnit')
      .orderBy('employee_contract_start_date')

    return employeeContracts ? employeeContracts : []
  }

  async getBanks(employeeId: number) {
    const employeeBanks = await EmployeeBank.query()
      .whereNull('employee_bank_deleted_at')
      .where('employee_id', employeeId)
      .preload('bank')
      .orderBy('employee_id')
      .paginate(1, 9999999)

    return employeeBanks ? employeeBanks : []
  }
}
