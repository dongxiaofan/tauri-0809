<template>
  <div :class="login_class">
    <div class="container">
      <div class="login_page_logo"></div>
      <div class="login_page_box">
        <div class="login-box-title">欢迎登陆 <span>{{dayjs(new Date()).format('HH:mm:ss')}}</span></div>
        <div class="login-content">
          <a-form
            ref="formRef"
            :model="formLogin"
            :rules="rules"
            autocomplete="off"
          >
            <a-form-item name="userName">
              <i class="iconfont icon-user"></i>
              <a-input v-model:value="formLogin.userName" placeholder="请输入用户名">
              </a-input>
            </a-form-item>
            <a-form-item name="userPwd">
              <i class="iconfont icon-lock"></i>
              <a-input v-model:value="formLogin.userPwd" type="password" placeholder="请输入密码">
              </a-input>
            </a-form-item>
            <a-button type="primary" class="submit-btn" :loading="loading" @click="handleSubmit">登 录</a-button>
          </a-form>
        </div>      
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cookies from 'js-cookie';
import storage from 'store';
import { ref, reactive, UnwrapRef, onMounted } from 'vue';
import { useStore } from 'vuex';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import menuRouter from '@/router/menu.router.ts';
import ServiceApi from './service';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

const VITE_FOOTER_GS = import.meta.env.VITE_FOOTER_GS
const VITE_FOOTER_JSZC = import.meta.env.VITE_FOOTER_JSZC
const VITE_FOOTER_ICP = import.meta.env.VITE_FOOTER_ICP
const VITE_FOOTER_YX = import.meta.env.VITE_FOOTER_YX
const VITE_FOOTER_XGWAB = import.meta.env.VITE_FOOTER_XGWAB
const login_class = import.meta.env.VITE_LOGIN_CLASSNAME || 'default_login_wrap'
const formRef = ref();
const { commit, dispatch } = useStore()
const loading = ref<boolean>(false)

interface FormLoginType {
  userName: string;
  userPwd: string;
}
const formLogin: UnwrapRef<FormLoginType> = reactive({
  userName: 'admin',
  userPwd: '123456',
})

const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  userPwd: [{ required: true, message: '请输入密码', trigger: 'change' }],
}

const handleSubmit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false;
  }, 3000);
  formRef.value.validate().then(() => {
    dispatch('user/login', formLogin).then((resp:any) => {
      const menuCodeArr = resp.data.menuList.map((_i:any) => _i.menuCode);
      let menu_module = menuRouter.find((_p:any) => (menuCodeArr.indexOf(_p.meta.access) > -1));
      let menu_parent = menu_module.children ? menu_module.children.find((_c:any) => menuCodeArr.indexOf(_c.meta.access) > -1) : null;
      let menu_item = {};
      let currentMenuItem = menu_parent ? (menu_parent.children ? getMenu(menu_parent.children, menu_item, menuCodeArr) : menu_parent) : menu_module;
      commit('tabs/setTabList', currentMenuItem)
      router.push(currentMenuItem.path)
      getKeepAliveNameArr()
    }).catch((err:any) => {
      console.log('login page err: ', err)
    })
  })
  .catch((error:any) => {
    console.log('error', error);
  });
};

// 遍历树(查找有菜单权限的第一个菜单)
const getMenu = (menuItems:any, newItem:any, accessCodeArr:any) => {
  for (var i in menuItems) {
    if (accessCodeArr.indexOf(menuItems[i].meta.access) > -1) {
      newItem = menuItems[i]
      break;
    }
    if (menuItems[i].children && menuItems[i].children.length) {
      getMenu(menuItems[i].children, newItem, accessCodeArr);
    }
  }
  return newItem;
}

// 遍历树(部分树结构使用)
const getTree = (initArr:any, newArr:any) => {
  if (initArr) {
    for (var i in initArr) {
      if (initArr[i].meta.keepAlive) {
        newArr.push(initArr[i].name)
      }
      if (initArr[i].children && initArr[i].children.length) {
        getTree(initArr[i].children, newArr);
      }
    }
    return newArr;
  }
}

const getKeepAliveNameArr = () => {
  let newArr:any = [];
  getTree(menuRouter,newArr)
  commit('global/setKeepAliveName', newArr)
}

const getRSAFn = () => {
  ServiceApi.getRSA({}).then((res:any) => {
    console.log('res: ', res)
    Cookies.set('KeyStr', res.data.KeyStr)
    Cookies.set('rasStr', res.data.rasStr)
  }).catch((e) => {})
}

onMounted(() => {
  storage.clearAll()
  commit('tabs/delAllTab')
  getRSAFn()
});
</script>