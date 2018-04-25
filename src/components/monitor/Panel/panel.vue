<template>
	<div class="panel">
		<div class="panel-list" v-if='!isDefined'>
			<div class="btn-group">
				<!-- 操作按钮组 -->
				<el-button type="primary" class='f-l' icon="fa fa-plus" plain @click='dialogFormVisible=true'>&nbsp;新建面板</el-button>
				<!-- 刷新、导出 -->
				<div class="table-btn f-r">
					<el-button icon="fa fa-refresh" title='全部刷新' @click='refresh'></el-button>
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
					<el-table-column label="面板名称" sortable='custom' prop='name'>
						<template slot-scope='scope'>
							<el-button type='text' @click='getPanelGraph(scope.row.id,scope.row.name)'>{{scope.row.name}}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" width='300' align='center'>
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
		<!-- 面板监控图 -->
		<div class="graphsPanel" v-if='isDefined'>
			<GraphsPanel @cancel-define='CancleDefine' :panels-id='panelID' :panel-name='panelName'></GraphsPanel>
		</div>
		<!-- 创建面板 -->
		<el-dialog title="创建面板" :visible.sync="dialogFormVisible" width="30%" :show-close='false' center>
			<el-form :model="createForm" :rules="createRules" ref="createForm" size='medium' label-width="80px" label-position='right'>
				<el-form-item label="面板名称" prop='name'>
					<el-input v-model.trim="createForm.name" placeholder="请输入面板名称" class='dialog-item'></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="submitDialog('createForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	import GraphsPanel from './panelGraphs.vue';
	export default {
		components:{GraphsPanel},
		data(){
			return{
				isDefined:false,//是否自定义
				dialogFormVisible:false,//是否创建面板
		      	searchValue:'',//搜索值
		        pageSize:25,//当前每页展示的条数
	            currentPage:1,//当前在第几页
	            opts:[25,100,200,10000],
	            panelID:'',//面板的ID
	            panelName:'',//面板名称
	            createForm:{
	      			name:''
	      		},
	      		createRules:{
	      			name:[
	      				{ required: true, message: '请输入面板名称', trigger: 'change' }
	      			]
	      		}
			}
		},
		created(){
			this.$http.get('/monitor/screens/').then(res=>{
				var list = res.body.data;
				console.log(list);
                this.$store.commit('changeData',list);
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
            	this.$http.get('/monitor/screens/').then(res=>{
                    this.searchValue = '';//清空搜索值
                    this.currentPage = 1;//当前页码为1
                    //重新获取数据
					var list = res.body.data;
                	this.$store.commit('changeData',list);
                });
            },
            // 创建面板
			submitDialog(formName){
				if(formName){
					this.$refs[formName].validate((valid) => {
						if (valid) {
							this.$http.post('/monitor/screens/',{"name":this.createForm.name}).then(res=>{
								// 提交面板名称
								var response = res.body.data;
								if(response.id){
									this.$store.state.listData.unshift(response);
									this.$store.state.tableData = this.$store.state.listData.slice(0);
									this.$message({
							          message: '自定义面板创建成功！',
							          type: 'success'
							        });
								}else{
									this.$message.error('创建失败，该面板名称已经存在！');
								}
								this.dialogFormVisible = false;
							})
						}
					});
				}
			},
            // 获取面板中的监控图
            getPanelGraph(id,name){
            	this.panelID = id;
            	this.panelName = name;
            	console.log(this.panelName);
            	this.isDefined = true;
            },
            // 关闭面板监控图页面
            CancleDefine(v){
            	if(v){
            		this.refresh();
            	}
            	this.isDefined = false;
            }
		}
	};
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.panel{
		padding: 10px 15px;
		.panel-list{
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