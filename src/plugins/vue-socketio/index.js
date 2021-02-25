import VueSocketIO from 'vue-socket.io'
import sio from '@/plugins/socketio'

const vsio = new VueSocketIO({ debug: process.env.NODE_ENV === 'development', connection: sio })

export default vsio
