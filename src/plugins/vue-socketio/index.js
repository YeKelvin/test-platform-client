import VueSocketIO from 'vue-socket.io'
import { sio as SocketIO } from '@/plugins/socketio'

export const vsio = new VueSocketIO({ debug: process.env.NODE_ENV === 'development', connection: SocketIO })

// 全局事件
export const sockets = {
  connect() {
    console.log(`socket sid:[ ${this.$socket.id} ] event:[ connect ]`)
  },
  connect_error: function(e) {
    console.log(`socket sid:[ ${this.$socket.id} ] event:[ connect_error ] error:[ ${e} ]`)
  },
  reconnect: function() {
    console.log(`socket sid:[ ${this.$socket.id} ] event:[ reconnect ]`)
  },
  disconnect: function() {
    console.log(`socket sid:[ ${this.$socket.id} ] event:[ disconnect ]`)
  }
}
