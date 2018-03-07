<template>
	<div class="contactPanel">
		<div class="panelCont o-h p-r">
			<p>{{Title}}</p>
			<el-button class='backBtn p-a' type="danger" plain @click='cancel'>取&nbsp;消</el-button>
			<div class="Settingform">
				<el-form :model="contactsForm" :rules="Contacts" ref="contactsForm" label-width="120px" size="medium" label-position='left'>
					<el-alert class='alarm-title' title="联系人组" type="info" :closable="false" show-icon></el-alert>
					<el-form-item label="联系人组名称" prop='name'>
						<el-input class='self-selected' v-model.trim="contactsForm.name" placeholder="请输入联系人组名称"></el-input>
					</el-form-item>
					<el-form-item  label="联系人列表" prop='users'>
						<el-select class='self-selected'  v-model="contactsForm.users" filterable multiple  placeholder="请选择联系人" >
							<el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value">
								<span class='f-l'>{{ item.label }}</span>
      							<span class='f-r'style="color:#8492a6;font-size:13px">{{item.email.split('@')[0] }}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='联系组描述'>
						<el-input class='self-selected' type="textarea" :autosize="{ minRows: 4, maxRows: 1000}" placeholder="请输入内容"
						  v-model="contactsForm.resume">
						</el-input>
					</el-form-item>
					<el-form-item class='o-h' style='width:700px'>
						<el-button class='f-r' type="primary" @click="submitForm('contactsForm',Title)">确&nbsp;定</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:['isAlter','userList','contactInfo','Title'],
		mounted(){
			if(this.contactInfo.length){
				this.contactsForm.name = this.contactInfo[0].name;
				this.contactsForm.users = this.contactInfo[0].users.slice(0);
			}else{
				this.contactsForm.name = '';
				this.contactsForm.users = [];
			}
			
		},
		data() {
		    return {
		    	isVisible:false,//是否显示创建实例组
		    	contactsForm:{
		    		name:'',
		    		users:[],
		    		resume:''//简要描述
		    	},
		    	Contacts:{
		    		name: [
		                { required: true, message: '请输入联系人组名称', trigger: 'change' }
		            ],
		            users: [
		                { required: true, message: '请选择联系人', trigger: 'change' }
		            ]
		    	}
		    };
		},
	    methods: {
			// 返回宿主机列表页面
			cancel(){
				this.$emit('cancel-pop',false);
			},
			popMess(obj){
				const h = this.$createElement;
				var _this = this;
		        this.$msgbox({
		          title: '提示',
		          message: h('p', null, [
		            h('span', null, obj.tip),
		            h('i', { style: 'color: teal' }, this.contactsForm.name)
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
							this.$emit('cancel-pop',true);
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
			// 提交表单
			submitForm(formName,op) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 创建虚拟机
						if(op==='创建联系人组'){
							var obj={
								operate:'create',
								// url:'/monitor/teams/',
								url:'/monitor/teams/',
								data:this.contactsForm,
								tip:'即将创建联系人组',
								mess:'联系人组创建成功！',
								cancelTip:'取消创建'
							};
							this.popMess(obj);
						}else{
							var obj={
								operate:'edit',
								// url:'/monitor/teams/'+this.contactsForm.id+'/',
								url:'/monitor/teams/1/',
								data:this.contactsForm,
								tip:'即将修改联系人组',
								mess:'联系人组修改成功！',
								cancelTip:'取消修改'
							};
							this.popMess(obj);
						}
						
					}
				});
			}
	    }
	}
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.contactPanel{
		.panelCont{
			padding: 15px 15px 0 15px;
			.backBtn{
				top:5px;
				right: 15px;
			}
			.Settingform{
				// width: 70%;
				padding-top: 25px;
				padding-left: 30px;
				.alarm-title{
					margin-bottom:20px;
					margin-left: -30px;
				}
				.self-selected{
					width:500px;
					.selected-inst{
						margin: 20px 0 0 30px;
					}
				}
			}
		}
	}
</style>