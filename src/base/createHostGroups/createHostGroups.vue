<template>
	<div class="createHostGroups">
		<el-form class='HostGroupsForm' :model="HostGroupsForm" :rules="HostGroupsRules" ref="HostGroupsForm" label-width="100px">
			<el-form-item label="实例组名称" prop='name'>
				<el-input class='group-name' placeholder="请输入实例组名称" v-model.trim="HostGroupsForm.name"></el-input>
				<el-button v-if='!isAlter' type="primary" plain class='createHostsBtn' @click="createHosts('HostGroupsForm')">创建实例组</el-button>
				<el-button v-if='isAlter' type="success" plain round class='createHostsBtn' @click="createHosts('HostGroupsForm')">修改实例组</el-button>
			</el-form-item>
			<el-form-item class='transfer'>
				<el-transfer filterable filter-placeholder="请输入实例名或IP" v-model="instances" :titles="['未选实例列表', '已选实例列表']" :data="list">
    			</el-transfer>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<script type="text/javascript">
	export default{
		props:['instanceList','isAlter','hostsgroupInfo'],
		data(){
			return{
				instances:[],//选定的实例
				list:[],//实例列表
				hostId:'',//实例组id
				HostGroupsForm:{
					name:''
				},
				HostGroupsRules:{
					name:[
						{ required: true, message: '请输入实例组名称', trigger: 'change' }
					]
				}
			}
		},
		mounted(){
			// 云主机的格式
			this.instanceList.forEach((item,index)=>{
				var labels = item.first_ip+' ('+item.name+')';
				this.list.push({
					label:labels,
					key:item.first_ip
				});
			});
			// 初始化实例组信息
			if(this.hostsgroupInfo.hosts){
				this.hostId = this.hostsgroupInfo.hostgroup.id;
				this.HostGroupsForm.name = this.hostsgroupInfo.hostgroup.name;
				this.instances = this.hostsgroupInfo.hosts.slice(0);
			}
		},
		methods:{
			popMess(obj){
				const h = this.$createElement;
				var _this = this;
				console.log(obj.data);
		        this.$msgbox({
		          title: '提示',
		          message: h('p', null, [
		            h('span', null, obj.tip),
		            h('i', { style: 'color: teal' }, this.HostGroupsForm.name)
		          ]),
		          showClose:false,
		          showCancelButton: true,
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning',
		          beforeClose: (action, instance, done) => {
		            if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '执行中...';
						var ajaxFunc;
						if(obj.operate==='edit'){
							ajaxFunc = function(){
								return _this.$http.put(obj.url,obj.data);
							}
						}else if(obj.operate==='create'){
							ajaxFunc = function(){
								return _this.$http.post(obj.url,obj.data);
							}
						}
						ajaxFunc().then(res=>{
							this.$emit('create-hosts',res.body.data);
							this.mess = obj.mess;
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
		          this.$message({
		            type: this.messType,
		            message: this.mess,
		            customClass:'pop-mess',
		            center:true
		          });
		        }).catch(_=>{
		        	this.$message({
		        		type: 'info',
		        		message:obj.cancelTip
		        	})
		        });
			},
			// 创建实例组
			createHosts(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// ip分配提示消息
						if(this.isAlter){
							var obj={
								operate:'edit',
								// url:'/monitor/hostgroups/'+this.hostId+'/',
								url:'/monitor/hostgroups/1/',
								data:{"name":this.HostGroupsForm.name,"hosts":this.instances},
								tip:'即将修改实例组',
								mess:'实例组修改成功！',
								cancelTip:'取消修改'
							};
							this.popMess(obj);
						}else{
							var obj={
								operate:'create',
								// url:'/monitor/hostgroups/'+this.hostId+'/',
								url:'/monitor/hostgroups/',
								data:{"name":this.HostGroupsForm.name,"hosts":this.instances},
								tip:'即将创建实例组',
								mess:'实例组创建成功！',
								cancelTip:'取消创建'
							};
							this.popMess(obj);
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			}
		}
	}
</script>
<style lang='less'>
	.createHostGroups{
		.HostGroupsForm{
			.group-name{
				width: 50%;
				max-width: 400px;
				min-width: 350px;
			}
			.createHostsBtn{
				margin-left: 30px;
			}
			.transfer{
				margin-top: 25px;
				.el-transfer-panel{
					width: 250px;
					.el-transfer-panel__body{
						height: 323px;
						.el-transfer-panel__list{
							height:273px;
						}
					}
				}
			}
		}
		
	}
</style>