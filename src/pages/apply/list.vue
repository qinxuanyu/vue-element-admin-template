<template>
    <div>
        <el-table
        :data="tableData.results"
        style="width: 100%">
           
            <el-table-column
                prop="shopName"
                label="店铺名称"
                >
            </el-table-column>
             <el-table-column
                prop="userName"
                label="申请人"
                >
            </el-table-column>
            <el-table-column
                prop="userPhone"
                label="申请人手机号"
            >
            </el-table-column>
            <el-table-column
                prop="userPhone"
                label="店铺类型"
            >
                 <template slot-scope="scope">
                   <span>{{shopType(scope.row.type)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="申请状态"
                >
                <template slot-scope="scope">
                    <span>{{returnStatus(scope.row.status)}}</span><span v-if="scope.row.status == 2">（{{scope.row.details}}）</span>
                </template>
            </el-table-column>
             <el-table-column
                prop="createTime"
                label="提交时间"
               >
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | parseTime}}</span>
                </template>
               <span></span>
            </el-table-column>
            <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                    <div v-if="scope.row.status === 1">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="changeStatus(scope.row,0)">确认处理</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="changeStatus(scope.row,2)">拒绝</el-button>
                    </div>
                     
                    <!-- <el-button
                        v-else-if="scope.row.status == 1"
                        size="mini"
                        type="primary"
                        @click="changeStatus(scope.row)">上架</el-button> -->
                        
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right p15">
             <el-pagination
                @current-change="changePage"
                background
                layout="prev, pager, next"
                :total="tableData.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        methods:{
            getList(){
                this.$api({
                    url:'/web/admin/extensinList.do',
                    params:this.screen
                }).then((result) => {
                    this.tableData = result;
                }).catch((err) => {
                    
                });
            },
            shopType (type){
                switch (type) {
                    case 0:
                        return '淘宝'
                        break;
                     case 1:
                        return '京东'
                        break;
                    case 2:
                        return '拼多多'
                        break;
                    case 3:
                        return '苏宁易购'
                        break;
                    default:
                        break;
                }
            },
            returnStatus (status){
                switch (status) {
                    case 0:
                        return '已处理'
                        break;
                     case 1:
                        return '未处理'
                        break;
                    case 2:
                        return '拒绝'
                        break;
                    default:
                        break;
                }
            },
            changeStatus (data,status){
                console.log(data);
                this.$prompt('请输入邮箱', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(({ value }) => {
                        if(status == 2 && !value){
                            return this.$message({
                                type:'warning',
                                message:'请输入拒绝理由'
                            })
                        }
                        this.$api({
                            url:'/web/admin/updateBoothStatus.do',
                            method:'post',
                            data:{
                                boothId:data.boothId,
                                status:status,
                                details:value
                            }
                        }).then((result) => {
                            this.$message({
                                type:'success',
                                message:'处理成功'
                            })
                            this.getList()
                        }).catch((err) => {
                            
                        });
                    }).catch(() => {
                   
                    });
                
                
            }
        },
        created (){
            this.getList()
        }
    }
</script>

<style lang="scss" scoped>

</style>