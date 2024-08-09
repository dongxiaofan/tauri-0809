
import { createRouter, createWebHistory } from 'vue-router'
import basicsRouter from './basics.router'
import whiteList from './white.router'
import storage from 'store'
import store from '@/store'
import Cookies from 'js-cookie'


const router = createRouter({
  history: createWebHistory('/'),
  routes: basicsRouter
})
const loginPath = '/login'
const notAuthorityPath = '/403' // 没权限
const notFound = '/404' // 没找到页面

router.beforeEach((to, from, next) => {
  // 当前菜单权限码
  const currentMenu = storage.get('loginInfo')?.menuList.find((item: any) => {
    return item.menuCode === to.meta.access
  })
  console.log('⭐ currentMenu： ', currentMenu)
  store.dispatch('user/handleActionAccess', currentMenu?.Buttons || [])

  if (storage.get('loginInfo') && Cookies.get('token')) { // 已登陆情况
    if (!router.hasRoute(to.name || '')) {
      next({ path: notFound, replace: true })
    } else if (whiteList.includes(to.path)) {
      next()
    } else {
      if (!to.meta.access || (to.meta.access && currentMenu?.menuCode == to.meta.access)){
        next()
      } else {
        next({ path: notAuthorityPath, replace: true })
      }
    }
  } else { // 未登陆情况
    if (to.path !== loginPath) {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next({path: loginPath})
      }
    } else {
      next()
    }
  }
})

router.afterEach((to:any, from) => {
  console.log('🌼 to: ', to)
  if (['login', '403', '404', '500', 'regionScreen', 'financeScreen', 'messageList', 'ViewFbqd', 'ViewCgys', 'ViewFwzd', 'ViewBxzd'].indexOf(to.name) == -1) {
    store.dispatch('tabs/handleSetTabList', to || {})
  }
})

export default router