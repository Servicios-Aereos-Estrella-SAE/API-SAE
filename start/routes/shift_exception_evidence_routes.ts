/* eslint-disable prettier/prettier */
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/', '#controllers/shift_exception_evidence_controller.index')
    router.post('/', '#controllers/shift_exception_evidence_controller.store')
    router.put('/:shiftExceptionEvidenceId', '#controllers/shift_exception_evidence_controller.update')
    router.delete('/:shiftExceptionEvidenceId', '#controllers/shift_exception_evidence_controller.delete')
    router.get('/:shiftExceptionEvidenceId', '#controllers/shift_exception_evidence_controller.show')
  })
  .use(middleware.auth())
  .prefix('/api/shift-exception-evidences')
