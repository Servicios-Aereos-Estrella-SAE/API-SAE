import ExcelJS from 'exceljs'
interface AssistExcelImageInterface {
  workbook: ExcelJS.Workbook
  worksheet: ExcelJS.Worksheet
  col: number
  row: number
}
export type { AssistExcelImageInterface }
