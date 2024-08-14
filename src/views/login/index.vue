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
            <a-form-item name="UserName">
              <i class="iconfont icon-user"></i>
              <a-input v-model:value="formLogin.UserName" placeholder="请输入用户名">
              </a-input>
            </a-form-item>
            <a-form-item name="Password">
              <i class="iconfont icon-lock"></i>
              <a-input v-model:value="formLogin.Password" type="password" placeholder="请输入密码">
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

const VITE_MODE_ENV = import.meta.env.VITE_MODE_ENV;
const login_class = import.meta.env.VITE_LOGIN_CLASSNAME
const formRef = ref();
const { commit, dispatch } = useStore()
const loading = ref<boolean>(false)

interface FormLoginType {
  UserName: string;
  Password: string;
}
const formLogin: UnwrapRef<FormLoginType> = reactive({
	TenantId: VITE_MODE_ENV == 'dev' ? "momo" : "anyi",
	UserName: "admin",
  Password: "mmkj201509",
})

const rules = {
  UserName: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  Password: [{ required: true, message: '请输入密码', trigger: 'change' }],
}

const handleSubmit = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false;
  }, 3000);
  formRef.value.validate().then(() => {
      console.log('033333333333333')
    dispatch('user/login', formLogin).then((resp:any) => {
      router.push('home')
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

onMounted(() => {
  storage.clearAll()
  commit('tabs/delAllTab')
});
</script>