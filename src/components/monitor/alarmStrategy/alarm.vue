<template>
	<div class="alarm">
		<div class="alarm-list" v-if='!isHidden'>
			<div class="btn-group">
				<!-- 操作按钮组 -->
				<el-button type="primary" class='f-l' icon="fa fa-plus" plain @click='createInstance'>&nbsp;新建告警规则</el-button>
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
				<el-table border :data="CurrentData" @sort-change='sortChange' :default-sort = "{prop: 'name', order: 'descending'}">
					<el-table-column label="规则名称" sortable='custom' prop='name'>
						<template slot-scope='scope'>
							<i class='el-icon-refresh c-p' title='刷新' style='margin-right:8px'></i>
							<el-button type='text' @click='alterAlarm(scope.row.id)'>{{scope.row.name}}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="父规则" prop='parent_name' sortable='custom'></el-table-column>
					<el-table-column label="创建者" prop='create_user' sortable='custom'></el-table-column>
					<el-table-column label="告警接收人" prop='uic' sortable='custom'></el-table-column>
					<el-table-column label="操作" width='120' align='center'>
						<template slot-scope="scope">
							<el-button type="danger" plain size='small' @click='deleteRule(scope.row)'>删除</el-button>
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
		<div v-if='isHidden'>
			<create-alarm v-if='isCreate' @cancel-create='CancleCreate' :alarmData="parentAlarmData"></create-alarm>
			<alter-alarm v-if='isAlter' @return-back='returnBack' :alarmInfoData='alarmInfo' :parentRuleData="parentAlarmData"></alter-alarm>
		</div>
	</div>
</template>

<script type="text/javascript">
	import createAlarm from 'components/monitor/alarmStrategy/createAlarm';
	import alterAlarm from 'components/monitor/alarmStrategy/alterAlarm';

	export default {
		components:{ createAlarm ,alterAlarm },
		data(){
			return{
				isHidden:false,//隐藏列表面板
				isCreate:false,//是否显示创建告警策略面板
				isAlter:false,//是否显示修改告警策略面板
		      	searchValue:'',//搜索值
		      	listData:[],
		        tableData: [],
		        parentAlarmData:[],//父规则列表
		        alarmInfo:{},//告警规则详情
		        pageSize:25,//当前每页展示的条数
	            currentPage:1,//当前在第几页
	            opts:[25,100,200,10000],
	            key:'name',//排序的关键字
	            order:'ascending'//默认的排序的升降序
			}
		},
		created(){
			this.$http.get('/monitor/rules/').then(res=>{
				this.listData = res.body.data;
				this.tableData = this.listData.slice(0);
				// 初始化排序
				this.tableData.sort(this.compare(this.key,this.order));
				this.parentAlarmData = this.tableData.slice(0);
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
                    	val1 = obj1[prop].toLowerCase();
                    	val2 = obj2[prop].toLowerCase();
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
            	this.$http.get('/monitor/rules/').then(res=>{
            		this.searchValue = '';//清空搜索值
                    this.currentPage = 1;//当前页码为1
                    //重新获取数据
					this.listData = res.body.data;
					this.tableData = this.listData.slice(0);
					this.tableData.sort(this.compare(this.key,this.order));//排序
				});
            },
            // 删除告警规则
            deleteRule(obj){
            	const h = this.$createElement;
		        this.$msgbox({
		            title: '提示',
		            message: h('p', null, [
		                h('span', null, '即将删除规则'),
		                h('span', {style:'padding:0 8px;color: teal;word-wrap: break-word;overflow: hidden'}, obj.name),
		                h('p', { style: "font-weight:700;font-size:15px;color:#F56C6C" }, '(告警规则删除后将无法找回！)')
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
		                //  '/monitor/rules/'+obj.id
		            	this.$http.delete('/monitor/rules/1').then(res=>{
		            		var index = this.tableData.indexOf(obj);
		            		this.tableData.splice(index,1);
		            		this.mess = '告警规则删除成功！';
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
            // 点击创建弹出创建面板
            createInstance(){
            	this.isHidden = true;
            	this.isCreate = true;
            },
            // 点击弹出修改面板
            alterAlarm(id){
            	// this.$http.get('/monitor/rules/'+id).then(res=>{
            	this.$http.get('/monitor/rules/10').then(res=>{
            		this.alarmInfo = res.body.data;
            		this.isHidden = true;
            		this.isAlter = true;
            	});
            },
            // 修改面板返回列表面板
            returnBack(){
            	this.isHidden = false;//返回列表页面
				this.isAlter = false;
            },
            // 返回列表面板
            CancleCreate(flag){
            	// 重新获取告警策略列表
            	if(flag==='success'){
            		this.refresh();
            	}
				this.isHidden = false;//返回列表页面
				this.isCreate = false;
            }
		}
	};
</script>
<style scoped lang='less'>
	@import "~common/less/variable.less";
	.alarm{
		padding: 10px 15px;
		.alarm-list{
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