<template>
  <scrollbar class="app-main-container">
    <div class="item-list-container">
      <div class="item-list-sidebar-container">
        <div><b>测试项目</b></div>
        <el-divider />
        <el-card
          v-for="(item, index) in itemList"
          :key="index"
          class="item-card"
          @click="queryActivityLogList(item.itemNo)"
        >
          <div class="item-card-inner">
            {{ item.itemName }}
            <div class="edit-button-container">
              <el-divider direction="vertical" />
              <i class="el-icon-s-promotion" @click="gotoScriptEditor(item.itemNo)"/>
            </div>
          </div>
        </el-card>
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
              <!--              v-infinite-scroll="queryActivityLogList"-->
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
        content: '还没做好啊',
        timestamp: '2020-03-18'
      }, {
        content: '还没做好啊',
        timestamp: '2020-03-17'
      }, {
        content: '还没做好啊',
        timestamp: '2020-03-16'
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
        this.itemList = result
      }).catch(() => {})
    },
    queryActivityLogList() {
      //
    },
    gotoScriptEditor(itemNo) {
      this.$router.push({ name: 'ScriptEditor', params: { itemNo: itemNo }})
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

  .item-list-sidebar-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 500px;

    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    /deep/.el-card__body {
      padding: 15px;
    }
  }

  .item-card {
    margin: 8px 10px 8px 10px;

    &:hover {
      background-color: #F5F5F5;
      border-color: #DCDCDC;
      border-radius: 12px;
    }
  }

  .item-card-inner {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  }

  .edit-button-container {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;

    i {
      font-size: 26px;
      color: #409EFF;
      cursor:pointer;
    }
  }

  .item-action-log-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    margin: 0 12px 0 12px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
</style>
