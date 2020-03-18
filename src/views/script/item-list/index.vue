<template>
  <scrollbar class="app-main-container">
    <div class="item-list-container">
      <div class="item-list-sidebar-container">
        <div><b>测试项目</b></div>
        <el-divider />
        <el-card v-for="(item, index) in itemList" :key="index">{{ item }}</el-card>
      </div>
      <div class="item-action-log-container">
        <div><b>项目动态</b></div>
        <el-divider />
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
            >
              <!--              v-infinite-scroll="load"-->
              <!--              style="overflow:auto"-->
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </scrollbar>
</template>

<script>
import * as Item from '@/api/script/item'
export default {
  name: 'ItemList',

  data() {
    return {
      itemList: [],
      activities: [{
        content: '活动按期开始',
        timestamp: '2020-03-18'
      }, {
        content: '通过审核',
        timestamp: '2018-04-17'
      }, {
        content: '创建成功',
        timestamp: '2018-04-16'
      }]
    }
  },

  mounted: function() {
    this.queryItemAll()
  },

  methods: {
    queryItemAll() {
      Item.queryItemAll().then(response => {
        const { result } = response
        this.itemList.concat(result)
      }).catch(() => {})
    },
    load() {
      //
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-list-container {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;

    height: 100%;
    padding: 20px;

    .el-divider--horizontal {
      margin: 10px 0
    }
  }

  .item-list-sidebar-container{
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 500px;

    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .item-action-log-container{
    display: flex;
    flex: 1;
    flex-direction: column;

    margin: 0 12px 0 12px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
</style>
