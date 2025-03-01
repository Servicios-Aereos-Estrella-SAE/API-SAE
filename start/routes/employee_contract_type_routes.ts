import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/employee_contract_type_controller.index')
  })
  .prefix('/api/employee-contract-types')
  .use(middleware.auth())
