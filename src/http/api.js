import { http } from "./http";
import {Message} from 'element-ui'

//登陆方法
export function login(data){
    // return 返回成功的数据 / 请求的方法数据不更新的时候可以不加return。如PUT方法
    return http('login','POST',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg + res.data.username
        })
        return res.data
    })
}
//获取左侧权限列表
export function getMenus(){
    return http('menus','GET').then(res=>{
        return res.data
    })
}
//获取用户列表
export function getUsers(params){
    return http('users','GET',{},params).then(res=>{
        return res.data
    })
}
// 添加用户
export function getaddUsers(data){
    return http('users','POST',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 修改用户状态
export function getstateUsers(id,val){
    return http(`users/${id}/state/${val}`,'PUT').then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 编辑用户
export function geteditUsers(id,data){
    return http(`users/${id}`,'PUT',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 删除用户
export function getdeleteUsers(id){
    return http(`users/${id}`,'DELETE').then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 获取角色id
export function getRID(id){
    return http(`users/${id}`,'GET').then(res=>{
        return res.data
    })
}
// 分配角色
export function getdistribution(id,rid){
    return http(`users/${id}/role`,'PUT',{rid}).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
//获取角色列表
export function getRoles(){
    return http('roles','GET').then(res=>{
        return res.data
    })
}
// 添加角色
export function getaddRoles(data){
    return http('roles','POST',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 编辑角色
export function geteditRoles(id,data){
    return http(`roles/${id}`,'PUT',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 删除角色
export function getdeleteRoles(id){
    return http(`roles/${id}`,'DELETE',).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 获取分配角色权限数据
export function getdistributionRoles(){
    return http('rights/tree','GET',).then(res=>{
        return res.data
    })
}
// 角色授权
export function getdistributionRolesFn(id,rids){
    return http(`roles/${id}/rights`,'POST',{rids}).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 删除角色权限
export function getdeleteRolesFn(roleId,rightId){
    return http(`roles/${roleId}/rights/${rightId}`,'DELETE').then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
//获取权限列表
export function getrights(){
    return http('rights/list','GET').then(res=>{
        return res.data
    })
}
//获取商品列表
export function getgoods(params){
    return http('goods','GET',{},params).then(res=>{
        return res.data
    })
}
// 添加商品
export function getAddGoods(data){
    return http('goods','POST',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 根据id查询商品详情，获取到商品参数
export function getEditIdGoods(id){
    return http(`goods/${id}`,'GET').then(res=>{
        return res.data
    })
}
// 商品编辑
export function geteditgoods(id,data){
    return http(`goods/${id}`,'PUT',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 删除商品
export function getdeletegoods(id){
    return http(`goods/${id}`,'DELETE').then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 获取分类参数列表数据
export function getparametergoods(id,params){
    return http(`categories/${id}/attributes`,'GET',{},{sel:params}).then(res=>{
        return res.data
    })
}
// 添加动态参数/静态参数
export function getAddParameter(id,data){
    return http(`categories/${id}/attributes`,'POST',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 编辑动态参数
export function getEditParameter(id,attrId,data){
    return http(`categories/${id}/attributes/${attrId}`,'PUT',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 删除动态参数
export function getDeleteParameter(id,attrId){
    return http(`categories/${id}/attributes/${attrId}`,'DELETE').then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 获取商品分类数据
export function getcategories(params){
    return http('categories','GET',{},params).then(res=>{
        return res.data
    })
}
// 添加商品分类数据
export function getAddCategories(data){
    return http('categories','POST',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 编辑商品分类
export function getEditCategories(id,data){
    return http(`categories/${id}`,'PUT',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 删除商品分类
export function getDeleteCategories(id){
    return http(`categories/${id}`,'DELETE').then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
//获取订单列表数据
export function getorders(params){
    return http('orders','GET',{},params).then(res=>{
        return res.data
    })
}
// 编辑订单列表数据
export function getEditOrders(id,data){
    return http(`orders/${id}`,'PUT',data).then(res=>{
        Message({
            showClose:true,
            type:'success',
            message:res.meta.msg
        })
        return res.data
    })
}
// 获取数据统计
export function getreports(){
    return http('reports/type/1','GET').then(res=>{
        return res.data
    })
}