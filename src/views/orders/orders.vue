<template>
  <div class="orders-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb> 
    <div class="orders-body-table">
      <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="280">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="name" label="是否付款" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send=='否'" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.is_send=='是'">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="150">
        </el-table-column>
        <el-table-column prop="create_time" label="创建日期" :formatter="dateFormat" width="180">
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain circle @click="editOrdersClick(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pagenum"
          :page-sizes="[1,3, 5, 10]"
          :page-size="page.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
      </el-pagination>
    </div>  
    <!-- 编辑订单 弹出框 -->
    <el-dialog title="添加分类" :visible.sync="editOrdersVisible" width="450px">
        <el-form :model="editOrdersFrom" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="是否发货" prop="cat_name">
            <el-select v-model="editOrdersFrom.is_send">
              <el-option
                v-for="item in options.is_send"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单支付" prop="cat_name" >
            <el-select v-model="editOrdersFrom.order_pay">
              <el-option
                v-for="item in options.order_pay"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单价格" prop="order_price" >
            <el-input v-model="editOrdersFrom.order_price"></el-input>
          </el-form-item>
          <el-form-item label="订单数量" prop="order_number" >
            <el-input v-model="editOrdersFrom.order_number"></el-input>
          </el-form-item>
          <el-form-item label="支付状态" prop="cat_name">
            <el-select v-model="editOrdersFrom.pay_status">
              <el-option
                v-for="item in options.pay_status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editOrdersSubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {getorders,getEditOrders} from '../../http/api'
import dayjs from 'dayjs';
export default {
  data() {
    return {
      tableData: [],
      page: {
        pagenum: Number(this.$route.query.pagenum) || 1,
        pagesize: Number(this.$route.query.pagesize) || 5,
      },
      date:'',
      total:0,
      editOrdersVisible:false,
      editOrdersFrom:{
        order_id:'',
        is_send:'',
        order_pay:'',
        order_price:'',
        order_number:'',
        pay_status:''
      },
      options:{
        is_send:[
          {
            value:'否',
            label:'未发货'
          },
          {
            value:'是',
            label:'已发货'
          }
        ],
        order_pay:[
          {
            value:'0',
            label:'未支付'
          },
          {
            value:'1',
            label:'支付宝'
          },
          {
            value:'2',
            label:'微信'
          },
          {
            value:'3',
            label:'银行卡'
          },
        ],
        pay_status:[
          {
            value:'0',
            label:'未付款'
          },
          {
            value:'1',
            label:'已付款'
          }
        ]
      },
      // 验证规则
      rules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        order_price:[
          { required: true, message: '请输入单价', trigger: 'blur' },
        ],
        order_number:[
          { required: true, message: '请输入重量', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    // 设置条数
    handleSizeChange(pagesize) {
      // console.log(pagesize);
      this.page.pagesize = pagesize;
      this.$router.push({
        query:Object.assign({},this.$route.query,{
          pagesize:this.page.pagesize
        })
      })
      this.getorders()
    },
    // 设置页数
    handleCurrentChange(pagenum) {
      console.log(pagenum);
      this.page.pagenum = pagenum;
      this.$router.push({
        query:Object.assign({},this.$route.query,{
          pagenum:this.page.pagenum
        })
      })
      this.getorders()
    },
    // 编辑订单数据 回显
    editOrdersClick(obj){
      // console.log(obj)
      this.editOrdersFrom = {...obj};
      // console.log(this.editOrdersFrom)
      this.editOrdersVisible = true;
    },
    // 编辑订单数据 提交
    async editOrdersSubmit(){
      let {order_id,is_send,order_pay,order_price,order_number,pay_status} = this.editOrdersFrom;
      // console.log(is_send);
      const res = await getEditOrders(order_id,{is_send,order_pay,order_price,order_number,pay_status});
      // console.log(res);
      this.editOrdersVisible = false;
      this.getorders();
    },
    // 处理时间戳
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },
    // 请求订单列表数据
    getorders(){
      getorders(this.page).then(res=>{
        this.tableData = res.goods;
        this.total = res.total;
      })
    }
  },
  created(){
    this.getorders()
    this.date = dayjs;
  }
};
</script>
<style lang="scss" scoped>
.orders-body {
  width: 97%;
  height: 610px;
  background: #fff;
  padding: 20px;
  .orders-body-table{
      height: calc(100vh - 160px);
      overflow-x: auto;
  }
  ::v-deep{
    .el-dialog{
      height: auto;
    }
  }
}
</style>