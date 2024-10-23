import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_file_type_email_controller.index')
    router.post('/', '#controllers/proceeding_file_type_email_controller.store')
    router.put(
      '/:proceedingFileTypeEmailId',
      '#controllers/proceeding_file_type_email_controller.update'
    )
    router.delete(
      '/:proceedingFileTypeEmailId',
      '#controllers/proceeding_file_type_email_controller.delete'
    )
    router.get(
      '/:proceedingFileTypeEmailId',
      '#controllers/proceeding_file_type_email_controller.show'
    )
  })
  .use(middleware.auth())
  .prefix('/api/proceeding-file-type-emails')
