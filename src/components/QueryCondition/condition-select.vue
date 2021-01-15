<template>
  <div>
    <label class="condition-label">{{ label }}</label>
    <el-select v-model="modelData" v-bind="$attrs" clearable size="small" v-on="$listeners">
      <el-option
        v-for="(value, key) in options"
        :key="key"
        :label="value"
        :value="value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'ConditionSelect',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    modelData: {
      get() {
        return this.$attrs.value
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

  .el-select {
    width: 100%;
  }
</style>
