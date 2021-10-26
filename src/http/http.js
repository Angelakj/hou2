import axios from 'axios'
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'
const baseURL = 'http://localhost:8889/api/private/v1/';
// 封装接口
const instance = axios.create({
    baseURL
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //设置请求头信息
    if(store.state.token){
        config.headers['Authorization']=store.state.token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if(response.data.meta.msg=="无效token"){
          router.push({
              name:'Login'
          })
    }
    // 请求成功的数据
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export function http(url,method,data,params){
    return new Promise((resolve,reject)=>{
        instance({
            url,
            method,
            data,
            params
        })
        .then(res=>{
            //http请求 状态码
            if(res.status>=200&&res.status<300){
                if(res.data.meta.status>=200&&res.data.meta.status<300){
                    resolve(res.data)
                }else{
                    Message({
                        showClose:true,
                        type:'error',
                        message:res.data.meta.msg
                    })
                    reject(res)
                }
            }else{
                // alert(res.statusText);
                Message({
                    showClose:true,
                    type:'error',
                    message:res.data.meta.msg
                })
                reject(res)
            }
        })
        .catch(error=>{
            Message({
                showClose:true,
                type:'error',
                message:error.msg
            })
            reject(error)
        })
    })
}