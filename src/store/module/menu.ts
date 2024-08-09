import menuRouter from '@/router/menu.router.ts'

const menu = {
  // 开启 namespaced:true，该模块就成为命名空间模块了
  namespaced: true,

  // 状态管理器中定义的数据源
  state: {
    // 侧边菜单
    menuRouter: menuRouter,
    // 菜单是否展开
    collapsed: false,
  },

  getters: {},

  // 同步操作
  mutations: {
    setMenuRouter(state: any, data: any) {
      state.menuRouter = data
    },

    setCollapsed(state: any, data: boolean) {
      state.collapsed = data
    },
  },

  // 异步操作
  actions: {},
}

export default menu