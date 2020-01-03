<template>
  <el-scrollbar wrap-style="overflow: auto !important;" view-style="height: 100%;">
    <slot />
  </el-scrollbar>
</template>

<script>
export default {
  name: 'Scrollbar'
}
</script>
