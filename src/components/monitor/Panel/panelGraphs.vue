<template>
	<div class="panelGraphs">
		<div class="panelCont o-h p-r">
			<p>{{panelName}}面板监控图</p>
			<el-button class='backBtn p-a' type="danger" plain @click='cancel'>取&nbsp;消</el-button>
			<div class="Settingform">
				<el-form>
					<el-form-item class='o-h'>
						<el-button class='addGraphs f-l' type="primary" @click='cancel'><i class='fa fa-plus'></i><span>&nbsp;添加监控视图</span></el-button>
						<el-button class='f-l refresh' round @click='refresh'><i class='el-icon-refresh' title='刷新监控图'></i></el-button>
					</el-form-item>
					<el-alert class='alarm-title' title="监控图" type="info" :closable="false" show-icon></el-alert>
					<el-form-item class='graphsCharts' label-width="0px" prop='binds'>
						<el-form-item class='graphsBox f-l'>
							<div class="chartsHeader">
								<el-date-picker v-model="date" type="datetimerange" :picker-options="pickerOptions"
							      range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center">
							    </el-date-picker>
							</div>
							<div id="Charts" class='graphs'></div>
						</el-form-item>
						<el-form-item class='graphsBox f-r'>
							<div class="chartsHeader">
								<el-date-picker v-model="date" type="datetimerange" :picker-options="pickerOptions"
							      range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center">
							    </el-date-picker>
							</div>
							<div id="Charts" class='graphs'></div>
						</el-form-item>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:['panelsId','panelName'],
		data() {
			return{
				graphsData:{},//监控图中的详细数据
				date:'',//日期
				//日期选择器默认选项
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				currentTime:''//当前时间
			}
		},
		mounted(){
			console.log(this.isCollapse);
			this.drawGraphs();
		},
	    methods: {
	    	drawGraphs(){
				var date = new Date();
	        	var currentTime = date.getTime()/1000;//秒
	        	
	        	// '/monitor/screens/'+this.panelsId+'/graphs/
	        	this.$http.get('/monitor/screens/1/graphs/').then(res=>{
					var graphsArr = res.body.data;
					for(var k in graphsArr){
						var id = graphsArr[k].id;
						var data = {
							"hostnames":graphsArr[k].endpoints,
							"end_time":currentTime,
							"start_time":currentTime - 7200,
							"counters":graphsArr[k].counters,
							"consol_fun": "AVERAGE"
						};

						// 获取每个监控图的详细数据
						var _this = this;
						var getGraphData = function(id,i){
							_this.$http.post('/monitor/history/',data).then(res=>{
								_this.graphsData[id] = res.body.data;
								console.log(data);
								// 基于准备好的dom，初始化echarts实例
			        			var myChart = _this.$echarts.init(document.getElementsByClassName('graphs')[i]);

					        	// 绘制图表
						        myChart.setOption({
						        	grid: {
						        		top:70,
						        		left:15,
						        		right:140,
						        		bottom:15,
						        		containLabel :true
						        	},
						            title: {
								        text: '一天用电量分布',
								        textStyle:{
								        	fontSize:14,
								        	align:'right'
								        }
								    },
								    tooltip: {
								        trigger: 'axis',
								        axisPointer: {
								            type: 'cross'
								        }
								    },
								    legend: {
								        type: 'scroll',
								        orient: 'vertical',
								        right: 10,
								        top: 60,
								        bottom: 20,
								        data:['邮件','MIS','新闻客户端']
								    },
								    toolbox: {
								        show: true,
								        feature: {
								            saveAsImage: {}
								        }
								    },
								    xAxis:  {
								        type: 'category',
								        boundaryGap: false,
								        data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
								    },
								    yAxis: {
								        type: 'value',
								        axisLabel: {
								            formatter: '{value}'
								        },
								        axisPointer: {
								            snap: true
								        }
								    },
								    series: [
								        {
								            name:'邮件',
								            type:'line',
								            smooth: true,
								            data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400]
								        },
								        {
								            name:'MIS',
								            type:'line',
								            smooth: true,
								            data: [200, 180, 350, 360, 290, 320, 350, 100, 300, 290, 480, 490, 480, 540, 430, 550, 600, 510, 500, 600]
								        },
								        {
								            name:'新闻客户端',
								            type:'line',
								            smooth: true,
								            data: [150, 200, 390, 160, 390, 420, 450, 300, 500, 490, 240, 230, 380, 440, 230, 450, 500, 410, 400, 500]
								        }
								    ]
								});
								var charts = document.getElementsByClassName('graphs');
								var canvas = document.getElementsByTagName('canvas');
								canvas[i].style.width = charts[i].offsetWidth+'px';
								canvas[i].parentNode.style.width = charts[i].offsetWidth+'px';
							})
						};
						getGraphData(id,k);
					}
		    	});
	    	},
	    	// 刷新图表
	    	refresh(){
	    		this.drawGraphs();
	    	},
			// 返回宿主机列表页面
			cancel(){
				this.$emit('cancel-define',false);
			}
	    }
	}
</script>

<style scoped lang='less'>
	@import "~common/less/variable.less";
	.panelGraphs{
		.panelCont{
			padding: 15px 15px 0 15px;
			.backBtn{
				top:5px;
				right: 15px;
			}
			.Settingform{
				// width: 70%;
				padding-top: 25px;
				.addGraphs{
					padding: 12px;
				}
				.refresh{
					margin-left: 50px;
					width: 40px;
					line-height: 40px;
					padding: 0;
					font-size: 26px;
					color:#666;
				}
				.alarm-title{
					margin:20px 0;
				}
				.graphsCharts{
					width: 100%;
					margin: 20px 0;
					.graphsBox{
						width: 48%;
						margin:10px 0;
						border-radius: 8px;
						border: 1px solid #a0a0a0;
						background-color: #efefef;
						.chartsHeader{
							border-radius: 10px 10px 0 0;
							padding: 10px 0;
							text-align: center;
						}
						.graphs{
							border-radius: 0 0 10px 10px;
							background-color: #fff;
							width: 100%;
							height: 400px;
						}
					}
				}
			}
		}
	}
</style>