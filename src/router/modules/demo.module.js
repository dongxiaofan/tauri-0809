import RouterView from '_c/routerView'

// 范例模块
const demoModule = {
  path: '/demo',
  name: 'demo',
  meta: {
    title: '范例',
    icon: 'icon-pingjiabiaoqian',
    hideInMenu: false,
    // access: '_home'
  },
  component: RouterView,
  children: [
    { 
      path: '/mixin_list',
      name: 'mixin_list',
      meta: {
        title: '组件列表',
        icon: 'icon-pingjiabiaoqian',
        hideInMenu: false,
        // access: '_home',
        keepAlive: true,
      },
      component: ()=>import('@/views/demo/mixin_list/index.vue')
    },
    { 
      path: '/list',
      name: 'list',
      meta: {
        title: '普通列表',
        icon: 'icon-pingjiabiaoqian',
        hideInMenu: false,
        // access: '_home',
        keepAlive: true,
      },
      component: ()=>import('@/views/demo/list/index.vue')
    },
    { 
      path: '/useMap',
      name: 'useMap',
      meta: {
        title: '地图操作',
        icon: 'icon-pingjiabiaoqian',
        // hideInMenu: false,
        // access: '_home',
        keepAlive: true,
      },
      component: ()=>import('@/views/demo/useMap/index.vue')
    },
  ]
}

export default demoModule