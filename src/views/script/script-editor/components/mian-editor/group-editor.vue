<template>
  <div class="group-editor-container">
    测试案例
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
      <el-form-item label="失败时的处理动作：" prop="propertys.CoroutineGroup__on_sample_error">
        <el-select v-model="elementForm.propertys.CoroutineGroup__on_sample_error" :disabled="isReadOnly">
          <el-option label="继续" value="continue" />
          <el-option label="开始下一个协程控制器的循环" value="start_next_coroutine_loop" />
          <el-option label="开始下一个当前控制器的循环" value="start_next_current_loop" />
          <el-option label="中断当前控制器的循环" value="break_current_loop" />
          <el-option label="停止协程" value="stop_coroutine_group" />
          <el-option label="停止测试执行" value="stop_test" />
          <el-option label="立即停止测试执行" value="stop_test_now" />
        </el-select>
      </el-form-item>
      <el-form-item label="协程数：" prop="propertys.CoroutineGroup__number_coroutines">
        <el-input v-model="elementForm.propertys.CoroutineGroup__number_coroutines" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="每秒启动的协程数：" prop="propertys.CoroutineGroup__startups_per_second">
        <el-input v-model="elementForm.propertys.CoroutineGroup__startups_per_second" placeholder="还没有实现" clearable :readonly="isReadOnly" />
      </el-form-item>
      <el-form-item label="循环次数：" prop="propertys.LoopController__loops">
        <el-input v-model="elementForm.propertys.LoopController__loops" clearable :readonly="isReadOnly" />
      </el-form-item>
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
  name: 'GroupEditor',
  inject: ['editorInfo'],
  props: {
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
        elementType: 'GROUP',
        propertys: {
          CoroutineGroup__on_sample_error: 'start_next_coroutine_loop',
          CoroutineGroup__number_coroutines: '1',
          CoroutineGroup__startups_per_second: '',
          LoopController__loops: '1',
          LoopController__continue_forever: false
        }
      },
      elementFormRules: {
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }],
        'propertys.CoroutineGroup__on_sample_error': [{ required: true, message: '失败时的处理动作不能为空', trigger: 'blur' }],
        'propertys.CoroutineGroup__number_coroutines': [{ required: true, message: '协程数不能为空', trigger: 'blur' }],
        'propertys.LoopController__loops': [{ required: true, message: '循环次数不能为空', trigger: 'blur' }]
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
      Element.queryElementInfo({ elementNo: this.editorInfo.elementNo }).then(response => {
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
    modifyGroupElement(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Element.modifyElement({ elementNo: this.editorInfo.elementNo, ...this.elementForm }).then(response => {
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
    createGroupElement(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Element.addElementChildren(
            { parentNo: this.editorInfo.collectionNo, children: [this.elementForm] }
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
  .group-editor-container{
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
