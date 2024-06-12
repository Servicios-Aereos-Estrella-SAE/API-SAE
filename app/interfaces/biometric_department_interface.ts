export default interface BiometricDepartmentInterface {
  id: number
  deptCode: string
  deptName: string
  isDefault: boolean
  companyId: number
  parentDeptId: number
}
