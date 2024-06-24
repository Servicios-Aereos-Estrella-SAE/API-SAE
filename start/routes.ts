/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const ShiftController = () => import('#controllers/shifts_controller')

import router from '@adonisjs/core/services/router'
router.get('/', async ({ view }) => {
  const specUrl = '/swagger.json'
  return view.render('swagger', { specUrl })
})

/**
 * Sistema General
 */
import './routes/login_routes.js'
import './routes/synchronization_routes.js'
import './routes/department_routes.js'
import './routes/shift_routes.js'
