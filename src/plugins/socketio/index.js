import SocketIO from 'socket.io-client'

const options = {
  autoConnect: false
}

export const sio = SocketIO(process.env.VUE_APP_BASE_API, options)

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

/*
$connect: [ƒ]
$connect_error: [ƒ]
$connect_timeout: [ƒ]
$connecting: [ƒ]
$disconnect: [ƒ]
$error: [ƒ]
$reconnect: [ƒ]
$reconnect_attempt: [ƒ]
$reconnect_error: [ƒ]
$reconnect_failed: [ƒ]
$reconnecting: [ƒ]
*/
