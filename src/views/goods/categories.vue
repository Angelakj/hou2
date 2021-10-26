<template>
  <div class="categories-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addCategoriesVisible=true">添加分类</el-button>
    <div class="categories-body-metat">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand" width="15px">
          <template slot-scope="scope">
            <el-table :data="scope.row.children" style="width:100%" :show-header="false">
              <el-table-column width="30px"></el-table-column>
              <el-table-column type="expand" width="15px">
                  <template slot-scope="scope">
                    <el-table :data="scope.row.children" style="width:100%" :show-header="false">
                      <el-table-column width="60px"></el-table-column>
                      <el-table-column prop="cat_name"></el-table-column>
                      <el-table-column >
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.cat_level == '0'" type="success"
                            >一级</el-tag>
                          <el-tag v-if="scope.row.cat_level == '1'" type="info">二级</el-tag>
                          <el-tag v-if="scope.row.cat_level == '2'" type="warning"
                            >三级</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="cat_deleted">
                        <template slot-scope="scope">
                          <span v-if="!scope.row.cat_deleted">有效</span>
                          <span v-if="scope.row.cat_deleted">无效</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="desc">
                        <template slot-scope="scope">
                          <el-button type="primary" icon="el-icon-edit" plain circle @click="editCategories(scope.row)"></el-button>
                          <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteCategories(scope.row.cat_id)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
              </el-table-column>
              <el-table-column prop="cat_name"></el-table-column>
              <el-table-column >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.cat_level == '0'" type="success"
                    >一级</el-tag>
                  <el-tag v-if="scope.row.cat_level == '1'" type="info">二级</el-tag>
                  <el-tag v-if="scope.row.cat_level == '2'" type="warning"
                    >三级</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="cat_deleted">
                <template slot-scope="scope">
                  <span v-if="!scope.row.cat_deleted">有效</span>
                  <span v-if="scope.row.cat_deleted">无效</span>
                </template>
              </el-table-column>
              <el-table-column prop="desc">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" plain circle @click="editCategories(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteCategories(scope.row.cat_id)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="cat_name"> </el-table-column>
        <el-table-column label="级别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == '0'" type="success"
              >一级</el-tag>
            <el-tag v-if="scope.row.cat_level == '1'" type="info">二级</el-tag>
            <el-tag v-if="scope.row.cat_level == '2'" type="warning"
              >三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <span v-if="!scope.row.cat_deleted">有效</span>
            <span v-if="scope.row.cat_deleted">无效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain circle @click="editCategories(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteCategories(scope.row.cat_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
    <!-- 添加商品分类 弹出框-->
    <el-dialog
        title="添加分类"
        :visible.sync="addCategoriesVisible"
        width="450px"
      >
        <el-form
          :model="addCategoriesFrom"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名" prop="cat_name" >
            <el-input v-model="addCategoriesFrom.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类名">
            <el-cascader v-model="value" :options="options" :props="catPath" @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addCategories">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑商品分类 弹出框 -->
    <el-dialog
        title="添加分类"
        :visible.sync="editCategoriesVisible"
        width="450px"
      >
        <el-form
          :model="editCategoriesFrom"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名" prop="cat_name" >
            <el-input v-model="editCategoriesFrom.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSubmitCategories">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {getcategories,getAddCategories,getEditCategories,getDeleteCategories} from "../../http/api";
export default {
  data() {
    return {
      tableData: [],
      page:{
        pagenum: Number(this.$route.query.pagenum) || 1,
        pagesize: Number(this.$route.query.pagesize) || 3,
      },
      total:0,
      // 下拉列表
      value:[],
      options:[],
      catPath:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 添加商品分类
      addCategoriesVisible:false,
      addCategoriesFrom:{
        cat_id:'',
        cat_name:'',
        cat_level:''
      },
      // 编辑商品分类
      editCategoriesVisible:false,
      editCategoriesFrom:{
        cat_id:'',
        cat_name:'',
      },
      // 验证规则
      rules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
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
      this.getcategories()
    },
    // 设置条数
    handleSizeChange(pagesize) {
      this.page.pagesize=pagesize;
      this.$router.push({
        query:Object.assign({},this.$route.query,{
          pagesize:this.page.pagesize
        })
      })
      this.getcategories()
    },
    // 下拉列表发生变化时触发
    handleChange(){
      // console.log(this.options)
      this.addCategoriesFrom.cat_id = this.value[this.value.length - 1];
      console.log(this.addCategoriesFrom.cat_id);
      this.addCategoriesFrom.cat_level =this.value.length;
    },
    // 添加商品分类
    async addCategories(){
      await getAddCategories(this.addCategoriesFrom);
      this.addCategoriesVisible = false;
      this.getcategories()
    },
    // 编辑商品分类 回显
    editCategories(obj){
      // console.log(obj)
      this.editCategoriesFrom.cat_id = obj.cat_id;
      this.editCategoriesFrom.cat_name = obj.cat_name;
      this.editCategoriesVisible = true;
    },
    // 编辑商品分类 提交
    async editSubmitCategories(){
      let {cat_id,cat_name} = this.editCategoriesFrom;
      await getEditCategories(cat_id,{cat_name});
      this.editCategoriesVisible = false;
      this.getcategories();
    },
    // 删除商品分类
    async deleteCategories(id){
      await getDeleteCategories(id);
      this.getcategories()
    },
    // 获取商品分类的数据
    getcategories() {
      getcategories(this.page).then((res) => {
        this.tableData = res.result;
        this.total = res.total
      });
    },
    // 获取下拉列表的数据
    async getcategoriesTwo(){
     const res = await getcategories({type:2});
    this.options = res
    }
  },
  created() {
    this.getcategories();
    this.getcategoriesTwo()
  },
};
</script>
<style lang="scss" scoped>
.categories-body {
  width: 97%;
  height: 620px;
  background: #fff;
  padding: 20px;
  .el-button--success.is-plain {
    margin-top: 10px;
  }
  .categories-body-metat{
    width: 100%;
    height: 565px;
    overflow-x: auto;
    .main-body-paging{
      margin-top: 10px;
    }
  }
  ::v-deep{
    .el-dialog{
      height: auto;
    }
  }
}
</style>