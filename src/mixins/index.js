export default{
    data() {
        return {
            tableData:{},         //表格数据
            screen:{       //筛选条件
                nowPage:1, 
                pageSize:10,
                keyWord:''
            },
        }
    },
    methods: {
        changePage (page){
            // console.log(page,Vue);
            this.screen.nowPage = page;
            this.getList()     //表格列表请求方法统一命名getList
        }
    },
}