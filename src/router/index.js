import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../computens/Login.vue'
import store from '../store'
Vue.use(VueRouter)

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
const routes = [
  {
    path:'/',
    redirect:'/Home/Users'
  },
  {
    path:'/Login',
    name:'Login',
    component:Login
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children:[
      {
        path:'Users',
        name:'Users',
        component: () => import(/* webpackChunkName: "users" */ '../views/users/Users.vue')
      },
      {
        path:'rights',
        name:'rights',
        component: () => import(/* webpackChunkName: "users" */ '../views/rights/rights.vue')
      },
      {
        path:'roles',
        name:'roles',
        component: () => import(/* webpackChunkName: "users" */ '../views/rights/roles.vue')
      },
      {
        path:'goods',
        name:'goods',
        component: () => import(/* webpackChunkName: "users" */ '../views/goods/goods.vue')
      },
      {
        path:'params',
        name:'params',
        component: () => import(/* webpackChunkName: "users" */ '../views/goods/params.vue')
      },
      {
        path:'categories',
        name:'categories',
        component: () => import(/* webpackChunkName: "users" */ '../views/goods/categories.vue')
      },
      {
        path:'addshop',
        name:'addshop',
        component: () => import(/* webpackChunkName: "users" */ '../views/goods/addshop.vue')
      },
      {
        path:'orders',
        name:'orders',
        component: () => import(/* webpackChunkName: "users" */ '../views/orders/orders.vue')
      },
      {
        path:'reports',
        name:'reports',
        component: () => import(/* webpackChunkName: "users" */ '../views/reports/reports.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if(!store.state.token && !to.name=='/Login'){
    next('/Login');
    return;
  }
  next()
})

export default router