import { createStore } from "vuex";
import user from './module/user'
import menu from './module/menu'
import tabs from './module/tabs'
import global from './module/global'

const store = createStore({
  modules: {
    user,
    menu,
    tabs,
    global
  }
})

export default store

