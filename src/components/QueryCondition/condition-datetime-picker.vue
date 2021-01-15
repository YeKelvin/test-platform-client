<template>
  <div>
    <label class="condition-label">{{ label }}</label>
    <el-date-picker v-model="modelData" type="datetime" size="small" v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  name: 'ConditionDatetimePicker',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    modelData: {
      get() {
        return this.$attrs.value
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
