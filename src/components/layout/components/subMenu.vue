<template>
  <a-sub-menu :key="menuInfo.name" v-if="!menuInfo.meta.hideInMenu && (!menuInfo.meta.access || authCodeMenus.indexOf(menuInfo.meta.access) > -1) && childrenArr.length > 0">
    <template #title>
      <i :class="'iconfont ' + menuInfo.meta.icon" v-show="menuInfo.meta.icon"></i>
      <span>{{ menuInfo.meta.title }}</span>
    </template>
    <template v-for="item in menuInfo.children" :key="item.path">
      <template v-if="!item.children">
        <a-menu-item :key="item.path" @click="clickMenuNode(item)" v-if="!item.meta.hideInMenu && (!item.meta.access || authCodeMenus.indexOf(item.meta.access) > -1)">
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item" :key="item.path"/>  
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
import { Menu } from 'ant-design-vue';
import SubMenu from './subMenu.vue'

const { state, commit } = useStore()
const route = useRoute()
const router = useRouter()
const menuCodes = JSON.parse(localStorage.getItem('menuCodes') as any);
const authCodeMenus = menuCodes.map((_m:any) => _m.code);

const props = defineProps({
  ...Menu.SubMenu.props,
  menuInfo: {
    type: Object,
    default: () => ({}),
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

let childrenArr:any = [];
props.menuInfo?.children.map(_i => {
  if (!_i.meta.access || authCodeMenus.indexOf(_i.meta.access) > -1) {
    childrenArr.push(_i)
  }
})

// 根据选择的菜单，路由到不同的页面
const clickMenuNode = (nodeInfo:any) => {
  const tabList = JSON.parse(localStorage.getItem('tabList') as any);
  let isExisting = tabList && tabList.find((_i:any) => {return _i.path == nodeInfo.path}) ? true : false;
  console.log('根据选择的菜单，路由到不同的页面',nodeInfo)
  if (nodeInfo.meta.keepAlive && !isExisting) {
    location.href = nodeInfo.path
    return;
  } else {
    router.push(nodeInfo.path)
  }
  commit('tabs/setTabList', nodeInfo)
}
</script>