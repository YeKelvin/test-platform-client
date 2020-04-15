<template>
  <div class="http-sampler-editor-container">
    HTTP取样器
    <el-divider />
    <el-form
      ref="elementForm"
      label-position="right"
      label-width="auto"
      style="width: 100%"
      size="small"
      :model="elementForm"
      :rules="elementFormRules"
    >
      <el-form-item label="名称：" prop="elementName">
        <el-input v-model="elementForm.elementName" placeholder="元素名称" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="注释：" prop="elementComments">
        <el-input v-model="elementForm.elementComments" placeholder="元素注释" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="方法：" prop="propertys.HTTPSampler__method">
        <el-select v-model="elementForm.propertys.HTTPSampler__method" :disabled="isReadOnly">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
          <el-option label="PATCH" value="PATCH" />
          <el-option label="HEAD" value="HEAD" />
          <el-option label="CONNECT" value="CONNECT" />
          <el-option label="OPTIONS" value="OPTIONS" />
          <el-option label="TRACE" value="TRACE" />
        </el-select>
      </el-form-item>
      <el-form-item label="URL：" prop="propertys.HTTPSampler__url">
        <el-input v-model="elementForm.propertys.HTTPSampler__url" placeholder="请求地址" clearable :readonly="isReadOnly" />
      </el-form-item>

      <el-tabs v-model="httpEditTabActiveName" class="http-edit-tabs">
        <el-tab-pane label="Headers" name="Headers">
          <el-form
            ref="elementForm"
            label-position="right"
            label-width="auto"
            style="width: 100%"
            size="small"
            :model="elementForm"
            :rules="elementFormRules"
          >
            <div class="http-header-item">
              <span>Key</span><span> : </span><span>Value</span>
              <el-form-item
                v-for="header in httpHeaders"
                :key="header.name"
                label="Key:"
                :prop="header.name"
              >
                <el-input v-model="header.name" />
              </el-form-item>
              <el-form-item
                v-for="header in httpHeaders"
                :key="header.name"
                label="Value:"
                :prop="header.value"
              >
                <el-input v-model="header.value" />
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Params" name="Params" />
        <el-tab-pane label="Body" name="Body">
          <div class="http-body">
            <el-form-item prop="propertys.HTTPSampler__data">
              <el-input
                v-model="elementForm.propertys.HTTPSampler__data"
                type="textarea"
                size="medium"
                :rows="10"
                placeholder="请求主体"
              />
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Files" name="Files" />
        <el-tab-pane label="Configuration" name="Configuration">
          <el-form
            ref="elementForm"
            label-position="right"
            label-width="auto"
            size="small"
            :model="elementForm"
            :rules="elementFormRules"
          >
            <el-form-item label="Follow Redirects：" prop="propertys.HTTPSampler__follow_redirects">
              <el-switch v-model="elementForm.propertys.HTTPSampler__follow_redirects" :readonly="isReadOnly" />
            </el-form-item>
            <el-form-item label="Auto Redirects：" prop="propertys.HTTPSampler__auto_redirects">
              <el-switch v-model="elementForm.propertys.HTTPSampler__auto_redirects" :readonly="isReadOnly" />
            </el-form-item>
            <el-form-item label="Keep Alive：" prop="propertys.HTTPSampler__keep_alive">
              <el-switch v-model="elementForm.propertys.HTTPSampler__keep_alive" :readonly="isReadOnly" />
            </el-form-item>
            <el-form-item label="Connect Timeout：" prop="propertys.HTTPSampler__connect_timeout">
              <el-input v-model="elementForm.propertys.HTTPSampler__connect_timeout" placeholder="连接超时时间" clearable :readonly="isReadOnly" />
            </el-form-item>
            <el-form-item label="Response Timeout：" prop="propertys.HTTPSampler__response_timeout">
              <el-input v-model="elementForm.propertys.HTTPSampler__response_timeout" placeholder="响应超时时间" clearable :readonly="isReadOnly" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-form-item v-if="isQuery">
        <el-button type="primary" @click="editNow(true)">编辑</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
      <el-form-item v-else-if="isModify">
        <el-button type="primary" @click="modifyGroupElement('elementForm')">保存</el-button>
        <el-button @click="resetModifyForm('elementForm')">重置</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
      <el-form-item v-else-if="isCreate">
        <el-button type="primary" @click="createGroupElement('elementForm')">保存</el-button>
        <el-button @click="resetCreateForm('elementForm')">重置</el-button>
        <el-button @click="closeTab">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as Element from '@/api/script/element'

export default {
  name: 'HTTPSamplerEditor',

  props: {
    collectionNo: {
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
      httpEditTabActiveName: 'Body',
      isReadOnly: false,
      innerAction: this.action,
      elementInfo: {},
      elementForm: {
        elementName: '',
        elementComments: '',
        elementType: 'GROUP',
        propertys: {
          HTTPSampler__url: '',
          HTTPSampler__method: 'GET',
          HTTPSampler__params: '',
          HTTPSampler__data: '',
          HTTPSampler__files: '',
          HTTPSampler__follow_redirects: false,
          HTTPSampler__auto_redirects: false,
          HTTPSampler__keep_alive: false,
          HTTPSampler__connect_timeout: '',
          HTTPSampler__response_timeout: ''
        }
      },
      elementFormRules: {
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }]
      },
      httpHeaders: [{
        name: '',
        value: ''
      }]
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
    modifySamplerElement(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Element.modifyElement({ elementNo: this.elementNo, ...this.elementForm }).then(response => {
            if (response['success']) {
              this.$message({ message: '修改测试元素成功', type: 'info', duration: 2 * 1000 })
              // 修改 tab标题
              this.$emit('rename-tab', this.elementForm.elementName)
              // 重新查询测试集合列表
              this.$emit('re-query-group')
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
    createSamplerElement(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Element.addElementChild(
            { parentNo: this.collectionNo, childList: [this.elementForm] }
          ).then(response => {
            if (response['success']) {
              this.$message({ message: '新增测试元素成功', type: 'info', duration: 2 * 1000 })
              // 关闭tab
              this.$emit('close-tab')
              // 重新查询测试集合列表
              this.$emit('re-query-group')
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
  .http-sampler-editor-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    padding: 20px;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }

  .http-edit-tabs{
    margin-left: 10px;
    margin-bottom: 22px;
  }

  .http-header-item {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-content: center;

    .el-form-item{
      width: 100%;
    }

    /deep/.el-form-item__content{
      display: flex;
    }
  }

  .http-body{

    /deep/.el-form-item__content{
      margin-left: 0 !important;
    }
  }
</style>
