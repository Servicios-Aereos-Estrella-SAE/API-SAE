import BusinessUnit from '#models/business_unit'
import { BusinessUnitInterface } from '../interfaces/business_unit_interface.js'
import { ResponseDataInterface } from '../interfaces/response_data_interface.js'

export default class BusinessUnitService {
  /**
   * Fetches and lists business units into the system
   *
   * @returns {Promise<ResponseDataInterface>} - Array of business units.
   *
   * @throws {Error} - Throws an error if there is an issue with the query execution.
   */
  async index(): Promise<ResponseDataInterface> {
    try {
      const businessUnitsQuery = await BusinessUnit.query().where('business_unit_active', 1)

      const businessUnitsRes: BusinessUnitInterface[] = [
        ...businessUnitsQuery,
      ] as unknown as BusinessUnitInterface[]

      return {
        status: 200,
        type: 'success',
        title: 'business units list',
        message: 'fetched success',
        data: {
          data: businessUnitsRes,
        },
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
