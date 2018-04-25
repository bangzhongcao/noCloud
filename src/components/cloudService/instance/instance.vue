<template>
	<div class="instance">
		<div class="list" v-if='!isCreate'>
			<div class="btn-group">
				<!-- 操作按钮组 -->
				<el-button type="primary" class='f-l' icon="fa fa-plus" @click='createInstance' plain>&nbsp;创建实例</el-button>
				<el-button-group class='f-l operate-btns'>
					<el-button type="success" icon="fa fa-power-off" :disabled='!isEnabled' plain @click="operate('start',select_arr)">&nbsp;开机</el-button>
					<el-button type="warning" icon='fa fa-circle' :disabled='!isEnabled' plain @click="operate('shutdown',select_arr)">&nbsp;关机</el-button>
					<el-button type="danger" icon="fa fa-trash-o" :disabled='!isEnabled' plain @click="operate('delete',select_arr)">&nbsp;删除</el-button>
				</el-button-group>
				<el-dropdown class='f-l dorpdown-btn' @command="moreOperates">
				  <el-button type="info" icon='fa fa-cogs' :disabled='!isEnabled' plain>&nbsp;更多操作<i class="el-icon-arrow-down el-icon--right"></i>
				  </el-button>
				  <el-dropdown-menu slot="dropdown">
				  	<el-dropdown-item command='restart' class='restartItem'>重启</el-dropdown-item>
				    <!-- <el-dropdown-item command='rebuild'>重装系统</el-dropdown-item> -->
				  </el-dropdown-menu>
				</el-dropdown>
				<!-- 刷新、导出 -->
				<div class="table-btn f-r">
					<el-button icon="fa fa-refresh" title='全部刷新' @click='refresh'></el-button>
					<el-button icon="fa fa-cog" title='设置字表列段' @click='settingColumn'></el-button>
				</div>
				<!-- 搜索 -->
				<div class='search f-r p-r'>
					<!-- <el-checkbox class='accurate' v-model="$store.state.isAccurate">精确搜索</el-checkbox> -->
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
				<el-table border :data="CurrentData" @sort-change='sortChange' @selection-change="selectChange">
					<el-table-column type="selection" width='45' align='center'></el-table-column>
					<el-table-column v-if='setColumn.name' key='name' prop="name" label="名称" sortable='custom'>
						<template slot-scope='scope'>
							<el-button type='text'><i class='el-icon-refresh' title='刷新'></i></el-button>
							<span>{{scope.row.name}}</span>
							
						</template>
					</el-table-column>
					<el-table-column v-if='setColumn.first_ip' key='first_ip' prop="first_ip" label="IP" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.project' key='project' prop="project" label="项目" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.created_by' key='created_by' prop="created_by" label="创建者" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.host' key='host' prop="host" label="宿主机" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.power_state' key='power_state' prop="power_state" label="电源" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.volumes' key='volumes'  label="存储卷">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>姓名: {{ scope.row.volumes }}</p>
								<div slot="reference">
									<el-tag size="medium" class='name-wrapper'>{{ scope.row.volumes }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column v-if='setColumn.image' prop='image' key='image' label="镜像" sortable='custom'>
					</el-table-column>
					<el-table-column v-if='setColumn.status' key='status' prop="status" label="状态" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.flavor' key='flavor' prop="flavor" label="类型" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.availability_zone' key='availability_zone' prop="availability_zone" label="机房" sortable='custom'></el-table-column>
					<el-table-column v-if='setColumn.created' key='created' label="创建时间" sortable='custom'>
						<template slot-scope="scope">
					        <i class="el-icon-time"></i>
					        <span>{{ scope.row.created }}</span>
				        </template>
					</el-table-column>
					<el-table-column label="操作" width='100'>
						<template slot-scope="scope">
							<el-dropdown @command="singleOperates" @visible-change='changeVisible(scope.$index, scope.row)' placement='bottom'>
								<el-button type="danger" plain size='small'>
									操作<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command='console'><a href="/instances/a640a1c3-a56b-427e-9b2c-7821688a262b/console" target='_blank' style='color:#a4da89'>控制台</a></el-dropdown-item>
									<el-dropdown-item command='start'>开机</el-dropdown-item>
									<el-dropdown-item command='shutdown'>关机</el-dropdown-item>
									<el-dropdown-item command='delete' style='color:#f9a7a7'>删除</el-dropdown-item>
									<el-dropdown-item command='restart'>重启</el-dropdown-item>
									<el-dropdown-item command='rebuild'>重装系统</el-dropdown-item>
				    				<el-dropdown-item command='edit'><i class='fa fa-edit'></i>编辑</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">操作</el-button> -->
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
			<create-instance @cancel-create='CancleCreate'></create-instance>
		</div>
		<!-- 重装系统和编辑框 -->
		<el-dialog class='pop-dialog' :title="popTitle" :visible.sync="dialogVisible" width="30%" :show-close='false' center>
		  <div v-if='!isEdit'>
		  	<p class='text-dialog'><span>当前云主机的操作系统为:</span><strong>{{objImage}}</strong></p>
		  	<el-cascader v-if='!isEdit' :options="$store.state.osType" :show-all-levels="false" v-model="image" expand-trigger="hover" style='width:100%' placeholder='请选择要重装的操作系统'></el-cascader>
		  </div>
		  <div v-if='isEdit'>
			<el-form :model="editForm" :rules="editRules" ref="editForm" size='medium' label-width="100px" label-position='right'>
				<el-form-item label="创建者">
					<el-select v-model="editForm.created_by" filterable clearable :filter-method="ownerFilter" placeholder="请选择创建者" class='dialog-item'>
						<el-option v-for="item in ownerlist" :key="item.value" :label="item.label" :value="item">
							<span class='f-l'>{{ item.label }}</span>
  							<span class='f-r'style="color:#8492a6;font-size:13px">{{item.email.split('@')[0] }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="editForm.status" placeholder="请选择">
					    <el-option v-for="item in $store.state.Status" :key="item" :label="item" :value="item">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="云主机名称" prop='name'>
					<el-input v-model.trim="editForm.name" placeholder="请输入云主机名称" class='dialog-item'></el-input>
				</el-form-item>
				<el-form-item label="联系人">
					<el-select v-model="editForm.contact" filterable clearable :filter-method="ownerFilter" placeholder="请选择联系人" class='dialog-item'>
						<el-option v-for="item in ownerlist" :key="item.value" :label="item.label" :value="item">
							<span class='f-l'>{{ item.label }}</span>
  							<span class='f-r'style="color:#8492a6;font-size:13px">{{item.email.split('@')[0] }}</span>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button v-if='!isEdit' type="primary" @click="submitDialog()">确 定</el-button>
		    <el-button v-if='isEdit' type="primary" @click="submitDialog('editForm')">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 设置列表头 -->
		<el-dialog title="设置表格列" :visible.sync="isSettingColumn" :show-close='false' width="30%">
			<div>
				<el-row :gutter="10" style='margin-bottom:15px'>
					<el-col :span="6"><el-checkbox v-model='temporaryList.name'>名称</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.first_ip'>IP</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.project'>项目</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.created_by'>创建者</el-checkbox></el-col>
				</el-row>
				<el-row :gutter="10" style='margin-bottom:15px'>
					<el-col :span="6"><el-checkbox v-model='temporaryList.host'>宿主机</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.power_state'>电源</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.volumes'>存储卷</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.image'>镜像</el-checkbox></el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="6"><el-checkbox v-model='temporaryList.status'>状态</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.flavor'>类型</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.availability_zone'>机房</el-checkbox></el-col>
					<el-col :span="6"><el-checkbox v-model='temporaryList.created'>创建时间</el-checkbox></el-col>
				</el-row>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelColumn">取 消</el-button>
				<el-button type="primary" @click="confirmColumn">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import createInstance from 'components/cloudService/instance/createPanel';
	import {getInstanceList} from 'api/service';

	export default{
		components:{createInstance},
		data() {
	      return {
	      	isCreate:false,//是否创建虚拟机
	      	searchValue:'',//搜索值
	      	isEnabled:false,//按钮是否disabled
	        pageSize:25,//当前每页展示的条数
            currentPage:1,//当前在第几页
            opts:[25,100,200,10000],
            Mess:'',
        	MessType:'success',
        	select_arr:[],//选中的虚拟机数组
        	len:0,//选择的虚拟机数量
        	popTitle:'',//弹窗的标题
        	dialogVisible:false,//重装系统和编辑框的控制关闭flag
        	isEdit:false,
        	
      		image:[],//云主机的操作系统
      		objArr:[],//当前选中的云主机
      		objImage:'',//当前云主机的操作系统
      		// 所有的联系人信息
      		owners:[],
      		ownerlist:[],

      		editForm:{
      			created_by:{value:'cbz',label:'曹邦中',eamil:'bangzhongcao@sohu-inc.com'},
      			status:'',
      			name:'',
      			contact:{value:'zfx',label:'张丰祥',eamil:'fengxiangzhang@sohu-inc.com'}
      		},
      		editRules:{
      			name:[
      				{ required: true, message: '请输入云主机名称', trigger: 'change' }
      			]
      		},
      		isSettingColumn:false,//设置列表头 弹窗是否显示
      		// 默认显示的列名
      		setColumn:{
      			name:true,
      			first_ip:true,
      			project:true,
      			created_by:false,
      			host:true,
      			power_state:true,
      			volumes:false,
      			image:true,
      			status:true,
      			flavor:true,
      			availability_zone:false,
      			created:true
      		},
      		temporaryList:{
      			
      		}//临时 的存放列表
	      }
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
	    created(){
	    	// 获取虚拟机列表
	    	this.$http.get('/noec2/instances').then(res=>{
                var list = res.body.data;
                this.$store.commit('changeData',list);
                // this.loading = false;

                // 获取用户信息列表
		    	this.$http.get('/auth/users').then(res=>{
	                // this.owners = res.body.data;
	                res.body.data.forEach((item,i)=>{
	                	this.owners.push({
	                		'label':item.label,
	                		'email':item.email,
	                		'value':item.id
	                	})
	                	this.ownerlist = this.owners.slice(0);
	                });
	            });
            })
	    },
	    methods: {
            // 排序
	    	sortChange(obj){
	    		// obj中的各个属性不为null时
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
            selectChange(selection){
            	this.select_arr = selection;
            	this.len = selection.length;
            	if(this.len){
            		this.isEnabled = true;
            	}else{
            		this.isEnabled = false;
            	}
            },
			formatter(row, column) {
				return row.address;
			},
			// 下拉框触发
			changeVisible(index,obj){
				this.objArr = [];
				this.objArr.push(obj);
				// 得到选中的云主机的操作系统
				this.objImage = obj.image;
			},
			// 更多操作
			moreOperates(command){
				if(command==='restart'){
					this.operate(command,this.select_arr);
				}
			},
			// 单个操作
			singleOperates(command){
				// 单个云主机的重启操作
				if(command==='rebuild'){
					// 清空image
					this.image = [];
					// 隐藏编辑的内容
					this.isEdit = false;
					// 显示弹窗和标题
					this.popTitle = '重装系统';
					this.dialogVisible = true;
				} else if(command==='edit'){
					// 隐藏编辑的内容
					this.isEdit = true;
					// 自动填写云主机的信息
					// this.editForm.status = this.objArr[0].status;
					this.editForm.status = 'ACTIVE';
					this.editForm.name = this.objArr[0].name;
					// 云主机的编辑
					this.popTitle = '编辑云主机';
					this.dialogVisible = true;
				} else if(command==='console'){
					console.log(command);
				} else {
					this.operate(command,this.objArr);
				}
			},
			// 联系人搜索
			ownerFilter(v){
				this.ownerlist = this.owners.filter((item)=>{
					return item.label.indexOf(v)>-1||item.email.indexOf(v)>-1;
				})
			},
			// 提交 重装系统/云主机编辑
			submitDialog(formName){
				if(formName){
					this.$refs[formName].validate((valid) => {
						if (valid) {
							// 整理数据
							var editData = {};
							for(var key in this.editForm){
								if(key==='created_by'||key==='contact'){
									editData[key] = this.editForm[key].value;
								}else{
									editData[key] = this.editForm[key];
								}
							}
							// 提交
							this.$http.patch('/noec2/instances/1001',{data:editData}).then(res=>{
								// 重新获取云主机列表
								this.$http.get('/noec2/instances').then(res=>{
					                // this.$store.state.listData = this.initData(res.body.data);
					                this.$store.state.listData = res.body.data;
					                this.$store.state.tableData = this.$store.state.listData.slice(0);
					                this.dialogVisible = false;
					            });
								
							})
						}
					});
				}else{
					if(this.image.length){
						// 更改操作系统
						this.objArr[0].image = this.image[1];
						this.dialogVisible = false;
					}
				}
			},
			// 刷新按钮,清楚一切过滤条件，只保留排序
            refresh(){
                this.$http.get('/noec2/instances').then(res=>{
                    // this.$store.state.listData = this.initData(res.body.data);
                    this.searchValue = '';//清空搜索值
                    this.currentPage = 1;//当前页码为1
                    //重新获取数据
					var list = res.body.data;
                	this.$store.commit('changeData',list);
                });
            },
            // 设置表格列
            // 进入创建虚拟机面板
            settingColumn(){
            	for(var key in this.setColumn){
            		this.$set(this.temporaryList,key,this.setColumn[key]);
            	}
            	this.isSettingColumn = true;
            },
            // 取消设置列表头
            cancelColumn(){
            	this.isSettingColumn = false;
            	this.temporaryList = {};
            	for(var key in this.setColumn){
            		this.$set(this.temporaryList,key,this.setColumn[key]);
            	}
            },
            // 确定设置列表头
            confirmColumn(){
            	this.isSettingColumn = false;
            	this.setColumn = {};
            	for(var key in this.temporaryList){
            		this.$set(this.setColumn,key,this.temporaryList[key]);
            	}
            },
            // 显示创建虚拟机面板
            createInstance(){
            	this.isCreate = true;
            },
            // 返回虚拟机列表面板
            CancleCreate(flag){
            	if(flag==='success'){
            		this.refresh();
            	}
            	this.isCreate = false;
            },
            // 虚拟机操作 开机/关机/重启/删除等
            operate(actions,selectArr){
            	// 设置不同的颜色
            	var instance_action = '';
            	var color = '';
            	if(actions==='start'){
            		instance_action = '开机';
            		color = '#67C23A';
            	}else if(actions==='shutdown'){
            		instance_action = '关机';
            		color = '#909399';
            	}else if(actions==='delete'){
            		instance_action = '删除(虚拟机删除后将无法找回！)';
            		color = '#F56C6C';
            	}else if(actions==='restart'){
            		instance_action = '重启';
            		color = '#E6A23C';
            	}
            	// 创建虚拟机
            	const h = this.$createElement;
            	// 设置弹出框字体的大小和颜色
            	var instance_names = [];
            	for(var i in selectArr){
            		instance_names.push(h('span',{ style: 'color: teal;margin-right:10px' },selectArr[i].name));	
            	}
				// 提示框
		        this.$msgbox({
		            title: '提示',
		            message: h('p', null, [
		                h('span', null, '即将对以下实例：'),
		            	h('p', {style:'word-wrap: break-word;overflow: hidden'}, instance_names),
		            	h('span', null, '进行'),
		            	h('strong', { style: "margin-left:5px;font-size:15px;color: "+color+"" }, instance_action)
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
			                if(this.len<=1){
			                	// 单个机器操作
			                	var startData = {};
			                	
			                	if(actions==='delete'){
			                		// 进行ajax请求
				                	this.$http.delete("/noec2/instances/1001").then(res=>{
										var status = res.body.result;
								        this.mess = '所选择的虚拟机'+instance_action+'成功！';
								        this.messType = 'success';
								        // 停止loading状态
								        instance.confirmButtonLoading = false;
								        done();
									});
			                	}else{
			                		var startData = {'action':actions};
			                		// 进行ajax请求
				                	this.$http.post("/noec2/instances/1001",{ data:startData }).then(res=>{
										var status = res.body.result;
								        this.mess = '所选择的虚拟机'+instance_action+'成功！';
								        this.messType = 'success';
								        // 停止loading状态
								        instance.confirmButtonLoading = false;
								        done();
									});
			                	}
			                	
			                }else{
			                	// 批量操作
			                	var startBatchData = {'action':'start','object_ids':[]};
			                	for(var i=0;i<selectArr.length;i++){
			                		startBatchData['object_ids'].push(selectArr[i]['id'])
			                	}
			                	this.$http.post("/noec2/instances/batch/",{ data:startBatchData }).then(res=>{
									var status = res.body.result;
							        this.mess = '所选择的虚拟机'+instance_action+'成功！';
							        this.messType = 'success';
							        // 停止loading状态
							        instance.confirmButtonLoading = false;
							        done();
								});
			                }
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
		        }).catch(() => {
						this.$message({
						type: 'info',
						customClass:'pop-mess',
						message: '已取消操作',
						duration: 700
					});          
				});
            }
	    }
	}
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.instance{
		padding: 10px 15px;
		.list{
			.btn-group{
				padding: 10px 0;
				overflow: hidden;
				border-bottom: 10px solid @colorBackground;
				.operate-btns{
					margin-left: 30px;
				}
				.dorpdown-btn{
					margin-left: 20px;
				}
				.table-btn{
					.el-button{
						font-size: 18px;
						border: 0;
						margin-left: 0;
						padding:12px;
					}
					
				}
				.search{
					width: 20%;
					max-width: 320px;
					margin-right: 20px;
					padding-right:56px;
					// .accurate{
					// 	width: 20%;
					// }
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
					white-space:pre-wrap;
					overflow: hidden;
					height:auto
				}
			}
			.pagination{
				padding: 10px 0;
			}
		}
		.pop-dialog{
			.text-dialog{
				margin-bottom: 8px;
			}
			.dialog-item{
				width: 90%;
			}
		}
		
	}
</style>