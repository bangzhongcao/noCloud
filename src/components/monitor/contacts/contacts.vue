<template>
	<div class="contacts">
		<div class="contacts-list" v-if='!isCreate'>
			<div class="btn-group">
				<!-- 操作按钮组 -->
				<el-button type="primary" class='f-l' icon="fa fa-plus" @click='createContacts' plain>&nbsp;新建联系人</el-button>
				<!-- 刷新、导出 -->
				<div class="table-btn f-r">
					<el-button icon="fa fa-refresh" title='刷新' @click='refresh'></el-button>
				</div>
				<!-- 搜索 -->
				<div class='search f-r p-r'>
					<input type="text" v-model="searchValue" @keyup.enter='handleSearch(searchValue)' @input="$store.commit('emptySearch',searchValue)" placeholder="请输入内容">
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
					<el-table-column label="联系人组名称" width='200' prop='team.name' sortable='custom'></el-table-column>
					<el-table-column label="组成员">
						<template slot-scope="scope">
							<el-tag class='member-tag' v-for='item in scope.row.users' type='primary' :key='item.name' close-transition>{{item.name}}--{{item.email}}</el-tag>
			        	</template>
					</el-table-column>
					<el-table-column label="创建者" width='150' prop='creator.name' sortable='custom'></el-table-column>
					<el-table-column label="操作" width='200' align='center'>
						<template slot-scope="scope">
							<el-button type="primary" plain size='small' @click='editContacts(scope.row.team.id)'>编辑</el-button>
							<el-button type="danger" plain size='small' @click='deleteContacts(scope.row)'>删除</el-button>
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
		<div class="contactPanel" v-if='isCreate'>
			<contact-panel @cancel-pop='CanclePop' :is-alter='isAlter' :user-list='ownerlist' :contact-info='contactsInfo' :Title='popTitle'></contact-panel>
		</div>
	</div>
</template>

<script type="text/javascript">
	import contactPanel from './operateContact.vue';
	export default {
		components:{contactPanel},
		data(){
			return{
				isCreate:false,//创建
				isAlter:false,//是否是编辑状态
		      	searchValue:'',//搜索值
		        pageSize:25,//当前每页展示的条数
	            currentPage:1,//当前在第几页
	            opts:[25,100,200,10000],
	            ownerlist:[],//联系人列表
	            contactsInfo:[],//联系人组详情列表
	            popTitle:'',
	            key:'name',//排序的关键字
	            order:'ascending'//默认的排序的升降序
			}
		},
		created(){
			// 获取联系人组列表
			this.$http.get('/monitor/teams/').then(res=>{
				var list = res.body.data;
                this.$store.commit('changeData',list);
			});
			// 获取联系人列表
	    	this.$http.get('/auth/users').then(res=>{
                res.body.data.forEach((item,i)=>{
                	this.ownerlist.push({
                		'label':item.label,
                		'email':item.email,
                		'value':item.id
                	});
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
			// 搜索功能
            handleSearch(value){
                var v = value.trim();
                // var flag = this.isAccurate;
                // 将页码重设为1
                this.currentPage = 1;
                
                this.$store.state.tableData = this.$store.state.listData.filter(function(item){
                    for(var key in item){
                    	if(typeof(item[key])==='object'){
                			for(var k in item[key]){
                				if(String(item[key][k])===v){
                					return item;
                				}
                			}
                    	}else{
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
                        
                    }
                });
            },
            // 排序
	    	sortChange(obj){
	    		// obj中的各个属性不为null时
	    		if(obj.order&&obj.prop){
	    			// 当关键字或排序顺序变化时才进行排序
	    			if(this.key!==obj.prop||this.order!==obj.order){
	    				this.key = obj.prop;
                    	this.order = obj.order;
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
            	// 获取联系人组列表
				this.$http.get('/monitor/teams/').then(res=>{
					this.$store.state.listData = [];
					this.searchValue = '';//清空搜索值
                    this.currentPage = 1;//当前页码为1
                    //重新获取数据
					var list = res.body.data;
                	this.$store.commit('changeData',list);
				});
            },
            //弹出创建面板
            createContacts(){
            	this.popTitle = '创建联系人组';
            	this.isCreate = true;
            	this.isAlter = false;
            },
            // 编辑弹窗
            editContacts(id){
            	//  '/monitor/teams/{team_id}/''
            	this.$http.get('/monitor/teams/1/').then(res=>{
            		var obj = res.body.data;
            		var arrId = [];
            		obj.users.forEach((item,i)=>{
            			arrId.push(item.id);
            		})
            		this.contactsInfo.push({
        				"creator":obj.creator.name,
        				"id":obj.id,
        				"name":obj.name,
        				"resume":obj.resume,
        				"users":arrId
        			});
            		this.popTitle = '修改联系人组';
            		this.isCreate = true;
            		this.isAlter = true;
            	});
            },
            // 删除联系人组
            deleteContacts(obj){
            	const h = this.$createElement;
		        this.$msgbox({
		            title: '提示',
		            message: h('p', null, [
		                h('span', null, '即将删除联系人组'),
		                h('span', {style:'padding:0 8px;color: teal;word-wrap: break-word;overflow: hidden'}, obj.team.name),
		                h('p', { style: "font-weight:700;font-size:15px;color:#F56C6C" }, '(联系人组删除后将无法找回！)')
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
		                //  '/monitor/teams/'+obj.id
		            	this.$http.delete('/monitor/teams/1').then(res=>{
		            		var index = this.$store.state.tableData.indexOf(obj);
		            		this.$store.state.tableData.splice(index,1);
		            		this.mess = '联系人组删除成功！';
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
            CanclePop(v){
            	if(v){
            		this.refresh();
            	}
            	this.contactsInfo = [];
            	this.isCreate = false;
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
				.member-tag{
					margin: 5px 10px;
				}
			}
			.pagination{
				padding: 10px 0;
			}
		}
	}
</style>