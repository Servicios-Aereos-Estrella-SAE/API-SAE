import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/get-vacations-excel', '#controllers/employee_vacation_controller.getVacationExcel')
  })
  .prefix('/api/employees')
  .use(middleware.auth())
