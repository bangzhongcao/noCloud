<template>
	<div class="createHostGroups">
		<el-form class='HostGroupsForm' :model="HostGroupsForm" :rules="HostGroupsRules" ref="HostGroupsForm" label-width="100px">
			<el-form-item label="实例组名称" prop='name'>
				<el-input class='group-name' placeholder="请输入实例组名称" v-model="HostGroupsForm.name"></el-input>
				<el-button type="primary" plain class='createHostsBtn' @click="createHosts('HostGroupsForm')">创建实例组</el-button>
			</el-form-item>
			<el-form-item class='transfer'>
				<el-transfer filterable filter-placeholder="请输入实例名或IP" v-model="instances" :titles="['全部实例列表', '已选实例列表']" :data="list">
    			</el-transfer>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<script type="text/javascript">
	export default{
		props:['instanceList'],
		data(){
			return{
				instances:[],//选定的实例
				list:[],//实例列表
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
		created(){
			this.instanceList.forEach((item,index)=>{
				var labels = item.first_ip+' ('+item.name+')';
				this.list.push({
					label:labels,
					key:item.first_ip
				});
			});
		},
		methods:{
			// 创建实例组
			createHosts(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// ip分配提示消息
						const h = this.$createElement;
				        this.$msgbox({
				          title: '提示',
				          message: h('p', null, [
				            h('span', null, '即将创建实例组 '),
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
								this.$http.post('/monitor/hostgroups/',{
									"name": this.HostGroupsForm.name,
									"hosts": this.instances
								}).then(res=>{
									this.$emit('create-hosts',res.body.data);
									this.mess = '实例组创建成功！';
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
				        });
						
					} else {
						alert('error submit!!');
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
				}
			}
		}
		
	}
</style>