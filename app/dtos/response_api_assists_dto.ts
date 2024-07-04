import PaginationDto from '#dtos/pagination_api_dto'
import DataAssistsDto from './data_assists_dto.js'
export default interface ResponseApiAssistsDto {
  pagination: PaginationDto
  data: Array<DataAssistsDto>
}
