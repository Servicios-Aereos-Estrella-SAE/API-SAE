import { BankFilterSearchInterface } from '../interfaces/bank_filter_search_interface.js'
import Bank from '#models/bank'

export default class BankService {
  async index(filters: BankFilterSearchInterface) {
    const banks = await Bank.query()
      .whereNull('bank_deleted_at')
      .if(filters.search, (query) => {
        query.andWhere((searchQuery) => {
          searchQuery.whereRaw('UPPER(bank_name) LIKE ?', [`%${filters.search.toUpperCase()}%`])
        })
      })
      .orderBy('bank_id')
      .paginate(filters.page, filters.limit)
    return banks
  }
}
