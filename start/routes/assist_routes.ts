/* eslint-disable prettier/prettier */
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// import { middleware } from '../kernel.js'

router
  .group(() => {
    router.get('/get-excel-by-employee', '#controllers/assists_controller.getExcelByEmployee')
    router.get('/get-excel-by-position', '#controllers/assists_controller.getExcelByPosition')
    router.get('/get-excel-by-department', '#controllers/assists_controller.getExcelByDepartment')
    router.get('/', '#controllers/assists_controller.index')//.use(middleware.auth({ guards: ['api'] }))
    router.get('/status', '#controllers/assists_controller.getStatusSync')
    router.post('/synchronize', '#controllers/assists_controller.synchronize')
  })
  .use(middleware.auth())
  .prefix('/api/v1/assists')
