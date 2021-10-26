<template>
  <div class="params-body">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="注意:只允许为第三级分类设置参数"
      type="warning"
      show-icon
    ></el-alert>
    <div class="block">
      <span class="demonstration">请选择商品分类</span>
      <el-cascader
        v-model="setKeyanome"
        :options="options"
        :props="catParas"
        @change="handleChange"
      ></el-cascader>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :circle="false" @click="juage">设置动态参数</el-button>
        <el-table
          :data="manyArr"
          style="width: 100%"
          height="400px"
          @expand-change="handCccc"
          ref="abc"
        >
          <el-table-column type="expand">
            <!-- {{manyTagArr}} -->
            <template slot-scope="scope">
              <el-tag closable style="margin-left: 10px" v-for="tag in scope.row.attr_vals.split(',')" :key="tag" @close="deleteAttr_vals(tag, scope.row)">{{ tag }}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" width="20px"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain circle @click="editParams(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain circle @click="deleteFrom(scope.row.cat_id, scope.row.attr_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" :circle="false" @click="juage"
          >设置静态参数</el-button
        >
        <el-table :data="onlyArr" style="width: 100%" height="400px">
          <el-table-column label="#" width="20px"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                circle
                @click="editParams(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                plain
                circle
                @click="deleteFrom(scope.row.cat_id, scope.row.attr_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加动态参数 -->
    <el-dialog title="添加" :visible.sync="parameterVisible" width="450px">
      <el-form
        :model="parameterFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="说明">
          <el-input v-model="parameterFrom.explain" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="attr_name">
          <el-input v-model="parameterFrom.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性名" prop="attr_vals">
          <el-input v-model="parameterFrom.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addParameter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑动态参数 -->
    <el-dialog title="添加" :visible.sync="editparameterVisible" width="450px">
      <el-form
        :model="editparameterFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="说明">
          <el-input
            :disabled="true"
            placeholder="添加多个已逗号分隔"
          ></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="attr_name">
          <el-input v-model="editparameterFrom.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性名" prop="attr_vals">
          <el-input v-model="editparameterFrom.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmitFrom">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加静态参数 -->
    <el-dialog
      title="添加"
      :visible.sync="staticParameterVisible"
      width="450px"
    >
      <el-form
        :model="staticParameterFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="说明">
          <el-input
            placeholder="添加多个已逗号分隔"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="属性名" prop="attr_name">
          <el-input v-model="staticParameterFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addParameter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑静态参数 -->
    <el-dialog
      title="添加"
      :visible.sync="editStaticParameterVisible"
      width="450px"
    >
      <el-form
        :model="editStaticParameterFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="说明">
          <el-input
            placeholder="添加多个已逗号分隔"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="属性名" prop="attr_name">
          <el-input v-model="editStaticParameterFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmitFrom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getcategories,getparametergoods,getAddParameter,getEditParameter,getDeleteParameter} from "../../http/api";
export default {
  data() {
    return {
      setKeyanome: [],
      options: [],
      activeName: "many",
      catParas: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      manyArr: [],
      onlyArr: [],
      // 添加动态参数
      parameterVisible: false,
      parameterFrom: {
        explain: "添加多个已逗号分隔",
        attr_name: "",
        attr_vals: "",
      },
      // 编辑动态参数
      editparameterVisible: false,
      editparameterFrom: {
        attr_name: "",
        attr_vals: "",
        attr_id: "",
        cat_id: "",
      },
      // 添加静态参数
      staticParameterVisible: false,
      staticParameterFrom: {
        attr_name: "",
      },
      // 编辑静态参数
      editStaticParameterVisible: false,
      editStaticParameterFrom: {
        attr_id: "",
        cat_id: "",
        attr_name: "",
      },
      // 表单验证规则
      rules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
        attr_vals: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      attr_vals: [],
      inputVisible: false,
      inputValue: ''
    };
  },
  methods: {
    // 获取下列列表的数据
    async handleChange() {
      const res = await getparametergoods(
        this.setKeyanome[this.setKeyanome.length - 1],
        this.activeName
      );
      if (this.activeName == "many") {
        this.manyArr = res;
      } else if (this.activeName == "only") {
        this.onlyArr = res;
      }
    },
    // 切换动态参数/静态参数的name值
    handleClick() {
      if (this.setKeyanome.length == 3) {
        this.handleChange();
      }
    },
    // 判断动态参数/静态参数是否有三级分类
    juage() {
      console.log(this.setKeyanome.length);
      if (this.setKeyanome.length !== 3) {
        this.$message("请选择三级分类");
        return false;
      }
      if (this.activeName == "many") {
        this.parameterVisible = true;
      } else if (this.activeName == "only") {
        this.staticParameterVisible = true;
      }
    },
    // 添加动态参数/静态参数
    async addParameter() {
      let catid = this.setKeyanome[this.setKeyanome.length - 1];
      if (this.activeName == "many") {
        let { attr_name, attr_vals } = this.parameterFrom;
        await getAddParameter(catid, {
          attr_name,
          attr_vals,
          attr_sel: this.activeName,
        });
        this.parameterVisible = false;
      } else if (this.activeName == "only") {
        let { attr_name } = this.staticParameterFrom;
        await getAddParameter(catid, { attr_name, attr_sel: this.activeName });
        this.staticParameterVisible = false;
      }

      this.$refs.ruleForm.resetFields();
      this.handleChange();
    },
    // 编辑动态参数/静态参数 回显
    editParams(obj) {
      if (this.activeName == "many") {
        this.editparameterFrom = { ...obj };
        this.editparameterVisible = true;
      } else if (this.activeName == "only") {
        this.editStaticParameterFrom = { ...obj };
        this.editStaticParameterVisible = true;
      }
    },
    // 编辑动态参数/静态参数 提交
    async editSubmitFrom() {
      if (this.activeName == "many") {
        let { attr_id, cat_id, attr_name, attr_vals } = this.editparameterFrom;
        await getEditParameter(cat_id, attr_id, {
          attr_name,
          attr_vals,
          attr_sel: this.activeName,
        });
        this.editparameterVisible = false;
      } else if (this.activeName == "only") {
        let { attr_id, cat_id, attr_name } = this.editStaticParameterFrom;
        console.log(attr_id, cat_id, attr_name);
        await getEditParameter(cat_id, attr_id, {
          attr_name,
          attr_sel: this.activeName,
        });
        this.editStaticParameterVisible = false;
      }
      this.handleChange();
    },
    // 删除动态参数/静态参数
    async deleteFrom(cat_id, attr_id) {
      console.log(cat_id, attr_id);
      await getDeleteParameter(cat_id, attr_id);
      this.handleChange();
    },
    handCccc(obj,expandedRows) {
      this.attr_vals = obj.attr_vals.split(",");
      if(expandedRows.length>1){
        this.$refs.abc.toggleRowExpansion(expandedRows[0],false)
      }
    },
    async deleteAttr_vals(tag, scope) {
      let {attr_name,attr_vals,cat_id,attr_id} = scope;
      let vals = attr_vals.split(',');
      let index = vals.findIndex(item=>item==tag);
      vals.splice(index,1);
      scope.attr_vals = vals.toString();
      await getEditParameter(cat_id,attr_id, {attr_name,attr_vals:scope.attr_vals,attr_sel:'many'});
      // this.handleChange();
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(scope) {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.attr_vals.push(inputValue);
      }
      console.log(this.attr_vals);
      let {attr_name,attr_vals,cat_id,attr_id} = scope;
      scope.attr_vals = this.attr_vals.toString();
      await getEditParameter(cat_id,attr_id,{attr_name,attr_vals:scope.attr_vals,attr_sel: this.activeName,});
      // this.handleChange();
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 请求商品分类的数据
    async getcategories() {
      const res = await getcategories();
      this.options = res;
    },
  },
  created() {
    this.getcategories();
  },
};
</script>
<style lang="scss" scoped>
.params-body {
  width: 97%;
  height: 586px;
  background-color: #fff;
  padding: 25px;
  .el-alert--warning.is-light {
    margin-top: 10px;
  }
  .block {
    margin-top: 10px;
  }
  .el-button--primary {
    line-height: 5px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  ::v-deep {
    .el-dialog {
      height: auto;
    }
  }
}
</style>