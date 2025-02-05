import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/employee_address.index')
    router.post('/', '#controllers/employee_address.store')
    router.put('/:employeeAddressId', '#controllers/employee_address.update')
    router.delete('/:employeeAddressId', '#controllers/employee_address.delete')
    router.get('/:employeeAddressId', '#controllers/employee_address.show')
  })
  .prefix('/api/employees-address')
  .use(middleware.auth())
