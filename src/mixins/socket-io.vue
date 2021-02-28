<template>
  <div />
</template>

<script>
export default {
  name: 'SocketIOMixin',

  methods: {
    // TODO: 做成mixins
    setAuthorization() {
      this.$socket.io.opts['transportOptions'] = {
        polling: {
          extraHeaders: {
            Authorization: `JWT ${this.$store.state.user.token}`
          }
        }
      }
    },
    socketConnect() {
      this.setAuthorization()
      if (this.$socket.disconnected) {
        this.$socket.open()
      }
    },
    socketDisconnect() {
      if (this.$socket.connected) {
        this.$socket.close()
      }
    }
  }
}
</script>

<style>

</style>
