<template>
  <div class="script-toolbar-container">
    <span>这里是工具栏</span>
  </div>
</template>

<script>

export default {
  name: 'Toolbar',

  inject: ['editorInfo'],

  data() {
    return {}
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.script-toolbar-container{
  display: inline-flex;
  justify-content: start;
  align-items: center;

  padding:5px;
  width: 100%;
  min-height: 30px;

  // background: rgb(230, 20, 20);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

</style>
