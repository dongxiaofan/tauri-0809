import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import storage from 'store';
import store from '@/store'
import { message, notification } from 'ant-design-vue';
import {JSEncrypt} from 'jsencrypt';
const encrypt = new JSEncrypt();
const VITE_MODE_ENV = import.meta.env.VITE_MODE_ENV;
const VITE_REQUEST_BASE_URL = import.meta.env.VITE_REQUEST_BASE_URL;
// 创建axios实例
const http = axios.create({
  baseURL: VITE_MODE_ENV == 'dev' ? '/' : VITE_REQUEST_BASE_URL
})

// 异常提示
const errorHandler = (error) => {
  const { response } = error;
  console.log('error: ', error)
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    console.log('response: ', response)
    if ([401, 403].indexOf(status) !== -1) {
      store.dispatch('global/handleTokenExpiration', true)
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    } else {
      notification.error({
        message: `请求错误 ${status}`,
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// request请求拦截
http.interceptors.request.use(config => {
  //判断token是否存在，存在则向请求头添加token信息
  if (Cookies.get('token')) {
    config.headers['Authorization'] = 'Bearer ' + Cookies.get('token') || ''
  }
  // config.headers['Authorization'] = 'Bearer ' + Cookies.get('token') || ''    
  return config
}, errorHandler)

// response响应拦截
http.interceptors.response.use(res => {
  return res.data
}, errorHandler)

export default http