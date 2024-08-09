import RouterView from '_c/routerView'
import demoModule from './modules/demo.module'

const menuRouter = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '工作台',
      icon: 'icon-gongzuotai',
      hideInMenu: false,
    },
    component: ()=>import('@/views/home/index.vue')
  },
  demoModule,
]

export default menuRouter
