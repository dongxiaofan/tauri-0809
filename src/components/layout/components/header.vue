<template>
  <a-layout-header>
    <div class="layout-header-left">
      <div class="left-icons" @click="handleCollapsed">
        <menu-unfold-outlined v-if="collapsed" />
        <menu-fold-outlined v-else />      
      </div>
      <div class="left-text">{{title}}</div>
    </div>
    <div class="layout-header-right">
      <div class="layout-header-right-user">
        <a-dropdown>
          <div class="login-info">
            <div class="login-avator">
              <img src="@/assets/images/avator.png" />
            </div>
            <span class="login-name">{{ sysName }}</span>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="logout">
                <div class="line-h-32 pl-20 pr-20">退出登陆</div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';

const route = useRoute()
const menuRouter = computed(() => {return state.menu.menuRouter})
const { state, commit } = useStore()

// 登录名称
const sysName = computed(() => {return state.user.name})

// title
const title = ref<any>(null)

// 是否折叠
const collapsed = computed(() => {return state.menu.collapsed})

// 展开/折叠操作
const handleCollapsed = () => {
  commit('menu/setCollapsed', !state.menu.collapsed)
}

// 退出登陆
const logout = () => {
  commit('user/logout')
  window.location.href = '/login';
}

// 遍历树
const getNames = (data:any, val:string) => {
  const name = val.indexOf('?') > -1 ? val.substring(0, val.indexOf('?')) : val
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i].name === name) {
      return [data[i].meta.title]
    }
    if (data[i] && data[i].children) {
      let d:any = getNames(data[i].children, name)
      if (d) {
        return d.concat(data[i].meta.title)
      }
    }
  }
}

const getTitle = () => {
  let titleArr = getNames(menuRouter.value, route.fullPath.replace('/', ''))
  title.value = titleArr?.reverse().join(' / ')
}

watch(route, to => {
  getTitle()
})

onMounted(() => {
  getTitle()
})
</script>

<style lang="less">
.trigger{
  color: #fff;
  font-size: 20px;
}
</style>