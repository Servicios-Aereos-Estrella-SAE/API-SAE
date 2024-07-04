import Ws from '#services/ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
if (Ws.io) {
  Ws.io.on('connection', (socket) => {
    socket.on('join-room', (_data) => {
      socket.join(`room-${_data.room}`)
    })
  })
}
