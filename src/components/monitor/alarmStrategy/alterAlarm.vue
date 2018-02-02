<template>
	<div class="alterAlarm">
		<div class="alterCont o-h p-r">
			<p>修改告警规则</p>
			<el-button class='backBtn p-a' type="info" plain @click='back'>返&nbsp;回</el-button>
			<div class="Settingform">
				<el-form :model="alarmInfoForm" :rules="alarmInfoRules" ref="alarmInfoForm" label-width="100px" size="medium" label-position='left'>
					<el-alert class='alarm-title' title="规则信息" type="info" :closable="false" show-icon></el-alert>
					<el-form-item label="规则名称" prop='name'>
						<el-input placeholder="请输入规则名称" v-model.trim="alarmInfoForm.name" :disabled='isRuleInfoDis' class='input-width'></el-input>
					</el-form-item>
					<el-form-item label="父规则" prop="parent_id">
						<el-select v-model="alarmInfoForm.parent_id" filterable clearable :filter-method="parentFilter" placeholder="请输入父规则" class='long-item' :disabled='isRuleInfoDis'>
							<el-option v-for="item in parentAlarms" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label-width="0px">
						<el-button v-if='isRuleInfoDis' type="primary" plain @click="editFunc('alarmInfoForm')">
							<i class='fa fa-pencil'></i>
							<span>编辑规则信息</span>
						</el-button>
						<el-button v-if='!isRuleInfoDis' type="danger" plain @click="submitForm('alarmInfoForm')">
							<i class='fa fa-gear'></i>
							<span>确定修改</span>
						</el-button>
						<el-button v-if='!isRuleInfoDis' type="warning" plain @click="cancelEdit('alarmInfoForm')">
							<i class='fa fa-cogs'></i>
							<span>取消修改</span>
						</el-button>
					</el-form-item>
				</el-form>
				<!-- 告警策略修改 -->
				<el-form :model="strategiesForm" :rules="strategiesRules" ref="strategiesForm" label-width="100px" size="medium" label-position='left' style='margin-top:25px'>
					<el-alert class='alarm-title' title="告警策略" type="info" :closable="false" show-icon></el-alert>
					<el-form-item prop='strategies' label-width="0px">
						<custom-table class='customtables'>
							<ul slot='table-header' class='table-headers d-f'>
								<li class='header-item border-r' style='flex-grow:2'>监控项名称</li>
								<li class='header-item border-r'>统计方法</li>
								<li class='header-item border-r'>大小</li>
								<li class='header-item border-r'>阈值</li>
								<li v-if='!isStrategiesDis' class='header-item operateBtns'>操作</li>
							</ul>
							<div slot='table-body' >
								<ul v-for='(item,index) in MetricLength' class='table-headers d-f' style='padding:8px 0'>
									<li class='header-item perWidth' style='flex-grow:2'>
										<el-select v-model="strategiesForm.strategies[index].metric" clearable filterable placeholder="请输入监控项名称" class='itemWidth' :disabled='isStrategiesDis'>
											<el-option v-for="item in metricList" :key="item.metric" :label="item.name" :value="item.metric"></el-option>
										</el-select>
									</li>
									<li class='header-item'>
										<el-select v-model="strategiesForm.strategies[index].func" :disabled='isStrategiesDis'>
											<el-option v-for="item in $store.state.statistic" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</li>
									<li class='header-item'>
										<el-select v-model="strategiesForm.strategies[index].op" :disabled='isStrategiesDis'>
											<el-option v-for="item in $store.state.operators" :key="item" :label="item" :value="item">
											</el-option>
										</el-select>
									</li>
									<li class='header-item'>
										<el-input-number v-model="strategiesForm.strategies[index].right_value" controls-position="right" :min="0" :max="100" :disabled='isStrategiesDis'></el-input-number>
									</li>
									<li v-if='!isStrategiesDis' class='header-item operateBtns'>
										<el-button type="text" @click='deleteMetric(index)'>删除</el-button>
									</li>
								</ul>
							</div>
						</custom-table>
					</el-form-item>
					<el-form-item label-width="0px">
						<el-button v-if='isStrategiesDis' type="primary" plain @click="editFunc('strategiesForm')">
							<i class='fa fa-pencil'></i>
							<span>编辑监控项</span>
						</el-button>
						<el-button v-if='!isStrategiesDis' type="success" plain round @click="addMetric">
							<i class='fa fa-plus'></i>
							<span>添加</span>
						</el-button>
						<el-button v-if='!isStrategiesDis' type="danger" plain @click="submitForm('strategiesForm')">
							<i class='fa fa-gear'></i>
							<span>确定修改</span>
						</el-button>
						<el-button v-if='!isStrategiesDis' type="warning" plain @click="cancelEdit('strategiesForm')">
							<i class='fa fa-cogs'></i>
							<span>取消修改</span>
						</el-button>
					</el-form-item>
				</el-form>
				<el-form :model="alarmObjForm" :rules="alarmObjRules" ref="alarmObjForm" label-width="100px" size="medium" label-position='left'>
					<el-alert class='alarm-title' title="选择告警对象" type="info" :closable="false" show-icon></el-alert>
					<el-form-item label='实例组' prop='binds' class="self-selected">
						<el-checkbox-group v-model="alarmObjForm.binds" size="small" :disabled='isAlarmObjDis'>
							<el-checkbox v-for='item in bindsHostGroups_list' :key='item.name' :label="item.id" border @change='changeBinds(item.id,item.name)'>{{item.name}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label-width="0px">
						<el-button type="success" plain round :disabled='!isAlarmObjDis' @click="addBind">
							<i class='fa fa-plus'></i>
							<span>添加告警对象</span>
						</el-button>
						<el-button v-if='isAlarmObjDis' type="primary" plain @click="editFunc('alarmObjForm')">
							<i class='fa fa-pencil'></i>
							<span>解&nbsp;绑</span>
						</el-button>
						<el-button v-if='!isAlarmObjDis' type="danger" :disabled='!(unbindArr.length)' plain @click="submitForm('alarmObjForm')">
							<i class='fa fa-gear'></i>
							<span>确定解绑</span>
						</el-button>
						<el-button v-if='!isAlarmObjDis' type="warning" plain @click="cancelEdit('alarmObjForm')">
							<i class='fa fa-cogs'></i>
							<span>取消解绑</span>
						</el-button>
					</el-form-item>
				</el-form>
				<el-form :model="AlarmUicForm" :rules="AlarmUicRules" ref="AlarmUicForm" label-width="100px" size="medium" label-position='left'>
					<el-alert class='alarm-title' title="设置告警接收人" type="info" :closable="false" show-icon></el-alert>
					<div class='uicPanel o-h' v-if='isUicDis'>
						<div class="left f-l">告警接收人：</div>
						<div class="right f-l">
							<p v-for='item in AlarmUicForm.uic'>{{item}}</p>
						</div>
					</div>
					<el-form-item v-if='!isUicDis' label="告警接收人" prop="uic">
						<el-select v-model="AlarmUicForm.uic" filterable multiple placeholder="请选择告警接收人" class='long-item'>
							<el-option v-for="item in team_list" :key="item.team.id" :label="item.team.name" :value="item.team.name"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label-width="0px">
						<el-button v-if='isUicDis' type="primary" plain @click="editFunc('AlarmUicForm')">
							<i class='fa fa-pencil'></i>
							<span>修改告警接收人</span>
						</el-button>
						<el-button v-if='!isUicDis' type="danger" plain @click="submitForm('AlarmUicForm')">
							<i class='fa fa-gear'></i>
							<span>确定修改</span>
						</el-button>
						<el-button v-if='!isUicDis' type="warning" plain @click="cancelEdit('AlarmUicForm')">
							<i class='fa fa-cogs'></i>
							<span>取消修改</span>
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<!-- 设置列表头 -->
			<el-dialog title="新增告警实例组" :visible.sync="isAddBind" :show-close='false' width="45%">
				<div>
					<el-checkbox-group v-model="bindArr" size="small">
						<el-row :gutter="10">
							<el-col :span="8" v-for='item in hostGroups_list' :key='item.name' style='margin-bottom:15px'>
								<el-checkbox  :label="item.id" border :disabled='avail_zone.indexOf(item.id)>=0'>{{item.name}}</el-checkbox>
							</el-col>
						</el-row>
					</el-checkbox-group>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="cancelAdd">取 消</el-button>
					<el-button type="primary" @click="confirmAdd">绑 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import customTable from 'base/tables/customTable';
	import createHosts from 'base/createHostGroups/createHostGroups';
	export default {
		props:['alarmInfoData','parentRuleData'],
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
			var validateUic = (rule, obj, callback) => {
				if(obj.length){
					callback();
				}else{
					callback(new Error('告警接收人不能为空！'));
				}
			};
			var validateBind = (rule, arr, callback) => {
				if(arr.length){
					callback();
				}else{
					callback(new Error('告警对象不能为空！'));
				}
			};
		    return {
		    	parentAlarms:[],//父规则列表
		    	metricList:[],//监控项列表
		    	CloneMetricLength:[],//备份监控项个数
		    	MetricLength:[],//添加监控项 

		    	ruleId:'',//当前规则的id
		    	actionId:'',//告警action的id
		    	strategiesId:'',//告警策略的id

		    	isAddBind:false,//弹出添加实例组的面板
		    	isAll: true,
		    	alarmObj: true,
		    	isRuleInfoDis:true,//规则信息
		    	isStrategiesDis:true,//监控项是否可修改
		    	isAlarmObjDis: true,//监控对象是否可修改
		    	isUicDis:true,//告警接收人是否可修改
		    	avail_zone:[],//选择的机器组列表
		    	hostGroups_list:[],//机器组列表
		    	bindsHostGroups_list:[],//已绑定的机器组列表
		    	team_list:[],//联系组列表
		    	CloneAlarmInfo:{},//备份规则信息
		    	alarmInfoForm:{
		    		name:'',
		    		parent_id:''
		    	},
		    	alarmInfoRules:{
		    		name:[
		    			{ required: true, message: '请输入规则名称', trigger: 'change' }
		    		],
		    		parent_id:[
		    			{ required: true, message: '请输入父规则名称', trigger: 'change' }
		    		]
		    	},
		    	CloneStrategies:[],//备份监控项
		    	strategiesForm:{
		    		strategies:[
		    			{
		    				metric:'',
				    		func:'',
				    		op:'',
				    		right_value: ''
		    			}
		    		]
		    	},
		    	strategiesRules:{
		    		strategies:[
		    			{ validator: validateStrategies, trigger: 'change'}
		    		]
		    	},
		    	CloneAlarmObj:[],//备份监控组(取消功能)
		    	unbindArr:[],//解绑实例组的列表
		    	unbindNames:[],//解绑实例组名称的列表
		    	bindArr:[],//新绑定的实例组列表
		    	alarmObjForm:{
		    		binds:[]
		    	},
		    	alarmObjRules:{
		    		binds:[
		    			{ validator: validateBind, trigger: 'change' }
		    		]
		    	},
		    	CloneSelected_uic:[],//已选择的接收人
		    	AlarmUicForm:{
		    		uic:[]
		    	},
		    	AlarmUicRules:{
		    		uic:[
		    			{ validator: validateUic, trigger: 'change' }
		    		]
		    	}
		    };
		},

	    created(){
	    	this.parentAlarms = this.parentRuleData.slice(0);
	    	// 获取所有监控项列表
	    	this.$http.get('/monitor/metrics/').then((res)=>{
	    		this.metricList = res.body.data;;
	    		// 获取实例组列表
	    		this.$http.get('/monitor/hostgroups/').then(res=>{
	    			this.hostGroups_list = res.body.data;
	    				// 获取绑定的实例组
		    			this.$http.get('/monitor/rule/11/hostgroup/').then(res=>{
		    				this.bindsHostGroups_list = res.body.data.hostgroups;
		    				for(var i=0;i<this.bindsHostGroups_list.length;i++){
		    					this.alarmObjForm.binds.push(this.bindsHostGroups_list[i].id);
		    				}
		    			});
	    		});
	    	})
	    },
	    mounted(){
	    	// 告警规则信息初始化赋值
	    	this.alarmInfoForm.name = this.alarmInfoData.rule.name;
	    	this.alarmInfoForm.parent_id = this.alarmInfoData.rule.parent_id;
	    	this.ruleId = this.alarmInfoData.rule.id;
	    	this.strategiesId = this.alarmInfoData.strategies.id;
	    	this.actionId = this.alarmInfoData.action.id;
	    	// 已选择的告警接收人列表
	    	this.AlarmUicForm.uic = this.alarmInfoData.action.uic.split(',');
	    	// 告警策略初始化赋值
	    	var strategiesData = this.alarmInfoData.strategies;
	    	for(var i=0;i<strategiesData.length;i++){
	    		this.MetricLength.push(1);
	    		this.$set(this.strategiesForm.strategies,i,this.strategiesForm.strategies[0]);
	    		this.strategiesForm.strategies[i].metric = strategiesData[i].metric;
	    		this.strategiesForm.strategies[i].func = strategiesData[i].func;
	    		this.strategiesForm.strategies[i].right_value = strategiesData[i].right_value;
	    		this.strategiesForm.strategies[i].op = strategiesData[i].op;
	    	}
	    	// 获取联系人组
	    	this.$http.get('/monitor/teams/').then(res=>{
	    		this.team_list = res.body.data;
	    	});
	    },
	    methods: {
	    	// 弹窗确认
	    	popMess(obj){
	    		const h = this.$createElement;
	    		// 显示所选择解绑的实例组
	    		if(obj.formname==='alarmObjForm'){
	    			for(var i=0;i<this.unbindNames.length;i++){
	    				obj.name.push(h('span',{ style: 'color: teal;margin-right:10px' },this.unbindNames[i]));
	    			}
	    		}
		        this.$msgbox({
		          title: '提示',
		          message: h('p', null, [
		            h('span', null, obj.tip),
		            h('p', {style:'word-wrap: break-word;overflow: hidden'}, obj.name)
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
						var _this = this;
						if(obj.type==='post'){
							ajaxFunc = function(){
								return _this.$http.post(obj.url,obj.data);
							}
						}else if( obj.type==='patch'){
							ajaxFunc = function(){
								return _this.$http.patch(obj.url,obj.data);
							}
						}else{
							ajaxFunc = function(){
								return _this.$http.put(obj.url,obj.data);
							}
						}
						ajaxFunc().then(res=>{
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
		          if(obj.formname==='strategiesForm'){
		          	this.isStrategiesDis = true;
		          }else if(obj.formname==='alarmInfoForm'){
		          	this.isRuleInfoDis = true;
		          }else if(obj.formname==='alarmObjForm'){
		          	// 重新获取绑定的实例组
	    			this.$http.get('/monitor/rule/11/hostgroup/').then(res=>{
	    				this.alarmObjForm.binds = [];
	    				this.bindsHostGroups_list = res.body.data.hostgroups;
	    				for(var i=0;i<this.bindsHostGroups_list.length;i++){
	    					this.alarmObjForm.binds.push(this.bindsHostGroups_list[i].id);
	    				}
	    				this.isAlarmObjDis = true;
	    			});
		          }else if(obj.formname === 'AlarmUicForm'){
		          	this.isUicDis = true;
		          }
		        }).catch(_=>{
		        	this.$message({
		        		type:'info',
		        		message:'取消操作'
		        	});
		        });
	    	},
	    	//进入下一步||创建虚拟机
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var obj = {};
						// 提交
						if(formName==='strategiesForm'){
							obj = {
								type:'patch',
								formname:'strategiesForm',
								tip:'确定修改监控项？',
								name:'',
								url:'/monitor/strategies/1',// '/monitor/strategies/'+this.strategiesId
								data:this.strategiesForm.strategies,
								mess:'监控项修改成功！'
							};
							this.popMess(obj);
						}else if(formName === 'alarmInfoForm'){
							obj = {
								type:'patch',
								formname:'alarmInfoForm',
								tip:'确定修改规则信息？',
								name:'',
								url:'/monitor/rules/1',// '/monitor/rules/'+this.ruleId
								data:this.alarmInfoForm,
								mess:'规则信息修改成功！'
							};
							this.popMess(obj);
						}else if(formName === 'alarmObjForm'){
							obj = {
								type:'post',
								formname:'alarmObjForm',
								tip:'确定解绑所选的告警对象？',
								name:[],
								url:'/monitor/rules/1',// '/monitor/rules/'+this.ruleId
								data:{ "action":'unbind',"grp_id":this.unbindArr},
								mess:'告警对象解绑成功'
							};
							this.popMess(obj);
						}else if(formName === 'AlarmUicForm'){
							obj = {
								type:'put',
								formname:'AlarmUicForm',
								tip:'确定修改告警接收人？',
								name:'',
								url:'/monitor/actions/1',// '/monitor/actions/'+this.actionId
								data:{ "uic":this.AlarmUicForm.uic},
								mess:'告警接收人修改成功'
							};
							this.popMess(obj);
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 进入修改
			editFunc(formName){
				if(formName === 'alarmInfoForm'){
					this.isRuleInfoDis = false;
					this.CloneAlarmInfo.name = this.alarmInfoForm.name;
					this.CloneAlarmInfo.parent_id = this.alarmInfoForm.parent_id;
				}else if(formName==='strategiesForm'){
					this.isStrategiesDis = false;
					this.CloneMetricLength = this.MetricLength.slice(0);
					this.CloneStrategies = this.strategiesForm.strategies.slice(0);
				}else if(formName==='alarmObjForm'){
					this.isAlarmObjDis = false;
					this.CloneAlarmObj = this.alarmObjForm.binds.slice(0);
				}else if(formName==='AlarmUicForm'){
					this.isUicDis = false;
					this.CloneSelected_uic = this.AlarmUicForm.uic.slice(0);
				}
			},
			// 取消修改
			cancelEdit(formName){
				if(formName==='alarmInfoForm'){
			    	this.isRuleInfoDis = true;
			    	for(var key in this.CloneAlarmInfo){
			    		this.alarmInfoForm[key] = this.CloneAlarmInfo[key];
			    	}
				}else if(formName==='strategiesForm'){
					this.isStrategiesDis = true;
					// 回到修改前的状态
					this.MetricLength = this.CloneMetricLength.slice(0);
					this.strategiesForm.strategies = this.CloneStrategies.slice(0);
				}else if(formName==='alarmObjForm'){
					this.isAlarmObjDis = true;
					this.alarmObjForm.binds = this.CloneAlarmObj.slice(0);
					this.unbindArr = [];
					this.unbindNames = [];
				}else if(formName==='AlarmUicForm'){
					this.isUicDis = true;
					this.AlarmUicForm.uic = this.CloneSelected_uic.slice(0);
				}
			},
			// 父规则过滤
			parentFilter(v){
				this.parentAlarms = this.parentRuleData.filter((item)=>{
					var str = v.toLowerCase();
					return item.name.toLowerCase().indexOf(str)>-1;
				})
			},
			// 删除监控项
			deleteMetric(index){
				if(this.MetricLength.length > 1){
					this.strategiesForm.strategies.splice(index,1);
					this.MetricLength.splice(index,1);
				}
			},
			// 增加监控项
			addMetric(){
				var length = this.MetricLength.length;
				var obj = { metric:'',func:'avg',op:'==',right_value: 0 };
				this.$set(this.strategiesForm.strategies,length,obj);
				this.MetricLength.push(1);
			},
			// 实例组改变时触发
			changeBinds(id,name){
				// 获取解绑的实例组的id
				var index = this.alarmObjForm.binds.indexOf(id);
				if(index < 0){
					this.unbindArr.push(id);
					this.unbindNames.push(name);
				}else{
					var i = this.unbindArr.indexOf(id);
					this.unbindArr.splice(i,1);
					this.unbindNames.splice(i,1);
				}
			},
			// 弹出添加告警实例组面板
			addBind(){
				// this.avail_zone用来备份上一次绑定的实例
				this.avail_zone = this.alarmObjForm.binds.slice(0);
				this.bindArr = this.avail_zone.slice(0);
				this.isAddBind = true;
			},
			// 确定添加实例组
			confirmAdd(){
				// 绑定新的实例组
				var new_bind = this.bindArr.slice(this.avail_zone.length);
				//   '/monitor/rules/'+this.ruleId
				this.$http.post('/monitor/rules/1',{"action":'bind',"grp_id":new_bind}).then(res=>{
					// 重新获取绑定的实例组
					this.$confirm('确定绑定已选的实例组？','提示',{
						// showClose:false,
						confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
					}).then( _=> {
			          	this.$http.get('/monitor/rule/11/hostgroup/').then(res=>{
			          		this.isAddBind = false;
		    				this.bindsHostGroups_list = res.body.data.hostgroups;
		    				this.alarmObjForm.binds = [];
		    				for(var i=0;i<this.bindsHostGroups_list.length;i++){
		    					this.alarmObjForm.binds.push(this.bindsHostGroups_list[i].id);
		    				}
		    				this.$message({
					            type: 'success',
					            message: '绑定成功!'
				            });
		    			});
		            }).catch(_ => {
		            	this.$message({
				            type: 'info',
				            message: '取消操作'
				        });
		            });
	    			
				});
			},
			// 取消添加实例组
			cancelAdd(){
				this.isAddBind = false;
			},
			// 返回宿主机列表页面
			back(){
				this.$emit('return-back',false);
			}
	    }
	}
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.alterAlarm{
		.alterCont{
			padding: 15px 15px 0 15px;
			.backBtn{
				top:5px;
				right: 15px;
			}
			.Settingform{
				padding-top: 25px;
				.alarm-title{
					margin-bottom:20px
				}
				.strategies{
					width: 450px;
					padding: 10px;
					border: 1px solid #e0e0e0;
					border-radius: 6px;
					background-color: #f5f5f5;
					font-size: 0;
					line-height: 22px;
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
				.uicPanel{
					width: 450px;
					padding: 10px 15px;
					margin-bottom: 20px;
					background-color: #f0f0f0;
					border: 1px solid #d0d0d0;
					border-radius: 6px;
					font-size: 14px;
					color:#555;
					line-height: 22px;
					.left{
						width: 40%;
						color:#a0a0a0;
					}
					.right {
						width: 60%;
					}
				}
				.self-selected{
					margin-top: 25px;
					width: 85%;
				}
				.input-width{
					width: 350px;
				}
				.long-item{
					min-width: 400px;
					width: 45%;
				}
			}
		}
	}
</style>