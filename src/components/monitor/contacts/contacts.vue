<template>
	<div class="contacts">
		<div class="contacts-list" v-if='!isCreate'>
			<div class="btn-group">
				<!-- 操作按钮组 -->
				<el-button type="primary" class='f-l' icon="fa fa-plus" plain>&nbsp;新建联系人</el-button>
				<!-- 刷新、导出 -->
				<div class="table-btn f-r">
					<el-button icon="fa fa-refresh" title='刷新' @click='refresh'></el-button>
				</div>
				<!-- 搜索 -->
				<div class='search f-r p-r'>
					<input type="text" v-model="searchValue" @keyup.enter='handleSearch(searchValue)' @input='emptySearch(searchValue)' placeholder="请输入内容">
					<el-button slot="append" icon="el-icon-search" @click='handleSearch(searchValue)' class='search-btn p-a' ></el-button>
				</div>
			</div>
			<!-- 分页 -->
			<div class="pagination ta-r">
				<el-pagination background :current-page="currentPage" :page-sizes="opts" :page-size="pageSize" :total="itemCount" @size-change="changePageSize" @current-change="changePage" layout="total, sizes, prev, pager, next, jumper">
			    </el-pagination>
			</div>
			<!-- 表格 -->
			<div class="table">
				<!-- @select='SelectItem' @select-all='selectAll'  -->
				<el-table border :data="CurrentData" style="width: 100%">
					<el-table-column label="联系人组名称" prop='team.name' sortable='custom'></el-table-column>
					<el-table-column label="组成员" prop='users' :formatter="formatter">
						<!-- <template slot-scope='scope'>
							<p>{{scope.row.name}}</p>
						</template> -->
					</el-table-column>
					<el-table-column label="操作" width='200' align='center'>
						<template slot-scope="scope">
							<el-button type="primary" plain size='small'>编辑</el-button>
							<el-button type="danger" plain size='small'>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="pagination ta-r">
				<el-pagination background :current-page="currentPage" :page-sizes="opts" :page-size="pageSize" :total="itemCount" @size-change="changePageSize" @current-change="changePage" layout="total, sizes, prev, pager, next, jumper">
			    </el-pagination>
			</div>
		</div>
		<!-- <div class="createInstance" v-if='isCreate'>
			<create-instance @cancel-create='CancleCreate'></create-instance>
		</div> -->
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return{
				isCreate:false,//是否创建虚拟机
		      	searchValue:'',//搜索值
		      	listData:[],
		        tableData: [],
		        pageSize:25,//当前每页展示的条数
	            currentPage:1,//当前在第几页
	            opts:[25,100,200,10000],
	            key:'name',//排序的关键字
	            order:'ascending'//默认的排序的升降序
			}
		},
		created(){
			this.$http.get('/monitor/teams/').then(res=>{
				this.listData = res.body.data;
	    		this.tableData = this.listData.slice(0);
	    		// 初始化排序
				this.tableData.sort(this.compare(this.key,this.order));
				console.log(this.tableData);
			});
		},
		computed:{
			CurrentData(){
                var _start = ( this.currentPage - 1 ) * this.pageSize;
                var _end = this.currentPage * this.pageSize;
                if(this.tableData.length<_end){
                    return this.tableData.slice(_start);
                }else{
                    return this.tableData.slice(_start,_end);
                }
            },
            itemCount(){
                return this.tableData.length;
            }
		},
		methods:{
			// 搜索功能
            handleSearch(value){
                var v = value.trim();
                // var flag = this.isAccurate;
                // 将页码重设为1
                this.currentPage = 1;
                this.tableData = this.listData.filter(function(item){
                    for(var key in item){
                        // 精确搜索
                        // if(flag){
                            if(String(item[key])===v){
                                return item;
                            } 
                        // }else{//模糊搜索
                        //     if(String(item[key]).indexOf(v)>=0){
                        //         return item;
                        //     }
                        // }
                    }
                });
                this.tableData.sort(this.compare(this.key,this.order));
            },
            //当搜索框为空时自动返回所有数据
            emptySearch(value){
                if(!value){
                    this.tableData = this.listData.slice(0);
                    // 重新排序
                    this.tableData.sort(this.compare(this.key,this.order));
                }
            },
            // 排序函数
            compare(prop,order) {
                return function (obj1, obj2) {
                    var val1 = obj1[prop];
                    var val2 = obj2[prop];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    	// 值为number型
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }else{
                    	// 值为string型
                    	val1 = obj1[prop];
                    	val2 = obj2[prop];
                    }
                    if(order==='ascending'){
                        if (val1 < val2) {
                            return -1;
                        } else if (val1 > val2) {
                            return 1;
                        } else {
                            return 0;
                        } 
                    }else if(order==='descending'){
                        if (val1 < val2) {
                            return 1;
                        } else if (val1 > val2) {
                            return -1;
                        } else {
                            return 0;
                        } 
                    }
                               
                } 
            },
            // 排序
	    	sortChange(obj){
	    		// obj中的各个属性不为null时
	    		if(obj.order&&obj.prop){
	    			// 当关键字或排序顺序变化时才进行排序
	    			if(this.key!==obj.prop||this.order!==obj.order){
	    				this.key = obj.prop;
                    	this.order = obj.order;
                    	this.tableData.sort(this.compare(this.key,this.order));
	    			}
                }
	    	},
			// 翻页
            changePage(index){
                this.currentPage = index;
                window.scrollTo(0, 0);
            },
            // 修改每页显示条数
            changePageSize(size){
                this.pageSize = size;
                this.currentPage = 1;
                window.scrollTo(0, 0);
            },
            // 刷新
            refresh(){
            	this.$http.get('/monitor/teams/').then(res=>{
            		this.searchValue = '';//清空搜索值
                    this.currentPage = 1;//当前页码为1
                    //重新获取数据
					this.listData = res.body.data;
					this.tableData = this.listData.slice(0);
					this.tableData.sort(this.compare(this.key,this.order));//排序
				});
            },
            // 格式处理
            formatter(row,colome){
            	return row.name;
            }
		}
	};
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.contacts{
		padding: 10px 15px;
		.contacts-list{
			.btn-group{
				padding: 10px 0;
				overflow: hidden;
				border-bottom: 10px solid @colorBackground;
				.table-btn{
					.el-button{
						font-size: 18px;
						border: 0;
						margin-left: 0;
						padding:12px;
					}
				}
				.search{
					width: 300px;
					margin-right: 20px;
					padding-right:56px;
					input{
						width: 100%;
						height: 38px;
						padding: 0 8px;
						border: 1px solid #dcdfe6;
						border-radius: 3px;
						font-size: 14px;
						line-height: 38px;
						&::-webkit-input-placeholder{
							color:#d0d0d0;
						}
					}
					.search-btn{
						top:0;
						right: 0;
						border-radius:  0 3px 3px 0;
					}
				}
			}
			.table{
				.name-wrapper{
					width:100%; 
					line-height: 20px;
					word-wrap: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					height:auto
				}
			}
			.pagination{
				padding: 10px 0;
			}
		}
	}
</style>