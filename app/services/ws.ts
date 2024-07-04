import { Server } from 'socket.io'
import AdonisServer from '@adonisjs/core/services/server'

class Ws {
  io: Server | undefined
  private booted = false
  boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }
    this.booted = true
    this.io = new Server(AdonisServer.getNodeServer()!, {
      cors: {
        origin: '*',
      },
    })
  }
}

export default new Ws()
