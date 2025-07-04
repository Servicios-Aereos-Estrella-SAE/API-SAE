import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/employee-generate-excel', '#controllers/employee_controller.getExcel')

    router.get('/get-days-work-disability-all', '#controllers/employee_controller.getDaysWorkDisabilityAll')
    router.get('/get-birthday', '#controllers/employee_controller.getBirthday')
    router.get('/get-vacations', '#controllers/employee_controller.getVacations')
    router.get('/get-all-vacations-by-period', '#controllers/employee_controller.getAllVacationsByPeriod')
    router.get('/get-work-schedules', '#controllers/employee_controller.getWorkSchedules')
    router.get('/without-user', '#controllers/employee_controller.indexWithOutUser')
    router.get('/', '#controllers/employee_controller.index')
    router.post('/', '#controllers/employee_controller.store')
    router.put('/:employeeId', '#controllers/employee_controller.update')
    router.delete('/:employeeId', '#controllers/employee_controller.delete')
    router.get('/get-by-code/:employeeCode', '#controllers/employee_controller.getByCode')
    router.get('/:employeeId', '#controllers/employee_controller.show')
    router.put('/:employeeId/photo', '#controllers/employee_controller.uploadPhoto')
    router.put('/:employeeId/reactivate', '#controllers/employee_controller.reactivate')
    router.get(
      '/:employeeId/proceeding-files',
      '#controllers/employee_controller.getProceedingFiles'
    )

    router.get('/:employeeId/contracts', '#controllers/employee_controller.getContracts')
    router.get('/:employeeId/banks', '#controllers/employee_controller.getBanks')
    router.get('/:employeeId/get-days-work-disability', '#controllers/employee_controller.getDaysWorkDisability')
    router.get('/:employeeId/user-responsible', '#controllers/employee_controller.getUserResponsible')
    router.get('/:employeeId/user-responsible/:userId?', '#controllers/employee_controller.getUserResponsible')
    router.get(
      '/:employeeId/get-vacations-used',
      '#controllers/employee_controller.getVacationsUsed'
    )
    router.get(
      '/:employeeId/get-vacations-corresponding',
      '#controllers/employee_controller.getVacationsCorresponding'
    )
    router.get('/:employeeId/get-years-worked', '#controllers/employee_controller.getYearsWorked')
    router.get(
      '/:employeeId/get-vacations-by-period',
      '#controllers/employee_controller.getVacationsByPeriod'
    )
    router.get(
      '/:employeeId/export-excel',
      '#controllers/employee_controller.exportShiftExceptionsToExcel'
    )
  })
  .prefix('/api/employees')
  .use(middleware.auth())

// Ruta pública para servir imágenes de forma segura (sin autenticación)
router.get('/api/proxy-image', '#controllers/employee_controller.proxyImage')

// router.get('/odoo/employees', '#controllers/employee_controller.getOdooEmployees')
// router.get('/odoo/employees/groups', '#controllers/employee_controller.getOdooGroups')
// router.get('/odoo/employees/create', '#controllers/employee_controller.createNewOdooEmployee')
