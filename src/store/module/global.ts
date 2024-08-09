import storage from 'store';
import Cookies from 'js-cookie'

const global = {
  // 开启 namespaced:true，该模块就成为命名空间模块了
  namespaced: true,

  // 状态管理器中定义的数据源
  state: {
    // 缓存路由
    keepalive: storage.get('keepAliveName') || []
  },

  getters: {},

  // 同步操作
  mutations: {
    setKeepAliveName(state: any, data: any) {
      console.log('store/global/data: ', data)
      state.keepalive = data
      storage.set('keepAliveName', data)
    },

    setTokenExpiration (state: any, status: boolean) {
      state.tokenExpiration = status
      Cookies.set('tokenExpiration', status.toString())
    },
  },

  // 异步操作
  actions: {
    handleTokenExpiration ({ state, commit }:any, status: boolean) {
      commit('setTokenExpiration', status)
    }
  },
}

export default global