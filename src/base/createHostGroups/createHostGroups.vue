<template>
	<div class="createHostGroups">
		<el-form class='HostGroupsForm' :model="HostGroupsForm" :rules="HostGroupsRules" ref="HostGroupsForm" label-width="100px">
			<el-form-item label="实例组名称" prop='name'>
				<el-input class='group-name' placeholder="请输入实例组名称" v-model="HostGroupsForm.name"></el-input>
				<el-button type="primary" plain class='createHostsBtn' @click="createHosts('HostGroupsForm')">创建实例组</el-button>
			</el-form-item>
			<el-form-item class='transfer'>
				<el-transfer filterable filter-placeholder="请输入实例名或IP" v-model="instances" :titles="['全部实例列表', '已选实例列表']" :data="list" @change='selectedInst'>
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
			})
		},
		methods:{
			// 选择实例
			selectedInst(){
				this.$emit('select-inst',this.instances);
				console.log(this.instances);
			},
			// 创建实例组
			createHosts(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
					// 	const h = this.$createElement;
					// this.$message({
					// 		message: h('p', null, [
					// 		h('span', null, '机器组名称为 '),
					// 		h('i', { style: 'color: teal' }, 'VNode')
					// 	])
					// });
						this.$http.post('/monitor/hostgroups/',{
							"name": this.HostGroupsForm.name,
							"hosts": this.instances
						}).then(res=>{
							this.$emit('create-hosts',res.body.data);
						})
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
				}
			}
		}
		
	}
</style>