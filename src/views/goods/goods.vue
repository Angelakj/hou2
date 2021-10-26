<template>
  <div class="goods-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-boyd-add">
      <el-input v-model="page.query" class="input-with-select" placeholder="请输入内容">
        <el-button slot="append" icon="el-icon-search" @click="goodsSousu"></el-button>
      </el-input>
      <el-button type="primary" @click="addItem">添加商品</el-button>
    </div>

    <div class="goods-body-metat">
      <div class="goods-body-table">
        <el-table :data="tableData" border>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="88px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="105"></el-table-column>
          <el-table-column
            prop="add_time"
            label="创建日期"
            width="105"
            :formatter="dateFormat"
          >
          </el-table-column>
          <el-table-column prop="address" label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain circle @click="editItemClick(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteItemClick(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-body-paging">
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="page.pagenum"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="page.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 编辑商品 弹出框-->
      <el-dialog
        title="编辑商品"
        :visible.sync="editItemVisible"
        width="600px"
      >
        <el-form
          :model="editItemFrom"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editItemFrom.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editItemFrom.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editItemFrom.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editItemFrom.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品参数" prop="goods_cat">
            <el-input v-model="editItemFrom.goods_cat"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addeditItem">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getgoods,geteditgoods,getdeletegoods,getEditIdGoods} from "../../http/api";
import dayjs from "dayjs";
export default {
  data() {
    return {
      tableData: [],
      page: {
        pagenum: Number(this.$route.query.pagenum) || 1,
        pagesize:  Number(this.$route.query.pagesize) || 10,
        query:this.$route.query.query
      },
      total:0,
      date: "",
      editItemVisible:false,
      editItemFrom:{
        id:'',
        goods_name:'',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_cat:""
      },
      rules:{
        goods_name: [
          { required: true, message: "请输入商品名", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品参数", trigger: "blur" },
        ],
      }
    };
  },
  methods: {
    // 设置页数
    handleCurrentChange(pagenum) {
      this.page.pagenum = pagenum;
      this.$router.push({
        query:Object.assign({},this.$route.query,{
          pagenum:this.page.pagenum
        })
      })
      this.getgoods()
    },
    // 设置条数显示页
    handleSizeChange(pagesize) {
      this.page.pagesize=pagesize;
      this.$router.push({
        query:Object.assign({},this.$route.query,{
          pagesize:this.page.pagesize
        })
      })
      this.getgoods()
    },
    // 搜索
    goodsSousu(){
      this.$router.push({
        query:Object.assign({},this.$route.query,{
          query:this.page.query
        })
      })
      this.getgoods()
    },
    // 编辑用户 弹出框
    async editItemClick(obj){
      // console.log(obj);
      this.editItemFrom = {...obj};
      this.editItemFrom.id = obj.goods_id;

      const res = await getEditIdGoods(obj.goods_id);
      this.editItemFrom.goods_cat = res.goods_cat;

      this.editItemVisible = true;
    },
    // 编辑用户 提交
    async addeditItem(){
      let {id,goods_name,goods_price,goods_number,goods_weight,goods_cat} = this.editItemFrom;
      
      let res = await geteditgoods(id,{goods_name,goods_price,goods_number,goods_weight,goods_cat});
      // console.log(res)
      this.editItemVisible = false;
      this.getgoods()
    },
    //删除商品
    async deleteItemClick(id){
      await getdeletegoods(id)
      this.getgoods()
    },
    // 添加商品
    addItem(){
      this.$router.push({
        name:'addshop'
      })
    },
    // 转换时间戳
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format("YYYY-MM-DD");
    },
    getgoods() {
      getgoods(this.page).then((res) => {
        // console.log(res);
        this.tableData = res.goods;
        this.total = res.total
      });
    },
  },
  created() {
    this.getgoods();
    this.date = dayjs;
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/goods.scss";
</style>