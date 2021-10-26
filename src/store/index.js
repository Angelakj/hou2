import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
function intinalState(){
  return {
    token:JSON.parse(localStorage.getItem('token')) || '',
    username:JSON.parse(localStorage.getItem('username')) || ''
  }
}
export default new Vuex.Store({
  state: intinalState(),
  mutations: {
    SET_tokey(state,data){
      state.token = data
      localStorage.setItem('token',JSON.stringify(data))
    },
    SET_username(state,data){
      state.username = data
      localStorage.setItem('username',JSON.stringify(data))
    },
    clearUsername(state){
      Object.assign(state,intinalState())
    }
  },
  actions: {
  },
  modules: {
  }
})