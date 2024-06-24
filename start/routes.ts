/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import './routes/login_routes.js'
import './routes/synchronization_routes.js'
import './routes/department_routes.js'
import './routes/employee_routes.js'

const ShiftController = () => import('#controllers/shifts_controller')

router.post('shift', [ShiftController, 'store'])

router.get('/', async ({ view }) => {
  const specUrl = '/swagger.json'
  return view.render('swagger', { specUrl })
})

router.post('/api/v1/assists/synchronize', '#controllers/assists_controller.synchronize')
