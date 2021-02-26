<template>
  <div class="toolbar-container">
    <el-badge :is-dot="hasUnreadReport">
      <el-button size="small" @click="showReportDrawer = !showReportDrawer">报告</el-button>
    </el-badge>
    <!-- <el-badge :is-dot="hasUnreadLog">
      <el-button size="small" @click="showLogDrawer = !showLogDrawer">输出</el-button>
    </el-badge> -->
    <el-button size="small" @click="socketConnect">调试socket</el-button>

    <el-drawer direction="btt" size="50%" :visible.sync="showReportDrawer">
      <span slot="title">ReportDrawer</span>
    </el-drawer>

    <!-- <el-drawer direction="btt" size="50%" :visible.sync="showLogDrawer">
      <span slot="title">LogDrawer</span>
      <div>{{ logContent }}</div>
    </el-drawer> -->
  </div>

</template>

<script>

export default {
  name: 'Toolbar',

  inject: ['editorInfo'],

  data() {
    return {
      hasUnreadReport: false,
      showReportDrawer: false,
      reportContent: ''
      // hasUnreadLog: false,
      // showLogDrawer: false,
      // logContent: '',
    }
  },

  beforeDestroy() {
    this.sockets.unsubscribe('execution_result')
    this.sockets.unsubscribe('execution_log')
  },

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
      this.$socket.emit('test', 'i am vue')
    }
  },

  sockets: {
    execution_result: function(msg) {
      console.log(`event:[ execution_result ] received message:[ ${msg} ]`)
      this.reportContent += msg
    },
    execution_log: function(msg) {
      console.log(`event:[ execution_log ] received message:[ ${msg} ]`)
    }
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
