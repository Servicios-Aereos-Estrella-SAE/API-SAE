import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/get-excel', '#controllers/employee_vacation_controller.getExcel')
    router.get('/get-vacations-used-excel', '#controllers/employee_vacation_controller.getVacationsUsedExcel')
  })
  .prefix('/api/employees-vacations')
  .use(middleware.auth())
