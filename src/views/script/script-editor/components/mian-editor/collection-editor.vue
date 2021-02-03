<template>
  <div class="collection-editor-container">
    测试集合
    <el-divider />
    <el-form
      ref="elementForm"
      label-position="right"
      label-width="auto"
      style="width: 100%"
      :model="elementForm"
      :rules="elementFormRules"
    >
      <el-form-item label="名称：" prop="elementName">
        <el-input v-model="elementForm.elementName" placeholder="元素名称" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="注释：" prop="elementComments">
        <el-input v-model="elementForm.elementComments" placeholder="元素注释" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="顺序执行：" prop="propertys.serialized">
        <el-switch v-model="elementForm.propertys.serialized" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="延迟ms：" prop="propertys.delay">
        <el-input v-model="elementForm.propertys.delay" placeholder="还没有实现" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item v-if="isQuery">
        <el-button type="primary" @click="editNow(true)">编辑</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
      <el-form-item v-else-if="isModify">
        <el-button type="primary" @click="modifyCollectionElement('elementForm')">保存</el-button>
        <el-button @click="resetModifyForm('elementForm')">重置</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
      <el-form-item v-else-if="isCreate">
        <el-button type="primary" @click="createCollectionElement('elementForm')">保存</el-button>
        <el-button @click="resetCreateForm('elementForm')">重置</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import elPropertyUtil from '@/utils/element-property'
import * as Element from '@/api/script/element'
export default {
  name: 'CollectionEditor',
  inject: ['editorInfo'],
  props: {
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
        elementType: 'COLLECTION',
        elementClass: 'TestCollection',
        propertys: {
          serialized: true,
          delay: ''
        }
      },
      elementFormRules: {
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }]
      }
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
    modifyCollectionElement(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Element.modifyElement({ elementNo: this.elementNo, ...this.elementForm }).then(response => {
            if (response['success']) {
              this.$message({ message: '修改测试元素成功', type: 'info', duration: 2 * 1000 })
              // 修改 tab标题
              this.$emit('rename-tab', this.elementForm.elementName)
              // 重新查询测试集合列表
              this.$emit('re-query-collection')
              // 表单设置为只读
              this.editNow(false)
            }
          }).catch(() => {})
        } else {
          this.$message({ message: '数据校验不通过', type: 'error', duration: 2 * 1000 })
          return false
        }
      })
    },
    resetModifyForm() {
      this.elementForm = { ...this.elementInfo }
    },
    /**
     * TODO: workspaceNo非空判断，为空时弹出workspace选择列表
     */
    createCollectionElement(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const elementInfo = { ...this.elementForm }
          elPropertyUtil.renameKeyToRequest(elementInfo)
          Element.createElement({ workspaceNo: this.editorInfo.workspaceNo, ...this.elementInfo }).then(response => {
            if (response['success']) {
              this.$message({ message: '新增测试元素成功', type: 'info', duration: 2 * 1000 })
              // 关闭tab
              this.$emit('close-tab')
              // 重新查询测试集合列表
              this.$emit('re-query-collection')
            }
          }).catch(() => {})
        } else {
          this.$message({ message: '数据校验不通过', type: 'error', duration: 2 * 1000 })
          return false
        }
      })
    },
    resetCreateForm(formName) {
      this.$refs[formName].resetFields()
    },
    closeTab() {
      this.$emit('close-tab')
    }
  }
}
</script>

<style lang="scss" scoped>
  .collection-editor-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    padding: 20px;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }
</style>
