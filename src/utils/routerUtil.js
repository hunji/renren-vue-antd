import { axios } from '@/utils/request'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),
  workplace: () => import('@/views/dashboard/Workplace'),
  monitor: () => import('@/views/dashboard/Monitor'),
  // ...more
  user: () => import('@/views/sys/User'),
  role: () => import('@/views/sys/Role'),
  menu: () => import('@/views/sys/Menu')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}
// mainRoute  在递归前添加到当前查出来menuList中
const mainMenu = [{
  name: '首页',
  component: 'BasicLayout',
  url: '/',
  rkey: 'index',
  redirect: '/dashboard/workplace'
}]

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/sys/menu/nav',
    method: 'get'
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // 这里从后台取到menu，根据menu生成路由表结构
    getRouterByUser().then(res => {
      mainMenu[0].list = res.menuList
      const routers = generator(mainMenu)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${parent && parent.path || ''}/${item.url}`,
      // 路由名称，建议唯一
      name: item.rkey || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.rkey],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.name, icon: item.icon || undefined }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 如果item的url是以http或者https开头的，进行特殊处理
    if (currentRouter.path.indexOf('http') > -1 || currentRouter.path.indexOf('https') > -1) {
      currentRouter.path = item.url
      currentRouter.component = null
      currentRouter.meta.target = '_blank'
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.list && item.list.length > 0) {
      // Recursion
      currentRouter.children = generator(item.list, currentRouter)
    }
    return currentRouter
  })
}
