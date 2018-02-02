<template>
	<div class="createInstGroup">
		<div class="createCont o-h p-r">
			<p>{{hostsInfo.title}}</p>
			<el-button class='backBtn p-a' type="danger" plain @click='cancel'>取&nbsp;消</el-button>
			<div class="Settingform">
				<el-form label-width="100px" size="medium" label-position='left'>
					<el-alert class='alarm-title' title="告警对象" type="info" :closable="false" show-icon></el-alert>
					<el-form-item  label-width="0px" prop='binds'>
						<div class="self-selected">
							<el-form-item>
								<create-hosts :is-alter='isAlter' :instance-list='instList' :hostsgroup-info='hostsInfo' @create-hosts='createhostGroups' class='selected-inst'></create-hosts>
							</el-form-item>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import createHosts from 'base/createHostGroups/createHostGroups';
	export default {
		components:{createHosts},
		props:['isAlter','hostsInfo','instList'],
		data() {
			var validateBind = (rule, arr, callback) => {
				if(arr.length){
					callback();
				}else{
					callback(new Error('云主机不能为空！'));
				}
			};
		    return {
		    	isVisible:false//是否显示创建实例组
		    };
		},
	    methods: {
			// 创建机器组
			createhostGroups(obj){
				// 创建成功
				this.$emit('cancel-create',true);
			},
			// 返回宿主机列表页面
			cancel(){
				this.$emit('cancel-create',false);
			}
	    }
	}
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.createInstGroup{
		.createCont{
			padding: 15px 15px 0 15px;
			.backBtn{
				top:5px;
				right: 15px;
			}
			.Settingform{
				// width: 70%;
				padding-top: 25px;
				.alarm-title{
					margin-bottom:20px
				}
				.self-selected{
					width: 85%;
					.selected-inst{
						margin: 20px 0 0 30px;
					}
				}
			}
		}
	}
</style>