<template>
  <div class="roles-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column label="权限名称" prop="authName"> </el-table-column>
      <el-table-column label="路径" prop="path"> </el-table-column>
      <el-table-column prop="level" label="层级" width="190">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level=='0'" type="success">一级</el-tag>
          <el-tag v-if="scope.row.level=='1'" type="info">二级</el-tag>
          <el-tag v-if="scope.row.level=='2'" type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getrights} from '../../http/api'
export default {
    data() {
      return {
        tableData: []
      }
    },
    methods:{
        getrights(){
            getrights().then(res=>{
                console.log(res)
                this.tableData = res
            })
        }
    },
    created(){
        this.getrights()
    }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/roles.scss";
</style>