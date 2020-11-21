<template>
  <div>
    <label class="condition-label">{{ label }}</label>
    <el-date-picker v-model="model" type="datetime" v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
// todo 有bug，无法触发 change事件
import { DatePicker } from 'element-ui'

export default {
  name: 'ConditionDatetimePicker',
  props: {
    ...DatePicker.props,
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
      set(val) {
        this.$emit('input', val)
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
