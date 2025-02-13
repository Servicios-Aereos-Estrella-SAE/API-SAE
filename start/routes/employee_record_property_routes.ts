import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/employee_record_property_controller.index')
  })
  .prefix('/api/employee-record-properties')
  .use(middleware.auth())
