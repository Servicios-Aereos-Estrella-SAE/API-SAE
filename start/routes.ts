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
import './routes/position_routes.js'
import './routes/employee_routes.js'
import './routes/person_routes.js'
import './routes/user_routes.js'
import './routes/assist_routes.js'

const ShiftController = () => import('#controllers/shifts_controller')

router.post('shift', [ShiftController, 'store'])

router.get('/', async ({ view }) => {
  const specUrl = '/swagger.json'
  return view.render('swagger', { specUrl })
})
