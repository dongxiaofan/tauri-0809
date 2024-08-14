<template>
  <a-layout-sider class="ant-layout-sider" :collapsed="collapsed" :trigger="null" collapsible>
    <div class="logo">
      <span>
        <img :src="logo_img" class="logo-img" />
        <!-- <img v-if="!collapsed" class="logo-txt" :src="logo_txt" /> -->
        <span v-if="!collapsed" class="logo-txt">你好，{{ sysName }}~</span>
      </span>
    </div>
    <a-menu mode="inline" :openKeys="openKeys" :selectedKeys="selectedKeys" @openChange="onOpenChange" class="layout-menu">
      <template v-for="item in menuRouter" :key="item.path">
        <template v-if="!item.meta.access || authCodeMenus.indexOf(item.meta.access) > -1">
          <template v-if="!item.children && !item.meta.hideInMenu">
            <a-menu-item :key="item.path" @click="clickMenuNode(item)">
              <i :class="'iconfont ' + item.meta.icon" v-show="item.meta.icon"></i>
              <span>{{ item.meta.title }}</span>
              <!-- <span v-show="!collapsed">{{ item.meta.title }}</span> -->
            </a-menu-item>
          </template>
          <template v-else>
            <sub-menu :menu-info="item" :key="item.path" />
          </template>
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
import SubMenu from './subMenu.vue'
const { state, commit } = useStore()
import logo_img_default from '@/assets/images/theme/default/logo.png'
// import logo_txt_default from '@/assets/images/theme/default/logo_txt.png'
const logo_img = logo_img_default
// const logo_txt = logo_txt_default
// 登录名称
const sysName = computed(() => {return state.user.name})
const route = useRoute()
const router = useRouter()
const menuCodes = JSON.parse(localStorage.getItem('menuCodes') as any);
const authCodeMenus = menuCodes.map((_m:any) => _m.code);

// 是否折叠
const collapsed = computed(() => {return state.menu.collapsed})
// 菜单列表
const menuRouter = computed(() => {return state.menu.menuRouter})

const selectedKeys = ref<string[]>([]);

// 处于展开状态的节点key列表
const openKeys = ref<string[]>([]);

watch(route, to => {
  setMenuKey()
})

const setMenuKey = () => {
  selectedKeys.value = [route.path]
  openKeys.value = []
  route.matched.forEach((item:any) =>{
    openKeys.value.push(item.name)
  })
}

// 根据选择的菜单，路由到不同的页面
const clickMenuNode = (nodeInfo:any) => {
  const tabList = JSON.parse(localStorage.getItem('tabList') as any);
  let isExisting = tabList && tabList.find((_i:any) => {return _i.path == nodeInfo.path}) ? true : false;
  if (nodeInfo.meta.keepAlive && !isExisting) {
    location.href = nodeInfo.path
    return;
  } else {
    router.push(nodeInfo.path)
  }
  commit('tabs/setTabList', nodeInfo)
}

// 展开/收起菜单
const onOpenChange = (openKeys:any) => {
}

onBeforeMount(setMenuKey)

</script>

<style lang="less" scoped>
.logo{
  width: 100%;
  text-align: center;
  line-height: 48px;
  color: #fff;
  background-color: rgba(255,255,255,.05);
  border-bottom: solid 1px rgba(255,255,255,.1);
  .logo-img{
    width: 24px;
    height: 24px;
  }
  .logo-txt{
    margin-left: 10px;
    position: relative;
    top: 4px;
  }
}
</style>