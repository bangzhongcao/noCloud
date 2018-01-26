<template>
	<div class="createAlarm">
		<div class="createCont o-h">
			<p>新建告警策略</p>
			<div class="Settingform">
				<el-form :model="alarmForm" :rules="alarmRules" ref="alarmForm" label-width="100px" size="medium" label-position='left'>
					<el-alert class='alarm-title' title="规则信息" type="info" :closable="false" show-icon></el-alert>
					<el-form-item label="规则名称" prop='name'>
						<el-input placeholder="请输入规则名称" v-model="alarmForm.name" class='input-width'></el-input>
					</el-form-item>
					<el-form-item label="父规则" prop="parent_id">
						<el-select v-model="alarmForm.parent_id" filterable clearable :filter-method="parentFilter" placeholder="请输入父规则" class='long-item'>
							<el-option v-for="item in parentAlarms" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-alert class='alarm-title' title="告警策略" type="info" :closable="false" show-icon></el-alert>
					<el-form-item prop='strategies' label-width="0px">
						<custom-table class='customtables'>
							<ul slot='table-header' class='table-headers d-f'>
								<li class='header-item border-r' style='flex-grow:2'>监控项名称</li>
								<li class='header-item border-r'>统计方法</li>
								<li class='header-item border-r'>大小</li>
								<li class='header-item border-r'>阈值</li>
								<li class='header-item operateBtns'>操作</li>
							</ul>
							<div slot='table-body' >
								<ul v-for='(item,index) in MetricLength' class='table-headers d-f' style='padding:8px 0'>
									<li class='header-item perWidth' style='flex-grow:2'>
										<el-select v-model="alarmForm.strategies[index].metric" clearable filterable placeholder="请输入监控项名称" class='itemWidth'>
											<el-option v-for="item in metricList" :key="item.metric" :label="item.name" :value="item.metric"></el-option>
										</el-select>
									</li>
									<li class='header-item'>
										<el-select v-model="alarmForm.strategies[index].func">
											<el-option v-for="item in $store.state.statistic" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</li>
									<li class='header-item'>
										<el-select v-model="alarmForm.strategies[index].op">
											<el-option v-for="item in $store.state.operators" :key="item" :label="item" :value="item">
											</el-option>
										</el-select>
									</li>
									<li class='header-item'>
										<el-input-number v-model="alarmForm.strategies[index].right_value" controls-position="right" :min="0" :max="100"></el-input-number>
									</li>
									<li class='header-item operateBtns'>
										<el-button type="text" @click='deleteMetric(index)'>删除</el-button>
									</li>
								</ul>
							</div>
						</custom-table>
					</el-form-item>
					<el-form-item label-width="0px">
						<el-button type="success" plain round @click="addMetric()">
							<i class='fa fa-plus'></i>
							<span>添加</span>
						</el-button>
					</el-form-item>
					<el-alert class='alarm-title' title="选择告警对象" type="info" :closable="false" show-icon></el-alert>
					<el-form-item  label-width="0px">
						<el-form-item label='告警对象'>
							<el-radio v-model="alarmObj" :label='isAll'>所有实例</el-radio>
							<el-radio v-model="alarmObj" :label='!isAll'>自选实例</el-radio>
						</el-form-item>
						<div class="self-selected" v-if='!alarmObj'>
							<el-form-item label='数据中心' v-if='hostGroups_list.length'>
								<el-radio-group v-model="avail_zone" size="small">
									<el-radio v-for='item in hostGroups_list' :key='item.name' :label="item.name" border></el-radio>
								</el-radio-group>
							</el-form-item>
							<el-collapse style='margin-top:20px'>
					  			<el-collapse-item>
								    <template slot="title">
								      新建实例组&nbsp;<i class="header-icon el-icon-info"></i>
								    </template>
									<el-form-item>
										<create-hosts :instance-list='instList' @create-hosts='createhostGroups' @select-inst='changeInst' class='selected-inst'></create-hosts>
									</el-form-item>
								</el-collapse-item>
							</el-collapse>
						</div>
					</el-form-item>
				</el-form>
			</div>
			<div class="createInfo">
				<div class="btns ta-r">
					<el-button type="danger" plain @click="submitForm('alarmForm')">
						<i class='fa fa-gear'></i>
						<span>创&nbsp;建</span>
					</el-button>
					<el-button type="info" plain @click='cancel'>取&nbsp;消</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import customTable from 'base/tables/customTable';
	import createHosts from 'base/createHostGroups/createHostGroups';
	export default {
		props:['alarmData'],
		components:{customTable,createHosts},
		data() {
			var validateStrategies = (rule, arr, callback) => {
				var flag = true;
				for(var i in arr){
					if(!arr[i].metric){
						flag = false;
						callback(new Error('监控项名称不能为空！'));
					}
				}
				if(flag){
					callback();
				}
			};
		    return {
		    	parentAlarms:[],//父规则列表
		    	merticData:[],
		    	metricList:[],//监控项列表
		    	MetricLength:[1],//添加监控项
		    	isAll: true,
		    	alarmObj: true,
		    	avail_zone:'',
		    	hostGroups_list:[],//机器组列表
		    	alarmForm:{
		    		name:'',
		    		parent_id:'',
		    		strategies:[
		    			{
		    				metric:'',
				    		func:'avg',
				    		op:'==',
				    		right_value: 0
		    			}
		    		],
		    	},
		    	alarmRules:{
		    		name:[
		    			{ required: true, message: '请输入规则名称', trigger: 'change' }
		    		],
		    		parent_id:[
		    			{ required: true, message: '请输入父规则名称', trigger: 'change' }
		    		],
		    		strategies:[
		    			{ validator: validateStrategies, trigger: 'change'}
		    		]
		    	}
		    };
		},

	    created(){
	    	this.parentAlarms = this.alarmData.slice(0);
	    	this.$http.get('/monitor/metrics/').then((res)=>{
	    		this.merticData = res.body.data;
	    		this.metricList = this.merticData.slice(0);
	    		// 获取实例列表
	    		this.$http.get('/monitor/hostgroups/').then(res=>{
	    			this.hostGroups_list = res.body.data;
	    			if(this.hostGroups_list.length){
	    				this.avail_zone = this.hostGroups_list[0].grp_name;//机器组的默认值
	    			}
	    			this.$http.get('/noec2/instances').then(res=>{
	    				this.instList = res.body.data;
	    			})
	    		});
	    	})
	    },
	    methods: {
	    	//进入下一步||创建虚拟机
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('success!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 父规则过滤
			parentFilter(v){
				this.parentAlarms = this.alarmData.filter((item)=>{
					var str = v.toLowerCase();
					return item.name.toLowerCase().indexOf(str)>-1;
				})
			},
			// 删除监控项
			deleteMetric(index){
				if(this.MetricLength.length > 1){
					this.alarmForm.strategies.splice(index,1);
					this.MetricLength.splice(index,1);
				}
			},
			// 增加监控项
			addMetric(){
				var length = this.MetricLength.length;
				var obj = { metric:'',func:'avg',op:'==',right_value: 0 };
				this.$set(this.alarmForm.strategies,length,obj);
				this.MetricLength.push(1);
				console.log(this.alarmForm.strategies);

			},
			// 选定机器实例
			changeInst(arr){
				console.log(arr);
			},
			// 创建机器组
			createhostGroups(obj){
				this.hostGroups_list.push(obj);
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
	.createAlarm{
		.createCont{
			padding: 15px 15px 0 15px;
			.Settingform{
				// width: 70%;
				padding-top: 25px;
				.alarm-title{
					margin-bottom:20px
				}
				.customtables{
					.border-r{
						border-right: 1px solid #d0d0d0;
					}
					.header-item{
						flex-basis:0;
						flex-grow: 1;
						margin: 4px 5px;
						.itemWidth{
							width: 85%;
						}
					}
					.operateBtns{
						flex:none;
						width:100px;
					}
				}
				.self-selected{
					margin-top: 25px;
					width: 85%;
					.selected-inst{
						margin: 20px 0 0 30px;
					}
				}
				.input-width{
					width: 350px;
				}
				.long-item{
					min-width: 400px;
					width: 45%;
				}
			}
			.createInfo{
				margin-top: 15px;
				padding-right: 45px;
			}
		}
	}
</style>