import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/shift-exception', '#controllers/shift_exceptions_controller.store')
    router.get('/shift-exception', '#controllers/shift_exceptions_controller.index')
    router.get('/shift-exception/:id', '#controllers/shift_exceptions_controller.show')
    router.put('/shift-exception/:id', '#controllers/shift_exceptions_controller.update')
    router.delete('/shift-exception/:id', '#controllers/shift_exceptions_controller.destroy')
    router.get(
      '/shift-exception-employee/:employeeId',
      '#controllers/shift_exceptions_controller.getByEmployee'
    )
  })
  .prefix('/api')
  .use(middleware.auth())
