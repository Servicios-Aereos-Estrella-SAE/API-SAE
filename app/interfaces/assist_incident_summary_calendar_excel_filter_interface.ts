import Employee from '#models/employee'
import { AssistDayInterface } from './assist_day_interface.js'

interface AssistIncidentSummaryCalendarExcelFilterInterface {
  employee: Employee,
  employeeCalendar: AssistDayInterface[],
  tardies: number,
  toleranceCountPerAbsences: number,
}
export type { AssistIncidentSummaryCalendarExcelFilterInterface }
