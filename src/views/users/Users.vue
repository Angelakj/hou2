<template>
  <div class="main-body">
    <div class="main-boyd-top01">
      <el-link :underline="false"><b>首页</b></el-link> / 用户管理 / 用户列表
    </div>
    <div class="main-boyd-add">
      <el-input v-model="page.query" class="input-with-select" clearable @clear="search" @keyup.enter.native="search">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="primary" @click="addDialog">添加用户</el-button>
    </div>
    <div class="main-body-from">
      <el-table height="470px" :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建日期"
          width="200"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column label="用户状态" width="190">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="Lstate($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="190">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="editUsers(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="deleteFrom(scope.row.id)"
            ></el-button>
            <el-button type="success" icon="el-icon-check" circle plain @click="distribution(scope.row)"></el-button>
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
          :page-sizes="[2, 4, 6, 9]"
          :page-size="page.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible"
      width="600px"
      @close="addDialogClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible" width="600px">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSumbit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色 -->
    <el-dialog title="分配角色" :visible.sync="distributionFormVisible" width="600px">
      <el-form
        :model="distributionForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="distributionForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="distributionForm.rid" placeholder="请选择">
            <el-option label="请选择" :value="-1" :disabled="true"></el-option> 
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUsers,
  getaddUsers,
  getstateUsers,
  geteditUsers,
  getdeleteUsers,
  getRID,
  getRoles,
  getdistribution
} from "../../http/api";
import dayjs from "dayjs";
export default {
  name: "Home",
  data() {
    return {
      isCode: false,
      tableData: [],
      value: true,
      date: "",
      page: {
        query: this.$route.query.query,
        pagenum: Number(this.$route.query.pagenum) || 1,
        pagesize: Number(this.$route.query.pagesize) || 9,
      },
      total: 0,
      dialogVisible: false,
      editFormVisible: false,
      ruleForm: {
        username: "",
        password: "",
        mobile: "",
        email: "",
      },
      editForm: {
        username: "",
        mobile: "",
        email: "",
        id: 0,
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: false, trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      bySerach: false,
      distributionFormVisible:false,
      distributionForm:{
        id:0,
        username:'',
        rid:0
      },
      options:[]
    };
  },
  methods: {
    jusss() {
      this.isCode = !this.isCode;
    },
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    // 修改用户状态
    async Lstate(state, scope) {
      const res = await getstateUsers(scope.id, state);
    },
    // 设置页数
    handleCurrentChange(pagenum) {
      this.page.pagenum = pagenum;
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          pagenum: this.page.pagenum,
        }),
      });
      this.getUsers();
    },
    // 设置条数
    handleSizeChange(pagesize) {
      this.page.pagesize = pagesize;
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          pagesize: this.page.pagesize,
        }),
      });
      this.getUsers();
    },
    // 退出
    goToRout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.$store.commit("clearUsername");
      this.$router.push({
        name: "Login",
      });
    },
    // 搜索
    search() {
      this.bySerach = true;
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          query: this.page.query,
        }),
      });
      this.getUsers();
    },
    // 控制是否弹出添加用户的对话框
    addDialog() {
      this.dialogVisible = true;
    },
    // 添加用户的对话框关闭重置
    addDialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 添加新用户
    addUsers() {
      this.$refs.ruleForm.validate(async (val) => {
        if (val) {
          const res = await getaddUsers(this.ruleForm);
          this.$refs.ruleForm.resetFields();
          this.dialogVisible = false;
          this.getUsers();
        }
      });
    },
    // 编辑用户 弹出框内容
    editUsers(obj) {
      this.editFormVisible = true;
      this.editForm = { ...obj };
      console.log(this.editForm)
    },
    // 编辑用户 提交
    async editSumbit() {
      let { id, mobile, email } = this.editForm;
      this.editFormVisible = false;
      await geteditUsers(id, { mobile, email });
      this.getUsers();
    },
    // 删除用户
    deleteFrom(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then( async () => {
          await getdeleteUsers(id);
          this.getUsers()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配用户角色 弹出框内容
    async distribution(obj){
      this.distributionFormVisible=true;
      let {id,username} = obj;

      const {rid} = await getRID(id);
      this.distributionForm.username = username;
      this.distributionForm.id = id;
      this.distributionForm.rid = rid;

      const res = await getRoles();
      console.log(res)
      this.options = res
    },
    // 分配角色
    async distributionFn(){  
      const {id,rid} = this.distributionForm
      await getdistribution(id,rid);
      this.distributionFormVisible = false;
      this.getUsers()
    },
    async getUsers() {
      if (this.bySerach) {
        let res = await getUsers(this.page);
        this.tableData = res.users;
        this.total = res.total;
      } else {
        let { pagenum, pagesize } = this.page;
        let res = await getUsers({
          pagenum,
          pagesize,
        });
        this.tableData = res.users;
        this.total = res.total;
      }
      // let res = await getUsers(this.page);
      // this.tableData = res.users;
      // this.total = res.total;
    },
  },
  created(){
    if (this.$route.query.query) {
      this.search();
    } else {
      this.getUsers();
    }
    // this.getUsers()
    this.date = dayjs;
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/Home.scss";
</style> 