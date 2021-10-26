<template>
  <div class="reports-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="reports-body-aaa">
      <div id="main" style="width: 1000px; height: 600px"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import _ from 'lodash'
import { getreports } from "../../http/api";
export default {
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    const res = await getreports();
    const newoptions = _.merge(res,this.options);
    //初始化echarts
    let myChart = echarts.init(document.getElementById("main"));
    myChart.setOption(newoptions);
  },
};
</script>
<style lang="scss" scoped>
.reports-body {
  width: 97%;
  height: 590px;
  #main {
    width: 100%;
    height: 551px;
    padding: 20px;
    // background-color: red;
  }
}
</style>