import Layout from '_c/layout'
import RouterView from '_c/routerView'

import menuRouter from './menu.router'
import errorRouter from './error.router'

const basicsRouter = [
  { 
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true,
    },
    component: ()=>import('@/views/login/index.vue')
  },
  { 
    path: '/',
    name: 'menu',
    redirect: "/home",
    component: Layout,
    children: [...menuRouter]
  },
  { 
    path: '/error',
    name: 'error',
    component: RouterView,
    children: [...errorRouter]
  },
]

export default basicsRouter