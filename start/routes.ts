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
import './routes/shift_routes.js'
import './routes/employee_shifts_routes.js'
import './routes/shift_exceptions_routes.js'
import './routes/holiday_routes.js'
import './routes/shift_for_employees.js'
import './routes/department_position_routes.js'
import './routes/role_routes.js'
import './routes/exception_type_routes.js'
import './routes/vacations_routes.js'
import './routes/aircraft_class_routes.js'
import './routes/proceeding_file_routes.js'
import './routes/employee_proceeding_file_routes.js'
import './routes/proceeding_file_type_routes.js'
import './routes/aircraft_property_routes.js'
import './routes/pilot_routes.js'
import './routes/pilot_proceeding_file_routes.js'
import './routes/flight_attendant_routes.js'
import './routes/flight_attendant_proceeding_file_routes.js'

router.get('/', async ({ view }) => {
  const specUrl = '/swagger.json'
  return view.render('swagger', { specUrl })
})
