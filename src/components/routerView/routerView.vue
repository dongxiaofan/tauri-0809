<template>
  <router-view v-slot="{ Component }" :key="route.path">
    <keep-alive :include="[...keepalive, ...['routerView']]">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
const route = useRoute()
const { state } = useStore()
const keepalive = computed(() => {return state.global.keepalive})
</script>