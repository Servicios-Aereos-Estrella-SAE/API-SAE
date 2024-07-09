import { inject } from '@adonisjs/core'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import SyncAssistsService from '#services/sync_assists_service'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import logger from '@adonisjs/core/services/logger'

export default class SyncAssistance extends BaseCommand {
  static commandName = 'sync:assistance'
  static description = 'command to sync assistance data'

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(syncAssistsService: SyncAssistsService) {
    try {
      if (env.get('NODE_ENV') !== 'production') {
        logger.info('Skipping synchronization as the environment is not production.')
        // await this.sentMailStatus('Skipping synchronization as the environment is not production.')
        return
      }
      // logger.info('Starting assistance synchronization...')
      let lasPage = await syncAssistsService.getLastPage()
      let assistStatusSync = await syncAssistsService.getAssistStatusSync()
      await syncAssistsService.synchronize(
        assistStatusSync?.dateRequestSync?.toJSDate()?.toISOString() ?? '2024-05-05',
        lasPage?.pageNumber
      )
      let lastPageAfterSync = await syncAssistsService.getLastPage()
      if (lastPageAfterSync?.pageNumber !== lasPage?.pageNumber) {
        await syncAssistsService.synchronize(
          assistStatusSync?.dateRequestSync?.toJSDate()?.toISOString() ?? '2024-05-05',
          lastPageAfterSync?.pageNumber
        )
      }
      // this.sentMailStatus('Assistance synchronization completed successfully.')
      logger.info('Assistance synchronization completed successfully.')
    } catch (error) {
      this.sentMailStatus('Error during assistance synchronization: ' + error.message)
      logger.info('Error during assistance synchronization:', error)
    }
  }

  async sentMailStatus(messageText: string = '') {
    try {
      await mail.send((message) => {
        message
          .to('wramirez@siler-mx.com')
          .from('wilvardo@gmail.com')
          .subject('Synchronization')
          .text(messageText)
      })
    } catch (emailError) {
      logger.info('Error sending synchronization email:', emailError)
    }
  }
}
