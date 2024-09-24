import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/by-area/:areaToUse', '#controllers/proceeding_file_type_controller.indexByArea')
    router.get('/', '#controllers/proceeding_file_type_controller.index')
    router.post('/', '#controllers/proceeding_file_type_controller.store')
    router.put('/:proceedingFileTypeId', '#controllers/proceeding_file_type_controller.update')
    router.delete('/:proceedingFileTypeId', '#controllers/proceeding_file_type_controller.delete')
    router.get('/:proceedingFileTypeId', '#controllers/proceeding_file_type_controller.show')
  })
  .prefix('/api/proceeding-file-types')
