<template>
  <div class="toolbar-container">
    <el-badge :is-dot="hasUnreadReport">
      <el-button size="small" @click="showReportDrawer = !showReportDrawer">报告</el-button>
    </el-badge>
    <el-badge :is-dot="hasUnreadLog">
      <el-button size="small" @click="showLogDrawer = !showLogDrawer">输出</el-button>
    </el-badge>
    <el-button size="small" @click="socketConnect">调试socket</el-button>

    <el-drawer direction="btt" size="50%" :visible.sync="showReportDrawer">
      <span slot="title">ReportDrawer</span>
    </el-drawer>

    <el-drawer direction="btt" size="50%" :visible.sync="showLogDrawer">
      <span slot="title">LogDrawer</span>
      <div>{{ logContent }}</div>
    </el-drawer>
  </div>

</template>

<script>

export default {
  name: 'Toolbar',

  inject: ['editorInfo'],

  data() {
    return {
      hasUnreadReport: false,
      hasUnreadLog: false,
      showReportDrawer: false,
      showLogDrawer: false,
      logContent: ''
    }
  },

  methods: {
    socketConnect() {
      if (this.$socket.disconnected) {
        this.$socket.open()
      }
      this.$socket.emit('test', 'i am vue')
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
      this.logContent += 'socket connected'
    },
    message: function(msg) {
      console.log(`receive ${msg}`)
      this.logContent += msg
    }
    /*
$connect: [ƒ]
$connect_error: [ƒ]
$connect_timeout: [ƒ]
$connecting: [ƒ]
$disconnect: [ƒ]
$error: [ƒ]
$ping: [ƒ]
$pong: [ƒ]
$reconnect: [ƒ]
$reconnect_attempt: [ƒ]
$reconnect_error: [ƒ]
$reconnect_failed: [ƒ]
$reconnecting: [ƒ]
    */
  }
}
</script>

<style lang="scss" scoped>
.toolbar-container{
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;

  padding: 5px;
  width: 100%;
  min-height: 30px;

  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

</style>
