<template>
	<div class="createPanel">
		<div class="steps">
			<el-steps :active="step" finish-status="finish" simple>
				<el-step title="选择配置" icon="el-icon-setting"></el-step>
				<el-step title="选择IP" icon="el-icon-tickets"></el-step>
			</el-steps>
		</div>
		<div class="createCont o-h">
			<div class="createInfo f-r">
				<p class='title'>创建云主机信息</p>
				<div class="info">
					<div v-for='(item,key) in ruleForm'>
						<p class='row-info' v-show="(item||item===0)&&key!=='owner'&&key!=='name_suffix_begin'">
							<label>{{Chinesization[key]}}:</label>
							<span class='info-cont'>{{key==='image'?item[1]:item}}</span>
						</p>
						<p class='row-info' v-show="(item||item===0)&&key==='owner'">
							<label>{{Chinesization[key]}}:</label>
							<span class='info-cont'>{{item['label']}}</span>
						</p>
						<p class='row-info' v-show="item&&key==='name_suffix_begin'">
							<label>{{Chinesization[key]}}:</label>
							<span class='info-cont'>{{item}}</span>
						</p>
					</div>
					<div v-for='(item,key) in IPForm'>
						<p class='row-info' v-show="item&&key==='ippool_id'">
							<label>{{Chinesization[key]}}:</label>
							<span class='info-cont'>{{item}}</span>
						</p>
						<p class='row-info' v-show="item.length&&key==='ip_addr_set'">
							<label>{{Chinesization[key]}}:</label>
							<span class='info-cont'>{{item}}</span>
						</p>
					</div>
				</div>
				<div class="btns ta-c">
					<el-button type="primary" plain v-show='!isSetting' @click='backSetting'>上一步</el-button>
					<el-button type="success"plain v-show='isSetting' @click="submitForm('ruleForm')">下一步</el-button>
					<el-button type="danger" plain v-show='!isSetting' @click="submitForm('IPForm')">
						<i class='fa fa-gear'></i>
						<span>创&nbsp;建</span>
					</el-button>
					<el-button type="info" plain @click='cancel'>取&nbsp;消</el-button>
				</div>
			</div>
			<div class="Settingform form f-l" v-show='isSetting'>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :size="$store.state.Size" label-position='left'>
					<el-form-item label="机房" prop="availability_zone">
						<el-radio-group v-model="ruleForm.availability_zone">
							<el-radio-button label="亦庄"></el-radio-button>
							<el-radio-button label="北显"></el-radio-button>
							<el-radio-button label="MIS-1"></el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="CPU" prop="vcpus">
						<el-radio-group v-model.number="ruleForm.vcpus">
							<el-radio-button label="1">1核</el-radio-button>
							<el-radio-button label="2">2核</el-radio-button>
							<el-radio-button label="4">4核</el-radio-button>
							<el-radio-button label="8">8核</el-radio-button>
							<el-radio-button label="12">12核</el-radio-button>
							<el-radio-button label="16">16核</el-radio-button>
							<el-radio-button label="24">24核</el-radio-button>
							<el-radio-button label="32">32核</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="内存" prop="ram_mb">
						<el-radio-group v-model.number="ruleForm.ram_mb">
							<el-radio-button label="1">1GB</el-radio-button>
							<el-radio-button label="2">2GB</el-radio-button>
							<el-radio-button label="4">4GB</el-radio-button>
							<el-radio-button label="8">8GB</el-radio-button>
							<el-radio-button label="16">16GB</el-radio-button>
							<el-radio-button label="24">24GB</el-radio-button>
							<el-radio-button label="32">32GB</el-radio-button>
							<el-radio-button label="48">48GB</el-radio-button>
							<el-radio-button label="64">64GB</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="数据盘" prop="ephemeral_disk_gb">
						<el-input-number v-model="ruleForm.ephemeral_disk_gb" :min="0" :max="1500"></el-input-number>
						<span>GB</span>
					</el-form-item>
					<el-form-item label="操作系统" prop="image" size='medium'>
						<el-cascader :options="$store.state.osType" :show-all-levels="false" v-model="ruleForm.image" expand-trigger="hover" @change='changeOS' class='long-item'></el-cascader>
					</el-form-item>
					<el-form-item label="系统盘">
						<el-input placeholder="请输入内容" v-model="ruleForm.ephemeral_disk" :readonly="true" style='width:200px'></el-input>
					</el-form-item>
					<el-form-item label="创建数量" prop="total">
						<el-input-number v-model="ruleForm.total" :min="1" :max="500" @change='alterTotal'></el-input-number>
					</el-form-item>
					<el-form-item label="联系人" prop="owner">
						<el-select v-model="ruleForm.owner" filterable clearable :filter-method="ownerFilter" placeholder="请输入联系人" class='long-item'>
							<el-option v-for="item in ownerlist" :key="item.value" :label="item.label" :value="item">
								<span class='f-l'>{{ item.label }}</span>
      							<span class='f-r'style="color:#8492a6;font-size:13px">{{item.email.split('@')[0] }}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="root密码" prop="adminPass">
						<el-input v-model.trim="ruleForm.adminPass" placeholder="请输入root密码" class='long-item'></el-input>
						<el-button type="danger" @click='generatePass' plain>自动生成</el-button>
					</el-form-item>
					<el-form-item label="虚拟机名称">
						<el-input placeholder="请输入虚拟机名称" v-model.trim="ruleForm.name" style='width:200px'@change='changeName'></el-input>
					</el-form-item>
					<el-form-item label="起始编号" v-if='ruleForm.name'>
						<el-input-number v-model="ruleForm.name_suffix_begin" controls-position="right" :min='0'></el-input-number>
					</el-form-item>
					<el-form-item label="是否集中创建">
						<el-checkbox v-model="ruleForm.is_uneven">是否集中</el-checkbox>
					</el-form-item>
				</el-form>
			</div>
			<div class="Ipform form f-l" v-show='!isSetting'>
				<el-form :model="IPForm" :rules="IPrules" ref="IPForm" label-width="80px" :size="$store.state.Size" label-position='left'>
					<el-form-item label="网络" prop="netWork">
						<el-select v-model="IPForm.netWork" class='long-item' @change="changeNetwork" placeholder="请选择网络">
							<el-option v-for="item in networkList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="IP池" prop="ippool_id">
						<el-select v-model="IPForm.ippool_id" class='long-item' @change="changeIPpool" placeholder="请选择IP池">
							<el-option v-for="item in ipPool" :key="item.id" :label="item.availability_zone.name+' : '+item.first_ip+'-'+item.last_ip" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="可用IP" prop="ips" v-if='isAvailable'>
						<div class='ips-label d-ib va-t'>
							<span class='Number'>({{ipInfo.len}}个)</span>
						</div>
						<div class='d-ib va-m ips-content' v-show='ipInfo.len'>
							<p v-for='item in ipInfo.items'>{{item}}</p>
						</div>
						<div class='d-ib va-m ips-content' v-show='!ipInfo.len'>
							<p>没有可用的IP</p>
						</div>
					</el-form-item>
					<el-form-item label="创建数量" prop="total" v-if='isAvailable'>
						<el-input-number v-model="IPForm.total" :min="1" :max="500" :disabled="true"></el-input-number>
					</el-form-item>
					<el-collapse v-if='isAvailable&&ipInfo.len>0' style='width:600px'>
					  <el-collapse-item>
					    <template slot="title">
					      高级选项<i class="header-icon el-icon-info"></i>
					    </template>
					    <el-form :model="allocForm" :rules="allocRules" ref="allocForm" label-width="100px" :size="$store.state.Size" label-position='left'>
						    <el-form-item label="IP分配方式">
								<el-select v-model="allocForm.mode" class='long-item' placeholder="请选择IP池" @change='changeAllocType'>
									<el-option v-for="(value,key) in allocMode" :key="key" :label="value" :value="key">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="指定数量" v-if="allocForm.mode==='ip_count'" prop='ip_count'>
								<el-input-number v-model="allocForm.ip_count" :min="1" :max="ipInfo.len" class='long-item'></el-input-number>
							</el-form-item>
							<el-form-item label="指定IP地址" v-if="allocForm.mode==='ip_addr'" prop='ip_addr'>
								<el-input v-model="allocForm.ip_addr" placeholder="请输入指定IP地址" class='long-item'></el-input>
							</el-form-item>
							<el-form-item label="指定IP范围" v-if="allocForm.mode==='ip_range'" prop='ip_range'>
								<el-input v-model="allocForm.ip_range" placeholder="请输入指定IP范围" class='long-item'></el-input>
							</el-form-item>
							<div class="alloc-btn ta-r">
								<el-button type="success" plain v-show='!isSetting' @click="submitForm('allocForm')">
									<i class='fa fa-wrench'></i>
									<span>分配IP</span>
								</el-button>
							</div>
							<el-transfer class='ip-transfer' filterable :filter-method="filterMethod" filter-placeholder="请输入IP" v-model="allocatedIps" :titles="['可用IP列表', '已选择IP列表']" :data="iplist" @change='changeAllocated' v-if='isSelected'>
						    </el-transfer>
						</el-form>
					  </el-collapse-item>
					</el-collapse>
				</el-form>
				
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
		var validateIPtotal = (rule, value, callback) => {
			if (value > this.ipInfo.len) {
				callback(new Error('可用IP数量小于创建虚拟机数量!（请修改创建虚拟机数量或更换IP池）'));
			} else {
				callback();
			}
		};
	    return {
	      	step:1,
	      	// Size:'small',//初始表单的size
	      	Chinesization:{
	      		'availability_zone':'机房',
	      		'vcpus':'CPU(核)',
	      		'ram_mb':'内存(GB)',
	      		'image':'操作系统',
	      		'ephemeral_disk':'系统盘',
	      		'ephemeral_disk_gb':'数据盘(GB)',
	      		'name':'虚拟机名称',
	      		'name_suffix_begin':'主机名后缀编号起始值',
	      		'is_uneven':'是否集中创建',
	      		'total':'创建数量',
	      		'owner':'联系人',
	      		'adminPass':'root密码',
	      		'ippool_id':'ip池id',
	      		'ip_addr_set':'候选ip地址列表'
	      	},
	      	isSetting:true,//初始显示配置表单
      		// 所有的用户信息
      		ownerlist:[],
      		owners:[],
      		// 网络列表
      		networkList:[],
      		// ip池列表
      		ipPool:[],
      		// 可用ip信息
      		ipInfo:{},
      		// 显示可用IP
      		isAvailable:false,
      		// 1、选择配置表单
	        ruleForm: {
	          availability_zone: '亦庄',//机房
	          vcpus: '1',
	          ram_mb:'1',//内存
	          ephemeral_disk_gb:0,//数据盘
	          image:['Rhel','rhel-6.8-server_0817'],//操作系统类型
	          ephemeral_disk:'Rhel 12GB',//磁盘
	          name:'',//虚拟机名称
	          name_suffix_begin:0,
	          is_uneven:false,//是否集中
	          total:1,//创建数量
	          owner:'',//联系人
	          adminPass:''//root密码
	        },
	        rules: {
	          availability_zone: [
	            { required: true, message: '请选择机房', trigger: 'change' }
	          ],
	          vcpus: [
	            { required: true, message: '请选择cpu', trigger: 'change' }
	          ],
	          ram_mb: [
	            { required: true, message: '请选择内存', trigger: 'change' }
	          ],
	          image: [
	            { required: true, message: '请选择操作系统', trigger: 'change' }
	          ],
	          ephemeral_disk_gb: [
	            { required: true, message: '请填写数据盘', trigger: 'change' }
	          ],
	          total: [
	            { required: true, message: '请输入创建数量', trigger: 'change' }
	          ],
	          owner: [
	            { required: true, message: '请选择联系人', trigger: 'change' }
	          ],
	          adminPass: [
	            { required: true, message: '请输入密码', trigger: 'change' },
	            { min: 6, max: 30,  message: '长度在6到30个字符'}
	          ]
	        },
	        // 2、选择IP表单
		    IPForm:{
		    	netWork:'',//网络
		    	ippool_id:'',//ip池
		    	ips:'',//显示该ip池下所有可用ip列表
		    	total:1,
		    	ip_addr_set:[]//分配可用ip列表
		    },
		    IPrules:{
		    	netWork: [
		            { required: true, message: '请选择网络', trigger: 'change' }
		        ],
		        ippool_id: [
		            { required: true, message: '请选择ip池', trigger: 'change' }
		        ],
		        total:[
		        	{ validator: validateIPtotal, trigger: 'change' }
		        ]
		    },
		    
		    // 3、IP分配表单
		    allocMode:{
		    	ip_count:'指定数量',
		    	ip_addr:'指定地址',
		    	ip_range:'指定范围'
		    },
		    allocForm:{
		    	mode:'ip_count',
		    	ip_count:1,
		    	ip_addr:'',
		    	ip_range:''
		    },
		    allocRules:{
		    	ip_count: [
		            { required: true, message: '请输入所需IP数量', trigger: 'change' }
		        ],
		        ip_addr: [ 
		            { required: true, message: '请输入指定IP地址', trigger: 'blur' },
		            { pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/, message: '请输入正确的IP地址' }
		        ],
		        ip_range: [
		            { required: true, message: '请输入指定IP范围', trigger: 'change' },
		            { pattern: /^((((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9]))\-(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])))$/, message: '请输入正确的IP范围' }
		        ]
		    },
		    // 选择可分配列表的搜索框
		    filterMethod(query, item) {
				return item.value.indexOf(query) > -1;
			},
			// 生成的可用ip地址数组
			iplist:[],//生成的可分配ip数据
		    allocatedIps:[],//选择的IP索引数组
		    isSelected:false,//是否显示分配ip地址穿梭框
		    // 提示消息类型和内容
		    messType:'success',
		    mess:''
	      };
	    },

	    created(){
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
	    },
	    methods: {
	    	//进入下一步||创建虚拟机
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(formName==='ruleForm'){
							this.isSetting = false;
							this.step = 2;
							// 获取网络
				            this.$http.get('/noec2/network').then(res=>{
				            	this.networkList = res.body.data;
				            })
						}else if(formName==='IPForm'){
							var createData = {};
							// 构建创建虚拟机数据请求
							// ruleForm
							for(var key in this.ruleForm){
								if(key!=='phemeral_disk'){
									if(key==='image'){
										createData[key] = this.ruleForm[key][1];
									}else if(key==='owner'){
										createData[key] = this.ruleForm[key]['value'];
									}else if(key==='vcpus'){
										createData[key] = Number(this.ruleForm[key]);
									}else if(key==='ram_mb'){
										createData[key] = Number(this.ruleForm[key]);
									}else{
										createData[key] = this.ruleForm[key];
									}
								}
							}
							// IPForm
							for(var k in this.IPForm){
								if(k==='ippool_id'){
									createData[k] = this.IPForm[k];
								}else if(k==='ip_addr_set'){
									if(this.IPForm[k].length){
										createData[k] = this.IPForm[k];
									}
								}
							}

							// 创建虚拟机
							const h = this.$createElement;
					        this.$msgbox({
					            title: '提示',
					            message: h('p', null, [
					                h('span', null, '即将创建虚拟机')
					            // h('i', { style: 'color: teal' }, 'VNode')
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
					                this.$http.post("/noec2/instances",{ data:createData },
					                {
							            'headers': {
							                'Content-Type': 'x-www-form-urlencoded'
							            }
							        }).then(res=>{
										var status = res.body.result;
										console.log(res);
								        this.mess = '虚拟机创建成功！';
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
					        		message:'取消创建'
					        	});
					        });
							// alert('submit!');
						}else if(formName==='allocForm'){
							// 进行可用IP的分配
							// 可用IP清空
							this.iplist = [];
					    	this.allocatedIps = [];
					    	this.IPForm.ip_addr_set = [];
					    	// 构造数据
							var mthd = this.allocForm.mode;
							var data = {
								'method':mthd,
								'ippool_id':this.IPForm.ippool_id
							}
							if(mthd==='ip_count'){
								data.ip_count = this.allocForm[mthd];
							}else if(mthd === 'ip_addr'){
								data.ip_addr = this.allocForm[mthd];
							}else{
								data.ip_range = this.allocForm[mthd];
							}
							// 分配可用IP
							// ip分配提示消息
							const h = this.$createElement;
					        this.$msgbox({
					          title: '提示',
					          message: h('p', null, [
					            h('span', null, '即将分配IP ')
					            // h('i', { style: 'color: teal' }, 'VNode')
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
					              this.$http.get("/noec2/ippools/allcIP").then(
					              	res=>{
										var ipdata = res.body.data;
										ipdata.forEach((ip, index) => {
								          this.iplist.push({
								            label: ip,
								            key: index,
								            value: ip
								          });
								        });
								        this.mess = 'IP分配成功！';
								        this.messType = 'success';
								        // 显示穿梭框
								        this.isSelected = true;
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
					        		type:'info',
					        		message:'取消分配'
					        	});
					        });
							
							// this.$http.post("/noec2/ippools"+this.IPForm.ippool_id+"",{
							// 	'method':mthd,
							// 	'ippool_id':this.IPForm.ippool_id,
							// 	mthd:this.allocForm[this.allocForm.mode]
							// },(res)=>{

							// })
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 改变操作系统
			changeOS(v){
				this.ruleForm.ephemeral_disk = v[0]+' 12GB';
			},
			// 修改虚拟机名称
			changeName(v){
				if(!v){
					this.ruleForm.name_suffix_begin = 0;
				}
			},
			// 更改创建数量
			alterTotal(v){
				this.IPForm.total = v;
			},
			// 联系人搜索
			ownerFilter(v){
				this.ownerlist = this.owners.filter((item)=>{
					return item.label.indexOf(v)>-1||item.email.indexOf(v)>-1;
				})
			},
			// 自动生成密码
			generatePass(){
				var length = 9,
	            charset = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789.*?&%+!@#$^=><",
	            retVal = "";
		        for (var i = 0, n = charset.length; i < length; ++i) {
		            retVal += charset.charAt(Math.floor(Math.random() * n));
		        }
		        this.ruleForm.adminPass = retVal;
			},
			// 上一步
			backSetting(){
				this.isSetting = true;
				this.step = 1;
			},
			// 返回宿主机列表页面
			cancel(){
				this.$emit('cancel-create',false);
			},
			// 选择IP页面
			// 选择网络事件
			changeNetwork(id){
				this.IPForm.ippool_id = '';
				this.isAvailable = false;
				// 获取ip池
				this.$http.get('/noec2/ippools').then(res=>{
					this.ipPool = res.body.data[id];
				});
			},
			// 选择IP池事件
			changeIPpool(id){
				this.isAvailable = false;
				// 重置高级选项中的值
				// IP分配方式
				this.allocForm.mode = 'ip_count';
				this.allocForm.ip_count = 1;
				// 可用IP
				this.iplist = [];
		    	this.allocatedIps = [];
		    	this.IPForm.ip_addr_set = [];
				this.$http.get('/noec2/ippools',{ params: { ippool_id:id } }).then(res=>{
					this.ipInfo = res.body.data;
					this.IPForm.ips = this.ipInfo.items;
					this.isAvailable = true;
				})
			},
			// 更改分配方式，穿梭框隐藏
			changeAllocType(){
				this.isSelected = false;
				// 可用IP清空
				this.iplist = [];
		    	this.allocatedIps = [];
		    	this.IPForm.ip_addr_set = [];
			},
			// 选择可用IP
			changeAllocated(){
				this.IPForm.ip_addr_set = [];
				for(var i=0;i<this.allocatedIps.length;i++){
					this.IPForm.ip_addr_set.push(this.iplist[this.allocatedIps[i]].value);
				}
			}
	    }
	}
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.createPanel{
		.steps{
			padding: 10px;
			// border-bottom: 10px solid @colorBackground;
		}
		.createCont{
			padding: 15px 0 0 15px;
			.form{
				// padding-right: 360px;
				.long-item{
					width:360px;
				}
				.ips-label{
					color:#888;
					margin-right:6px;
					.Number{
						font-weight:700;
					}
				}
				.ips-content{
					width:300px;
					line-height: 24px;
					padding:5px;
					border:1px solid #67c23a;
					border-radius:4px;
				}
				.alloc-btn{
					width: 600px;
					padding-bottom: 20px;
					border-bottom: 1px solid #e0e0e0;
				}
				.ip-transfer{
					padding-top: 30px;
				}
			}
			.createInfo{
				margin-top: 15px;
				width: 25%;
				max-width: 300px;
				padding-left: 10px;
				border-left: 1px dotted #ccc;
				.title{
					line-height: 34px;
					font-size: 20px;
					border-bottom: 1px solid #b0b0b0;
				}
				.info{
					padding: 10px 5px;
					.row-info{
						line-height: 30px;
						font-size: 15px;
						.info-cont{
							font-size:17px;
							font-weight:700
						}
					}
				}
			}
		}
	}
</style>