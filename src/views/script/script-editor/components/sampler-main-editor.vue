<template>
  <div>取样器</div>
</template>

<script>
import * as Element from '@/api/script/element'
export default {
  name: 'SamplerMainEditor',

  props: {
    itemNo: {
      type: String,
      default: ''
    },
    elementNo: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: 'QUERY'
    }
  },

  data() {
    return {
      isReadOnly: false,
      innerAction: this.action,
      elementInfo: {}
    }
  },

  computed: {
    isQuery() {
      return this.isReadOnly
    },
    isModify() {
      return !this.isReadOnly && this.innerAction === 'MODIFY'
    },
    isCreate() {
      return !this.isReadOnly && this.innerAction === 'CREATE'
    }
  },

  mounted: function() {
    if (this.action === 'QUERY') {
      Element.queryElementInfo({ elementNo: this.elementNo }).then(response => {
        this.elementInfo = response['result']
        this.elementForm = { ...this.elementInfo }
      }).catch(() => {})

      this.isReadOnly = true
    }
  },

  methods: {
    editNow(isEditNow) {
      if (isEditNow) {
        this.isReadOnly = false
        this.innerAction = 'MODIFY'
      } else {
        this.isReadOnly = true
        this.innerAction = 'QUERY'
      }
    },
    closeTab() {
      this.$emit('close-tab')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
