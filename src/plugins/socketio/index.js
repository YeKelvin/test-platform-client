import SocketIO from 'socket.io-client'

const socketOptions = {
  autoConnect: false
}

const sio = SocketIO(process.env.VUE_APP_BASE_API, socketOptions)

export default sio

/*
添加Authorization请求头
socketOptions = {
  // transportOptions: {
  //   polling: {
  //     extraHeaders: {
  //       Authorization: 'token'
  //     }
  //   }
  // }
}
*/
