import Main from '@/view/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/c/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/c/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/home/index')
      }
    ]
  },
  {
    path: '/c',
    name: 'client',
    component: Main,
    meta:{
      title: '首页1',
      icon:'ios-cog'
    },
    children:[
      { path:'my', name:'my', meta: { icon: 'md-bookmarks',title: '我的资料',access: ['client:my'] }, component: () => import('@/view/client/my/index') },
      { path:'credits', name:'credits', meta: { icon: 'md-bookmarks',title: '我的学分',access: ['client:credits'] }, component: () => import('@/view/client/credits/index') },
      { path:'activities', name:'activities', meta: { icon: 'md-bookmarks',title: '我的活动',access: ['client:activities'] }, component: () => import('@/view/client/activity/index') },
      { path:'auth',  name:'auth', meta: { icon: 'md-bookmarks',title: '学生认证',access: ['client:auth'] }, component: () => import('@/view/client/auth/index') },
      { path:'detail/:id',  name:'detail', meta: { icon: 'md-bookmarks',title: '活动详情',access: ['client:detail'] }, component: () => import('@/view/client/activity/detail.vue') }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
