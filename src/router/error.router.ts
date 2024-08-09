const errorRouter = [
  {
    path: '/403',
    name: '403',
    meta: {
      title: '403',
      hideInMenu: false,
    },
    component: ()=>import('@/views/errorPages/403.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404',
      hideInMenu: false,
    },
    component: ()=>import('@/views/errorPages/404.vue')
  },
  {
    path: '/500',
    name: '500',
    meta: {
      title: '500',
      hideInMenu: false,
    },
    component: ()=>import('@/views/errorPages/500.vue')
  },
]

export default errorRouter
