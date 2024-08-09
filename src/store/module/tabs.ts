import storage from 'store'
import router from '@/router'

const tabs = {
  // 开启 namespaced:true，该模块就成为命名空间模块了
  namespaced: true,

  // 状态管理器中定义的数据源
  state: {
    // 侧边菜单
    tabList: storage.get('tabList') || []
  },

  getters: {},

  // 同步操作
  mutations: {
    // 新增标签页
    setTabList(state: any, data: any) {
      console.log('🌼 store/module/tabs: state-', state, ', data-', data)
      let oldArr = state.tabList;
      let isExisting = oldArr && oldArr.find((_i:any) => {return _i.path == data.path}) ? true : false
      if (!isExisting) {
        if (data.name == 'home') {
          oldArr.unshift(data)
        } else {
          oldArr.push(data)
        }
        storage.set('tabList', oldArr)
      }
    },

    // 关闭单个标签页
    delTab(state: any, actionPath: string) {
      let oldArr = state.tabList
      const currentRoute = router.currentRoute.value
      console.log('router: ', router)
      if (!oldArr.length) {
        return false
      }
      for (let i = 0; i < oldArr.length; i++) {
        if (oldArr[i].path == actionPath) {
          if (currentRoute.path == actionPath) {
            if (i == oldArr.length -1) { // 当关闭的是最右的tab时，path要改成上一个tab的path，即[i-1].path
              router.push(oldArr[i-1].path)
            } else { // 当点击关闭tab时，默认显示下一个tab页面，即[i+1].path
              router.push(oldArr[i+1].path)
            }
          }

          oldArr.splice(i, 1)
          storage.set('tabList', oldArr)
          break;
        }
      }
    },

    // 关闭其他标签页
    delOtherTab(state: any) {
      console.log('点击了 关闭其他 state: ', state)
      let oldArr = state.tabList;
      const currentRoute = router.currentRoute.value
      console.log('点击了 关闭其他 currentRoute: ', currentRoute)
      router.push(currentRoute.path)
      for (let i = oldArr.length - 1; i >= 0; i--) {
        if (i !== 0 && oldArr[i].path !== currentRoute.path) {
          oldArr.splice(i, 1)
          storage.set('tabList', oldArr)
        }
      }
      storage.set('tabList', oldArr)
    },

    // 关闭所有标签页
    delAllTab(state: any) {
      let oldArr = state.tabList;
      router.push('/home')
      for (let i = oldArr.length - 1; i >= 0; i--) {
        if (i !== 0) {
          oldArr.splice(i, 1)
          storage.set('tabList', oldArr)
        }
      }
    }
  },

  // 异步操作
  actions: {
    // 设置tabs
    handleSetTabList ({ state, commit }:any, nodeInfo: any) {
      commit('setTabList', nodeInfo)
    }
  },
}

export default tabs