import Holiday from '#models/holiday'

export default class HolidayService {
  async index(firstDate: string, lastDate: string, search: string, page: number, limit: number) {
    try {
      const holidays = Holiday.query()

      if (search) {
        holidays.where('holidayName', 'like', `%${search}%`)
      }

      if (firstDate) {
        holidays.where('holidayDate', '>=', firstDate)
      }

      if (lastDate) {
        holidays.where('holidayDate', '<=', lastDate)
      }

      const responseHolidays = await holidays.orderBy('holidayDate', 'asc').paginate(page, limit)

      return {
        status: 200,
        type: 'success',
        title: 'Successfully action',
        message: 'Resources fetched',
        holidays: responseHolidays as Holiday[],
      }
    } catch (error) {
      return {
        status: 500,
        type: 'error',
        title: 'Server error',
        message: 'An unexpected error occurred',
        data: error,
      }
    }
  }
}
