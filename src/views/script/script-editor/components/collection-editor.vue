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
      @close="$emit('update:visible', false)"
    >
      <el-form-item label="名称：" prop="elementName">
        <el-input v-model="elementForm.elementName" placeholder="元素名称" clearable />
      </el-form-item>
      <el-form-item label="注释：" prop="elementComments">
        <el-input v-model="elementForm.elementComments" placeholder="元素注释" clearable />
      </el-form-item>
      <el-form-item label="顺序执行：" prop="serialized">
        <el-switch v-model="elementForm.propertys['TestCollection.serialized']" />
      </el-form-item>
      <el-form-item label="延迟ms：" prop="delay">
        <el-input v-model="elementForm.propertys['TestCollection.delay']" placeholder="还没有实现" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('elementForm')">保存</el-button>
        <el-button @click="resetForm('elementForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as Element from '@/api/script/element'
export default {
  name: 'CollectionEditor',

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
      elementForm: {
        elementName: '',
        elementComments: '',
        elementType: 'COLLECTION',
        propertys: {
          'TestCollection.serialized': true,
          'TestCollection.delay': 0
        }
      },
      elementFormRules: {
        elementName: [{ required: true, message: '测试集合名称不能为空', trigger: 'blur' }]
      }
    }
  },

  mounted: function() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createTestCollection().then(response => {
            if (response.success) {
              this.$message({ message: '新增测试集合成功', type: 'info', duration: 2 * 1000 })
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    createTestCollection() {
      return Element.createElement({ itemNo: this.itemNo, ...this.elementForm })
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
