<template>
    <div class="addshop-body">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-steps :active="Number(activeIndex)" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <el-form :model="basicFrom" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top">
            <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeLeave">
                <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="basicFrom.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="basicFrom.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="basicFrom.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="basicFrom.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader v-model="basicFrom.goods_cat" :options="addOptions" :props="addCatParas" @change="handleChange"></el-cascader>
                        </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item v-for="item in manyArrDate" :key="item.attr_id" :label="item.attr_name">
                         <el-checkbox :model="item.attr_vals.split(',')" v-for="(val,i) in item.attr_vals.split(',')" :key="i" :label="val" :checked="true" border></el-checkbox>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item v-for="item in onlyArrDate" :key="item.attr_id" :label="item.attr_name">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                        class="upload-demo"
                        action="http://localhost:8889/api/private/v1/upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="updale"
                        :headers="head"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor class="editor"></quill-editor>
                    <el-button @click="addClick">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <!-- <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
            <img :src="preVisibleUrl" alt="">
        </el-dialog> -->
    </div>
</template>
<script>
import {getcategories,getparametergoods,getAddGoods} from '../../http/api'
export default {
    data(){
        return{
            // 验证规则
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
            },
            basicFrom:{
                goods_name:'',
                goods_price:'',
                goods_number:'',
                goods_weight:'',
                goods_cat:[],
                pics:[],
                attrs:[]
            },
            activeIndex:'0',
            addOptions:[],
            addCatParas:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            manyArrDate:[],
            onlyArrDate:[],
            head:{
                Authorization:this.$store.state.token
            },
            dialogVisible:false,
            preVisibleUrl:''
        }
    },
    methods:{
        // 请求下拉列表的数据
        async getcategories(){
            const res = await getcategories();
            this.addOptions = res
        },
        // 选中下拉列表时触发
        handleChange(){
            // console.log(this.basicFrom.goods_cat)
        },
        // 当切换下一个tabs选项时触发
        async beforeLeave(newname,oldname){
            if(oldname == 0 || oldname == 1 || oldname == 2){
                if(this.basicFrom.goods_cat.length !== 3){
                    this.$message('请选择三级分类')
                }
            }

            if(newname == 1){
                if(this.basicFrom.goods_cat.length == 3){
                    let goods_catid = this.basicFrom.goods_cat[this.basicFrom.goods_cat.length-1];
                    const res = await getparametergoods(goods_catid,"many");
                    // console.log(res);
                    this.manyArrDate = res;
                }
            }else if(newname == 2){
                if(this.basicFrom.goods_cat.length == 3){
                    let goods_catid = this.basicFrom.goods_cat[this.basicFrom.goods_cat.length-1];
                    const res = await getparametergoods(goods_catid,"only");
                    // console.log(res);
                    this.onlyArrDate = res;
                }
            }
        },
        // 删除图片的钩子函数
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        // 预览图片的钩子函数
        handlePreview(file) {
            this.preVisibleUrl = file.response.data.url.replace('localhost','localhost:8889');
            console.log(this.preVisibleUrl);
            this.dialogVisible = true;
        },
        // 图片上传成功
        updale(file){
            this.basicFrom.pics.push({pic:file.data.tmp_path});
        },
        // 添加商品
        addClick(){
            this.$refs.ruleForm.validate(async val=>{
                if(val){
                    if(this.basicFrom.goods_cat.length == 3){
                        // 处理goods_cat参数 将数组转换成字符串
                        this.basicFrom.goods_cat = this.basicFrom.goods_cat.join(',');
                        await getAddGoods(this.basicFrom);
                        this.$router.push({name:'goods'});
                    }
                }else{
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    });
                }
            })
        }
    },
    created(){
        this.getcategories()
    }
}
</script>
<style lang="scss" scoped>
.addshop-body{
    width: 97%;
    height: 610px;
    background: #fff;
    padding: 20px;
}
.el-steps--horizontal{
    margin-top: 35px;
}
.el-form{
    height: 490px;
    overflow-y: scroll;
}
.editor{
    height: 370px;
}
.el-button{
    margin-top: 70px;
}
</style>