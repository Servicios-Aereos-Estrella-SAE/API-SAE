import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/pilot_proceeding_file_controller.index')
    router.post('/', '#controllers/pilot_proceeding_file_controller.store')
    router.put('/:pilotProceedingFileId', '#controllers/pilot_proceeding_file_controller.update')
    router.delete('/:pilotProceedingFileId', '#controllers/pilot_proceeding_file_controller.delete')
    router.get('/:pilotProceedingFileId', '#controllers/pilot_proceeding_file_controller.show')
  })
  .prefix('/api/pilots-proceeding-files')
