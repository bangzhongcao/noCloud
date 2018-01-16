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
					<el-table-column label="姓名"></el-table-column>
					<el-table-column label="电话"></el-table-column>
					<el-table-column label="邮箱"></el-table-column>
					<el-table-column label="所属联系组"></el-table-column>
					<el-table-column label="状态"></el-table-column>
				<!-- 	<el-table-column v-if='setColumn.volumes' key='volumes'  label="存储卷">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>姓名: {{ scope.row.volumes }}</p>
								<div slot="reference">
									<el-tag size="medium" class='name-wrapper'>{{ scope.row.volumes }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column v-if='setColumn.created' key='created' label="创建时间" sortable='custom'>
						<template slot-scope="scope">
					        <i class="el-icon-time"></i>
					        <span>{{ scope.row.created }}</span>
				        </template>
					</el-table-column> -->
					<el-table-column label="操作" width='160' align='center'>
						<template slot-scope="scope">
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
			this.tableData = [{}]
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
            refresh(){}
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
					width: 320px;
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