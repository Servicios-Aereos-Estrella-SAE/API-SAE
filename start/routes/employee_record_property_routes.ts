import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/employee_record_property_controller.index')
    router.get(
      '/get-categories-by-employee',
      '#controllers/employee_record_property_controller.getCategories'
    )
  })
  .prefix('/api/employee-record-properties')
  .use(middleware.auth())
