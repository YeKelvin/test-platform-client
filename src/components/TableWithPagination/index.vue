<template>
  <div>
    <div>查询结果</div>
    <el-divider />
    <el-table
      style="width: 100%; height: 100px;"
      :border="true"
      :stripe="true"
      :fit="true"
      :highlight-current-row="true"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="(index, name) in $slots" :slot="name">
        <slot :name="name" />
      </template>

      <template v-for="(index, name) in $scopedSlots" v-slot:[name]="slotProps">
        <slot :name="name" v-bind="{slotProps}" />
      </template>
    </el-table>

    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 25, 50, 100]"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { Table } from 'element-ui'
import { Pagination } from 'element-ui'

export default {
  name: 'TableWithPagination',
  props: {
    ...Table.props,
    ...Pagination.props
  }
}
</script>

<style lang="SCSS" scoped>

</style>
