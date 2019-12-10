<template>
    <div>
        <el-row >
            <el-col :span="4">
                <el-button type="primary" @click="dialogFormVisible = true">添加商品</el-button>
            </el-col>
            <el-col :span="20" class="text-right">
                <el-input style="width:300px" placeholder="请输入内容" v-model="screen.keyWord" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table
        :data="tableData.results"
        style="width: 100%">
           
            <el-table-column
                prop="shopName"
                label="商品名称"
                >
            </el-table-column>
             <el-table-column
                prop="shopUrl"
                label="跳转url"
                >
            </el-table-column>
            <el-table-column
                label="商品图片"
                >
                <template slot-scope="scope">
                    <img :src="'/web/shop/img/download.do?fileName='+scope.row.thumbnail" height="80px" alt="">
                </template>
            </el-table-column>
             <!-- <el-table-column
                prop="createTime"
                label="创建时间"
               >
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | parseTime}}</span>
                </template>
               <span></span>
            </el-table-column> -->
            <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                     <el-button
                        v-if="scope.row.status == 0"
                        size="mini"
                        type="danger"
                        @click="changeStatus(scope.row)">下架</el-button>
                    <el-button
                        v-else-if="scope.row.status == 1"
                        size="mini"
                        type="primary"
                        @click="changeStatus(scope.row)">上架</el-button>
                        
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right p15">
             <el-pagination
                background
                @current-change="changePage"
                layout="prev, pager, next"
                :total="tableData.totalSize">
            </el-pagination>
        </div>
       <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="商品名称">
                <el-input v-model="form.shopName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="跳转url">
                <el-input v-model="form.shopUrl" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="联系电话">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品图片(建议图片尺寸341*341px)">
                <el-upload
                    class="avatar-uploader"
                    action="/web/shop/img/uploadImg.do"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    >
                    <img v-if="form.thumbnail" :src="'/web/shop/img/download.do?fileName='+form.thumbnail" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addGoods">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogFormVisible:false,
                form: {
                    shopName: '',
                    shopUrl: '',
                    thumbnail: '',
                    phone: '',
                }
            }
        },
        methods:{
            getList (){
                console.log(this.screen);
                this.$api({
                    url:'/web/admin/extensinShopList.do',
                    params:this.screen
                }).then((result) => {
                    console.log(result);
                    this.tableData = result;
                    console.log(object);
                }).catch((err) => {
                    
                });
            },
            addGoods(){
                // if(!this.form)
                Object.keys(this.form).forEach(item =>{
                    if(!this.form[item]){
                        return this.$message({
                            message: '请输入完整的内容',
                            type: 'warning'
                        })
                    }
                })
                this.$api({
                    url:'/web/admin/addExtensionShop.do',
                    method:'post',
                    data:this.form
                }).then((result) => {
                    this.dialogFormVisible = false;
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                    this.getList();
                    Object.keys(this.form).forEach(item =>{
                        this.form[item] = ''
                    })
                }).catch((err) => {
                    
                });
            },
            handleAvatarSuccess (data){
                if(data.flag == 0){
                    this.form.thumbnail = data.results.remote
                }
            },
            changeStatus (data){
                console.log(data);
                let status = data.status === 0 ? 1 :0;
                this.$api({
                    url:'/web/admin/updateShopStatus.do',
                    method:'post',
                    data:{
                        "shopId":data.shopId,
	                    "status":status
                    }
                }).then((result) => {
                    this.$message({
                        type:'success',
                        message:'修改成功'
                    })
                    this.getList()
                }).catch((err) => {
                    
                });
            }
        },
        created(){
            this.getList()
        }
    }
</script>

<style  scoped>
    .avatar-uploader >>> .el-upload {
        border: 1px dashed #999;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-top: 40px;
        
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>