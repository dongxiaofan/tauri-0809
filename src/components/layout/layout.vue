<template>
  <a-layout :class="layout_class">
    <Menu></Menu>
    <a-layout-content :class="collapsed?'content-unfold':'content-fold'">
      <Header></Header>
      <Content></Content>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
const { state, commit } = useStore()
import Menu from './components/menu.vue';
import Header from './components/header.vue';
import Content from './components/content.vue';
import PublicApi from '@/api/public';
// 是否折叠
const collapsed = computed(() => {return state.menu.collapsed})

// 登陆用户ID
const loginId = computed(() => {return state.user.loginId})
console.log('xxxxxxxxxxxxxxxxxx ', import.meta.env)
// 全局样式名称
const layout_class = import.meta.env.VITE_LAYOUT_CLASSNAME || 'default_layout_wrap';

// 组件挂载完成
onMounted(() => {
});
</script>

<style scoped>
section.ant-layout {
  width: 100%;
  min-width: 1000px;
  min-height: 100%;
}
</style>