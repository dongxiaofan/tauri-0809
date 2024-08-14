import storage from 'store'
import Cookies from 'js-cookie'
import { ActionContext } from 'vuex'
import { message } from 'ant-design-vue'
import AccountApi from '@/api/account'

export type LoginFrom = {
  UserName: string | undefined,
  Password: string | undefined,
  TenantId: string | undefined,
}


const user = {
  namespaced: true,

  state: {
    loginInfo: storage.get('loginInfo'),
    token: Cookies.get('token'),
    avatar: '',
    loginId: storage.get('loginId'),
    name: storage.get('name'),
    menuCodes: storage.get('loginInfo')?.menus?.map((item:any) => {return item.code}),
    actionAccess: [], // 操作权限
  },

  getters: {},

  mutations: {
    // 设置token
    setToken (state: any, data: string) {
      state.token = data
      let time = new Date(new Date().getTime() + 10 * 60 * 60 * 1000); // 10小时
      Cookies.set('token', data, { expires: time })
    },
    
    // 设置avatar
    setAvatar (state: any, data: string) {
      state.avatar = data
      storage.set('avatar', data)
    },
    
    // 设置loginId
    setLoginId (state: any, data: string) {
      state.loginId = data
      storage.set('loginId', data)
    },
    
    // 设置name
    setName (state: any, data: string) {
      state.name = data
      storage.set('name', data)
    },

    // 菜单
    setMenuCodes (state: any, data: string) {
      state.menuCodes = data
      storage.set('menuCodes', data)
    },

    // 设置菜单权限码
    setActionAccess (state: any, arr: any) {
      const btns = arr.map((item: any) => item.code)
      state.actionAccess = btns || []
    },

    // 退出登陆
    logout (state: any) {
      Cookies.remove('token')
      storage.clearAll()
      state.menuCodes = []
    }
  },

  actions: {
    login (context:ActionContext, params:any) {
      return new Promise((resolve, reject) => {
        AccountApi.login(params).then((resp: any) => {
          if (resp) {
            message.success(resp.message || '成功')
            const data = resp.data
            storage.set('loginInfo', data)
            context.commit('setToken', data.access_token)
            context.commit('setName', data.name)
            context.commit('setLoginId', data.userId)
            context.commit('setMenuCodes', data.menus || [])
          } else {
            message.error(resp.message)
          }
          resolve(resp)
        }).catch((err:any) => {
        })
      })
    },

    // 设置按钮权限码
    handleActionAccess ({ state, commit }:any, arr: any) {
      commit('setActionAccess', arr)
    }
  },
}

export default user