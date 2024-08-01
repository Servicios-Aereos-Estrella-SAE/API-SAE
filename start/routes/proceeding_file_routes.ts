/* eslint-disable prettier/prettier */
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/proceeding_file_controller.index')
    router.post('/', '#controllers/proceeding_file_controller.store')
    router.put('/:proceedingFileId', '#controllers/proceeding_file_controller.update')
    router.delete('/:proceedingFileId', '#controllers/proceeding_file_controller.delete')
    router.get('/:proceedingFileId', '#controllers/proceeding_file_controller.show')
  })
  .use(middleware.auth())
  .prefix('/api/proceeding-files')
