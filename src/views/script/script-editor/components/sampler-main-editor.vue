<template>
  <div class="sampler-main-editor-container">
    取样器
    <el-divider />
    <el-form
      ref="elementForm"
      label-position="right"
      label-width="auto"
      style="width: 100%"
      size="mini"
      :model="elementForm"
      :rules="elementFormRules"
    >
      <el-form-item label="名称：" prop="elementName">
        <el-input v-model="elementForm.elementName" placeholder="元素名称" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="注释：" prop="elementComments">
        <el-input v-model="elementForm.elementComments" placeholder="元素注释" clearable :readonly="isReadOnly" />
      </el-form-item>

      <el-tabs v-model="samplerChildTabActiveName">
        <el-tab-pane label="请求主体" name="request" />
        <el-tab-pane label="前置处理器" name="pre" />
        <el-tab-pane label="后置处理器" name="post" />
        <el-tab-pane label="断言" name="assertion" />
      </el-tabs>

      <el-form-item v-if="isQuery">
        <el-button type="primary" @click="editNow(true)">编辑</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
      <el-form-item v-else-if="isModify">
        <el-button type="primary" @click="modifySamplerElement('elementForm')">保存</el-button>
        <el-button @click="resetModifyForm('elementForm')">重置</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
      <el-form-item v-else-if="isCreate">
        <el-button type="primary" @click="createSamplerElement('elementForm')">保存</el-button>
        <el-button @click="resetCreateForm('elementForm')">重置</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
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
      elementInfo: {},
      elementForm: {
        elementName: '',
        elementComments: '',
        elementType: 'SAMPLER',
        propertys: {}
      },
      elementFormRules: {
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }]
      },
      samplerChildTabActiveName: 'request'
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
  .sampler-main-editor-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
    padding: 20px;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }
</style>
