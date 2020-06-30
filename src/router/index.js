import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 所有权限通用路由表
 * 如首页和登录页和一些不用权限的公用页面
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/',
    name: 'Index',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/user',
    name: 'User',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/user/user-management/index'),
        meta: { title: '用户管理', icon: 'example' }
      },
      {
        path: 'permission-management',
        name: 'PermissionManagement',
        component: () => import('@/views/user/permission-management/index'),
        meta: { title: '权限管理', icon: 'example' }
      },
      {
        path: 'role-management',
        name: 'RoleManagement',
        component: () => import('@/views/user/role-management/index'),
        meta: { title: '角色管理', icon: 'example' }
      },
      {
        path: 'user-role-rel-management',
        name: 'UserRoleRelManagement',
        component: () => import('@/views/user/user-role-rel-management/index'),
        meta: { title: '用户角色关联管理', icon: 'example' }
      },
      {
        path: 'role-permission-rel-management',
        name: 'RolePermissionRelManagement',
        component: () => import('@/views/user/role-permission-rel-management/index'),
        meta: { title: '角色权限关联管理', icon: 'example' }
      }
    ]
  },

  {
    path: '/system',
    name: 'System',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'action-log',
        name: 'ActionLog',
        component: () => import('@/views/system/action-log/index'),
        meta: { title: '操作日志', icon: 'example' }
      }
    ]
  },

  {
    path: '/script',
    name: 'Script',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '脚本管理', icon: 'example' },
    children: [
      {
        path: 'workspace-list',
        name: 'WorkspaceList',
        component: () => import('@/views/script/workspace-list/index'),
        meta: { title: '脚本编辑', icon: 'example' }
      },
      {
        path: 'script-editor',
        name: 'ScriptEditor',
        component: () => import('@/views/script/script-editor/index'),
        meta: { title: '脚本编辑' },
        hidden: true
      },
      {
        path: 'batch-execution',
        name: 'BatchExecution',
        component: () => import('@/views/script/batch-execution/index'),
        meta: { title: '批量执行', icon: 'example' }
      },
      {
        path: 'element-package',
        name: 'ElementPackage',
        component: () => import('@/views/script/element-package/index'),
        meta: { title: '元素封装', icon: 'example' }
      },
      {
        path: 'workspace-management',
        name: 'WorkspaceManagement',
        component: () => import('@/views/script/workspace-management/index'),
        meta: { title: '工作空间管理', icon: 'example' }
      },
      {
        path: 'topic-management',
        name: 'TopicManagement',
        component: () => import('@/views/script/topic-management/index'),
        meta: { title: '主题管理', icon: 'example' }
      },
      {
        path: 'environment-variable-management',
        name: 'EnvironmentVariableManagement',
        component: () => import('@/views/script/environment-variable-management/index'),
        meta: { title: '环境变量管理', icon: 'example' }
      },
      {
        path: 'http-header-management',
        name: 'HTTPHeaderManagement',
        component: () => import('@/views/script/http-header-management/index'),
        meta: { title: 'HTTP头部管理', icon: 'example' }
      },
      {
        path: 'sql-configuration-management',
        name: 'SQLConfigurationManagement',
        component: () => import('@/views/script/sql-configuration-management/index'),
        meta: { title: 'SQL配置管理', icon: 'example' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = []

const createRouter = () => new Router({
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
