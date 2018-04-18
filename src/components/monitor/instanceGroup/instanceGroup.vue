<template>
	<div class="instances-group">
		<div class="instancesGroup-list" v-if='!isCreate'>
			<div class="btn-group">
				<!-- 操作按钮组 -->
				<el-button type="primary" class='f-l' icon="fa fa-plus" plain @click='createInstGroup'>&nbsp;新建实例组</el-button>
				<!-- 刷新、导出 -->
				<div class="table-btn f-r">
					<el-button icon="fa fa-refresh" title='刷新' @click='refresh'></el-button>
				</div>
				<!-- 搜索 -->
				<div class='search f-r p-r'>
					<input type="text" v-model="searchValue" @keyup.enter="$store.commit('handleSearch',searchValue)" @input="$store.commit('emptySearch',searchValue)" placeholder="请输入内容">
					<el-button slot="append" icon="el-icon-search" @click="$store.commit('handleSearch',searchValue)" class='search-btn p-a' ></el-button>
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
				<el-table border :data="CurrentData" @sort-change='sortChange'>
					<el-table-column label="实例组名称" prop='name' sortable='custom'></el-table-column>
					<el-table-column label="操作" width='300' align='center'>
						<template slot-scope="scope">
							<el-button type="primary" plain size='small' @click='editGroup(scope.row.id)'>编辑</el-button>
							<el-button type="danger" plain size='small' @click='deleteGroup(scope.row)'>删除</el-button>
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
		<div class="createInstance" v-if='isCreate'>
			<createInstsPanel @cancel-create='CancleCreate' :is-alter='isAlter' :inst-list='instList' :hosts-info='hostgroupsInfo'></createInstsPanel>
		</div>
	</div>
</template>

<script type="text/javascript">
	import createInstsPanel from './createInstsPanel.vue';
	export default {
		components:{createInstsPanel},
		data(){
			return{
				isCreate:false,//创建/编辑
				isAlter:false,//是否是编辑状态
		      	searchValue:'',//搜索值
		        pageSize:25,//当前每页展示的条数
	            currentPage:1,//当前在第几页
	            opts:[25,100,200,10000],
	            instList:[],//所有云主机列表
	            hostgroupsInfo:{}//某一个实例组的详细信息
			}
		},
		created(){
			this.$http.get('/monitor/hostgroups/').then(res=>{
				var list = res.body.data;
                this.$store.commit('changeData',list);
				// 获取所有的虚拟机列表
				this.$http.get('/noec2/instances').then(res=>{
					this.instList = res.body.data;
				});
	    	});
		},
		computed:{
			CurrentData(){
                var _start = ( this.currentPage - 1 ) * this.pageSize;
                var _end = this.currentPage * this.pageSize;
                if(this.$store.state.tableData.length<_end){
                    return this.$store.state.tableData.slice(_start);
                }else{
                    return this.$store.state.tableData.slice(_start,_end);
                }
            },
            itemCount(){
                return this.$store.state.tableData.length;
            }
		},
		methods:{
            // 排序
	    	sortChange(obj){
	    		this.$store.commit('sortChange',obj);
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
            	this.$http.get('/monitor/hostgroups/').then(res=>{
            		this.searchValue = '';//清空搜索值
                    this.currentPage = 1;//当前页码为1
                    //重新获取数据
					var list = res.body.data;
                	this.$store.commit('changeData',list);
				});
            },
            //弹出创建面板
            createInstGroup(){
            	this.hostgroupsInfo = {"title":'创建实例组'};
            	this.isCreate = true;
            	this.isAlter = false;
            },
            // 编辑弹窗
            editGroup(id){
            	// '/monitor/hostgroups/'+id+'/'
            	this.$http.get('/monitor/hostgroups/1/').then(res=>{
            		this.hostgroupsInfo = res.body.data;
            		this.hostgroupsInfo.title = '修改实例组';
            		this.isCreate = true;
            		this.isAlter = true;
            	});
            },
            // 删除联系人组
            deleteGroup(obj){
            	const h = this.$createElement;
		        this.$msgbox({
		            title: '提示',
		            message: h('p', null, [
		                h('span', null, '即将删除实例组'),
		                h('span', {style:'padding:0 8px;color: teal;word-wrap: break-word;overflow: hidden'}, obj.name),
		                h('p', { style: "font-weight:700;font-size:15px;color:#F56C6C" }, '(实例组删除后将无法找回！)')
		            ]),
		            showCancelButton: true,
		            showClose:false,
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning',
		            beforeClose: (action, instance, done) => {
	                 	if (action === 'confirm') {
		              	instance.confirmButtonLoading = true;
		                instance.confirmButtonText = '执行中...';
		                //  '/monitor/hostgroups/'+obj.id
		            	this.$http.delete('/monitor/hostgroups/1').then(res=>{
		            		var index = this.$store.state.tableData.indexOf(obj);
		            		this.$store.state.tableData.splice(index,1);
		            		this.mess = '实例组删除成功！';
					        this.messType = 'success';
					        // 停止loading状态
					        instance.confirmButtonLoading = false;
					        done();
		            	});
		            } else {
		                done();
		            }
		          }
		        }).then(action => {
		          	this.$alert(this.mess, '提示', {
		            	confirmButtonText: '确定',
		            	type: this.messType,
		            	showClose:false
		            });
		            this.$emit('cancel-create','success');//返回列表页面
		        }).catch(_=>{
		        	this.$message({
		        		type:'info',
		        		message:'取消删除'
		        	});
		        });
            },
            //关闭弹窗
            CancleCreate(v){
            	if(v){
            		this.refresh();
            	}
            	this.isCreate = false;
            }
		}
	};
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.instances-group{
		padding: 10px 15px;
		.instancesGroup-list{
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