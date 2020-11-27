<template>
  <div class="scrollbar">
    <div class="workspace-list-container">
      <div class="workspace-list-sidebar-container">
        <div><b>工作空间</b></div>
        <el-divider />
        <el-tabs v-model="workspaceType" :stretch="true">
          <el-tab-pane label="团队" name="team">
            <el-card
              v-for="(workspace, index) in workspaceList"
              :key="index"
              class="workspace-card"
              @click.native="queryActivityLogList(workspace.workspaceNo)"
              @dblclick.native="gotoScriptEditor(workspace.workspaceNo)"
            >
              <div class="workspace-card-inner">
                {{ workspace.workspaceName }}
                <div class="edit-button-container">
                  <el-divider direction="vertical" />
                  <i class="el-icon-s-promotion" @click="gotoScriptEditor(workspace.workspaceNo)" />
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="个人" name="person" />
        </el-tabs>
      </div>
      <div class="workspace-action-log-container">
        <div><b>空间动态</b></div>
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
  </div>
</template>

<script>
import * as Workspace from '@/api/script/workspace'
export default {
  name: 'WorkspaceEntrance',

  data() {
    return {
      workspaceType: 'team',
      workspaceList: [],
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
    this.queryWorkspaceAll()
  },

  methods: {
    queryWorkspaceAll() {
      Workspace.queryWorkspaceAll().then(response => {
        const { result } = response
        this.workspaceList = result
      }).catch(() => {})
    },
    queryActivityLogList() {
      //
    },
    gotoScriptEditor(workspaceNo) {
      this.$router.push({ name: 'ScriptEditor', params: { workspaceNo: workspaceNo }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .workspace-list-container {
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

  .workspace-list-sidebar-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 500px;

    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    ::v-deep.el-card__body {
      padding: 15px;
    }
  }

  .workspace-card {
    margin: 8px 10px 8px 10px;
    user-select: none;

    &:hover {
      background-color: #F5F5F5;
      border-color: #DCDCDC;
      border-radius: 12px;
    }
  }

  .workspace-card-inner {
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

  .workspace-action-log-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    margin: 0 12px 0 12px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
</style>
