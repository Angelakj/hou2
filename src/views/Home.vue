<template>
  <div class="home">
    <!-- 主页 -->
    <el-container>
      <el-aside width="auto">
        <el-col :span="24">
          <h5 class="h3" v-show="!isCode">电商管理系统</h5>
          <div class="mg" v-show="isCode">
            <img src="../assets/img/logo.365f729e.jpg" alt="" />
          </div>
          <el-menu
            default-active="2"
            background-color="rgb(0,21,41)"
            text-color="#999"
            active-text-color="#ccc"
            class="el-menu-vertical-demo"
            :collapse="isCode"
            :unique-opened="true"
            :router="true"
            :default-active="defaultActive"
          >
            <el-submenu
              :index="item.path + ''"
              v-for="item in menus"
              :key="item.id"
            >
              <template slot="title">
                <i v-if="item.path == 'users'" class="el-icon-user-solid"></i>
                <i v-if="item.path == 'rights'" class="el-icon-more"></i>
                <i v-if="item.path == 'goods'" class="el-icon-s-goods"></i>
                <i v-if="item.path == 'orders'" class="el-icon-s-order"></i>
                <i v-if="item.path == 'reports'" class="el-icon-s-data"></i>
                <span class="yongh">
                  {{ item.authName }}
                </span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="_item in item.children"
                  :index="'/Home/' + _item.path"
                  :key="_item.id"
                  >{{ _item.authName }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <el-header>
          <i
            class="el-icon-s-fold header-left"
            v-show="!isCode"
            @click="jusss"
          ></i>
          <i
            class="el-icon-s-unfold header-left"
            v-show="isCode"
            @click="jusss"
          ></i>
          <div class="header-center">
            <el-tooltip placement="bottom" effect="light">
              <div slot="content" @click="goToRout()">退出</div>
              <span class="el-icon-setting el-dropdown-selfdefine"></span>
            </el-tooltip>
          </div>
          <span class="header-right">{{ $store.state.username }}</span>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenus } from "../http/api";
export default {
  name: "Home",
  data() {
    return {
      isCode: true,
      input3: "",
      tableData: [],
      menus:[]
    };
  },
  methods: {
    jusss() {
      this.isCode = !this.isCode;
    },
    goToRout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.$store.commit("clearUsername");
      this.$router.push({
        name: "Login",
      });
    },
    getMenus() {
      getMenus().then((res) => {
        this.menus = res;
      });
    },
  },
  computed:{
    defaultActive(){
      if(this.$route.path == '/Home/addshop'){
        return '/Home/goods'
      }else{
        return this.$route.path;
      }
    }
  },
  // created是进入页面就请求数据
  created() {
    this.getMenus();
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/scss/Home.scss";
</style>