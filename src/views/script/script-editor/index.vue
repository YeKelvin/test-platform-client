<template>
  <div class="scrollbar script-body-container">
    <div class="script-editor-container">
      <manager ref="manager" @add-tab="addTab(arguments)" />
      <main-editor
        ref="editor"
        @re-query-collection="queryCollections"
        @re-query-group="queryGroups"
      />
    </div>
    <toolbar class="script-toolbar-container" />
  </div>
</template>

<script>
import Manager from './components/manager/index'
import MainEditor from './components/mian-editor/index'
import Toolbar from './components/toolbar/index'

export default {
  name: 'ScriptEditor',
  components: { Manager, MainEditor, Toolbar },
  provide() {
    return {
      editorInfo: this.editorInfo
    }
  },
  data() {
    return {
      editorInfo: {
        workspaceNo: '',
        collectionNo: '',
        elementNo: '',
        elementName: '',
        elementType: '',
        elementClass: ''
      }
    }
  },
  mounted: function() {},
  methods: {
    addTab(args) {
      this.$refs.editor.addTab(...args)
    },
    queryCollections() {
      this.$refs.manager.queryCollections()
    },
    queryGroups() {
      this.$refs.manager.queryGroups()
    }
  }
}
</script>

<style lang="scss" scoped>
.script-body-container{
  display: flex;
  flex: 1;
  flex-direction: column;
  padding:0;
}

.script-editor-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-self: flex-start;

  height: 100%;
  width: 100%;

  padding-top: 10px;
  padding-bottom: 5px;
}

.script-toolbar-container{
  align-self: flex-end;
}

</style>
