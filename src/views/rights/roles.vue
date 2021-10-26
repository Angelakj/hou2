<template>
  <div class="roles-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" plain style="margin:10px 0;" @click="addrolesVisible=true">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%" ref="abc" border @expand-change="expandChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="item in props.row.children" :key="item.id">
            <!-- 渲染一级权限 -->
            <el-col :span="5" style="text-align:center;">
              <el-tag closable @close="getdeleteRolesFn(props.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 渲染二，三级权限 -->
            <el-col :span="19">
              <el-row v-for="item1 in item.children" :key="item1.id">
                <!-- 二级权限 -->
                <el-col :span="6">
                  <el-tag type="success" closable @close="getdeleteRolesFn(props.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag type="warning" closable @close="getdeleteRolesFn(props.row,item2.id)" v-for="item2 in item1.children" :key="item2.id">
                    {{item2.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="props.row.children.length==0">暂无权限</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column prop="operation" label="操作" width="190">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain circle @click="editRoles(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteRoles(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain circle @click="treeRoles(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色 弹出框 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addrolesVisible"
      width="600px"
    >
      <el-form
        :model="addrolesForm"
        :rules="roles"
        ref="rolesForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addrolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 弹出框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editrolesVisible"
      width="600px"
    >
      <el-form
        :model="editrolesForm"
        :rules="roles"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户id" prop="roleName">
          <el-input v-model="editrolesForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editrolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editrolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="distributionrolesVisible" width="600px" @close="heandClose">
      <el-tree
        :data="distribution"
        show-checkbox
        node-key="id"
        ref="treeRef"
        :default-expanded-keys="defaultCheckedkeys"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionrolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="daltte">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getRoles,getaddRoles,geteditRoles,getdeleteRoles,getdistributionRoles,getdistributionRolesFn,getdeleteRolesFn} from '../../http/api'
export default {
    data() {
      return {
        tableData: [],
        addrolesVisible:false,
        addrolesForm:{
          roleName:'',
          roleDesc:''
        },
        editrolesVisible:false,
        editrolesForm:{
          id:'',
          roleName:'',
          roleDesc:''
        },
        roles:{
          roleName: [
            { required: true, message: "请输入角色名", trigger: "blur" },
          ],
          roleDesc: [
            { required: true, message: "请输入角色描述", trigger: "blur" },
          ],
        },
        distributionrolesVisible:false,
        // 接收请求的数据
        distribution:[],
        defaultProps:{
          children:'children',
          label:'authName'
        },
        // 默认选中的节点ID值数组
        defaultCheckedkeys:[],
        roleId:'',
        arr:[]
      }
    },
    methods:{
      // 添加角色
      addRoles(){
        this.$refs.rolesForm.validate(async val=>{
          if(val){
              await getaddRoles(this.addrolesForm);
              this.$refs.ruleForm.resetFields();
              this.addrolesVisible = false;
              this.getRolesFn();
          }
        })
      },
      // 编辑角色 显示弹出框内容
      editRoles(obj){
        let {id,roleName,roleDesc} = obj;
        this.editrolesForm.id = id;
        this.editrolesForm.roleName = roleName;
        this.editrolesForm.roleDesc = roleDesc;
        console.log(obj);
        this.editrolesVisible = true;
      },
      // 编辑角色 提交
      async editRolesSubmit(){
        let {id,roleName,roleDesc} = this.editrolesForm;
        await geteditRoles(id,{roleName,roleDesc});
        this.getRolesFn();
        this.editrolesVisible = false;
      },
      // 删除角色
      async deleteRoles(id){
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then( async () => {
          await getdeleteRoles(id)
          this.getRolesFn()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      },
      // 获取权限列表
      async treeRoles(obj){
        const res = await getdistributionRoles();
        this.distributionrolesVisible = true;
        this.distribution = res;
        this.roleId = obj.id;

        this.$nextTick(()=>{
          this.arr = [];
          this.deepForm(obj.children)
          this.$refs.treeRef.setCheckedNodes(this.arr);
          this.defaultCheckedkeys = this.$refs.treeRef.getCheckedKeys()
        }) 
      },
      // 递归
      deepForm(array){
        for(let i in array){
          let data = array[i];
          if(data.children){
            this.deepForm(data.children)
          }else{
            this.arr.push(data)
          }
        }
      },
      // 分配角色弹出框关闭时 清空
      heandClose(){
        this.defaultCheckedkeys = [];
        this.distribution = []
      },
      // 角色授权
      async daltte(){
        let arr = [];
        let nodes = this.$refs.treeRef.getCheckedNodes(false,true)
        nodes.map(item=>{
          arr.push(item.id)
        })
        await getdistributionRolesFn(this.roleId,arr.join(','));
        this.distributionrolesVisible = false;
        this.getRolesFn()
      },
      // 删除角色权限
      async getdeleteRolesFn(role,rightId){
       const res = await getdeleteRolesFn(role.id,rightId)
       role.children = res
      },
      expandChange(row,expandedRows){
        if(expandedRows.length>1){
          this.$refs.abc.toggleRowExpansion(expandedRows[0],false)
        }
      },
      getRolesFn(){
        getRoles().then(res=>{
            // console.log(res);
            this.tableData = res;
        })
      }
    },
    created(){
        this.getRolesFn();
    }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/roles.scss";
</style>