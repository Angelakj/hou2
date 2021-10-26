<template>
  <div class="login">
    <div class="box-crad">
      <div class="box-card-hard">
        <h4>欢迎登陆</h4>
      </div>
      <div class="box-card-bottom">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="login" class="demo-ruleForm">
          <el-form-item prop="username">
            <div class="iconfont icon-yonghu userlcon"></div>
            <el-input placeholder="请输入用户名" v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <div class="iconfont icon-jiesuo userlcon"></div>
            <el-input placeholder="请输入密码" v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" @click="land">登陆</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {login} from '../http/api'
export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password:"123456"
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ]
      },
    };
  },
  methods:{
    land(){
      this.$refs['login'].validate((valid)=>{
        // console.log(valid)
        if(valid){
          // axios.post('http://localhost:8889/api/private/v1/login',this.ruleForm).then(res=>{
          //   console.log(res)
          //   if(res.status == 200){
          //       // console.log('请求成功')
          //       if(res.data.meta.status == 200){
          //         this.$message({
          //           message: res.data.meta.msg,
          //           type: 'success'
          //         });
          //         this.$router.push('/Home')
          //         console.log(res.data.data.token)
          //         this.$store.commit('SET_tokey',res.data.data.token);
          //         this.$store.commit('SET_username',res.data.data.username)
          //       }else{
          //         this.$message.error(res.data.meta.msg);
          //       }
          //   }else{
          //         this.$message.error(res.statusText);
          //   }
          // })
          login(this.ruleForm).then(res=>{
              this.$store.commit('SET_tokey',res.token);
              this.$store.commit('SET_username',res.username)
              this.$router.push('/Home/Users')
          })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/scss/login.scss";
</style>