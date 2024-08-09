<template>
  <div class="layout-content-warp">
    <a-tabs hide-add type="editable-card" :activeKey="activeKey" :animated="false" :tab-position="mode" @tabScroll="tabsScroll" @edit="editTab" @tabClick="tabClick" class="layout-header-tabs-wrap customer-tabs-wrap">
      <a-tab-pane v-for="item in tabList" :key="item.path" :tab="item.meta.title" :closable="item.name !== 'home'"></a-tab-pane>
      <!-- <template #leftExtra> <left-outlined /> </template> -->
      <template #rightExtra>
        <!-- <right-outlined /> -->
        <a-dropdown>
          <close-circle-outlined />
          <template #overlay>
            <a-menu>
              <a-menu-item @click="closeOther">
                <div class="line-h-32 pl-20 pr-20">关闭其他</div>
              </a-menu-item>
              <a-menu-item @click="closeAll">
                <div class="line-h-32 pl-20 pr-20">关闭全部</div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tabs>

    <div class="content-wrapper">
      <RouterView></RouterView>
    </div>

    <!-- <div class="layout-footer">
      <p>Copyright © 2020-{{new Date().getFullYear()}}{{VITE_FOOTER_GS}} All Rights Reserved</p>
      <p>
        <span class="pr-5">技术支持：{{ VITE_FOOTER_JSZC }}</span>
        <a class="layout-footer-a" target="_blank" href="https://beian.miit.gov.cn/">{{ VITE_FOOTER_ICP }}</a>
        <span class="pl-10">邮箱地址：{{VITE_FOOTER_YX}}</span>
      </p>
      <p>        
        <a class="layout-footer-a" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=43010302001696">
          <img class="police" src="@/assets/images/police.png" />
          <span>湘公网安备{{ VITE_FOOTER_XGWAB}}号</span>
        </a>
      </p>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LeftOutlined, RightOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import type { TabsProps } from 'ant-design-vue';
import RouterView from '_c/routerView';
const mode = ref<TabsProps['tabPosition']>('top');
const VITE_FOOTER_GS = import.meta.env.VITE_FOOTER_GS
const VITE_FOOTER_JSZC = import.meta.env.VITE_FOOTER_JSZC
const VITE_FOOTER_ICP = import.meta.env.VITE_FOOTER_ICP
const VITE_FOOTER_YX = import.meta.env.VITE_FOOTER_YX
const VITE_FOOTER_XGWAB = import.meta.env.VITE_FOOTER_XGWAB
const { state, commit } = useStore()
const route = useRoute()
const router = useRouter()

let activeKey = ref<string>()
const tabList = computed(() => {return state.tabs.tabList})

watch(route, to => {
  activeKey.value = to.path
})

onBeforeMount(() => {
  activeKey.value = route.path
})

// tab滚动
const tabsScroll: TabsProps['onTabScroll'] = val => {
  // console.log(val);
};

// tab关闭
const editTab = (actionPath:string, action:string) => {
  if (action == 'remove') {
    commit('tabs/delTab', actionPath)
  }
}

// tab点击
const tabClick = (actionPath:string) => {
  activeKey.value = actionPath
  router.push(actionPath)
}

// 关闭其他
const closeOther = () => {
  commit('tabs/delOtherTab')
}

// 关闭全部
const closeAll = () => {
  commit('tabs/delAllTab')
}
</script>