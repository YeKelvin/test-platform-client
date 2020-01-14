<template>
  <div>
    <label class="condition-label">{{ label }}</label>
    <el-input v-model="model" v-bind="$props" clearable v-on="$listeners" />
  </div>
</template>

<script>
import { Input } from 'element-ui'

export default {
  name: 'ConditionInput',
  props: {
    ...Input.props,
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
