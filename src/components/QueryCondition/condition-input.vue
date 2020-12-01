<template>
  <div>
    <label class="condition-label">{{ label }}</label>
    <el-input v-model="model" v-bind="$attrs" clearable size="small" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  name: 'ConditionInput',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .condition-label{
    margin-right: 6px;
    width: fit-content;
    white-space: nowrap;
  }
</style>
