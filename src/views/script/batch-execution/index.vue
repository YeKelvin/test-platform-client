<template>
  <div class="father">
    <p class="child">要撑开</p>
  </div>
</template>

<script>
export default {
  name: 'BatchExecution',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.father {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.child {
  flex: 1;
  background-color: #1f2d3d;
  height: 100%;
}
</style>
