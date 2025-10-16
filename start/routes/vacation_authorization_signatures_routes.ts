import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/', '#controllers/vacation_authorization_signatures_controller.store')
    router.get('/pending', '#controllers/vacation_authorization_signatures_controller.getPendingVacationRequests')
    router.get('/authorized', '#controllers/vacation_authorization_signatures_controller.getAuthorizedVacationRequests')
  })
  .prefix('/api/vacation-authorizations')
  .use(middleware.auth())


