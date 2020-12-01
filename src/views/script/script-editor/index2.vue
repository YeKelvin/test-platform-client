<template>
  <div class="scrollbar script-editor-container">
    <manager />
    <main-editor />
  </div>
</template>

<script>
import Manager from './components/manager'
import MainEditor from './components/mian-editor'

export default {
  name: 'ScriptEditor2',
  components: { Manager, MainEditor },
  provide() {
    return {
      editorInfo: this.editorInfo
    }
  },
  data() {
    return {
      editorInfo: {
        elementNo: '',
        elementType: ''
      }
    }
  },
  mounted: function() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.script-editor-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;

  .el-tabs {
    height: 100%;
  }
}

</style>
