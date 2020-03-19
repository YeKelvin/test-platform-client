<template>
  <scrollbar class="app-main-container">
    <div class="script-editor-container">
      {{ itemNo }}
    </div>
  </scrollbar>
</template>

<script>
export default {
  name: 'ScriptEditor',

  data() {
    return {
      itemNo: ''
    }
  },

  mounted: function() {
    this.itemNo = this.$route.params.itemNo
  }
}
</script>

<style lang="scss" scoped>
  .script-editor-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
    padding: 20px;

    background-color: #008489;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }
</style>
