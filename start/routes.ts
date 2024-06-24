/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

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

router.post('/api/v1/assists/synchronize', '#controllers/assists_controller.synchronize')
