const state = {
    // 屏幕大小
    Size : 'small',
    winWidth: 0,
	 // 虚拟机状态
    Status:['RESIZE', 'REBUILD', 'BUILD', 'MIGRATING','VERIFY_RESIZE','ERROR','ACTIVE','SHUTOFF',
   'VERIFY_MIGRATING','VERIFY_NOVMMS_RESIZE', 'NOVMMS_RESIZE', 'NOVMMS_RESIZE_FAILED'],
   // 操作系统类型
  	osType:[
      	{
      		label:"Rhel",
      		value:'Rhel',
      		children:[{
      			label:'rhel-6.8-server_0817',
      			value:'rhel-6.8-server_0817'
      		},{
      			label:'rhel-7.2-server_0817',
      			value:'rhel-7.2-server_0817'
      		},{
      			label:'rhel-7.3-server_0217',
      			value:'rhel-7.3-server_0217'
      		}],
      	},
      	{
  			label:"CentOs",
  			value:'CentOs',
  			children:[{
  				label:'CentOS-6.8-server_1116',
  				value:'CentOS-6.8-server_1116'
  			},{
  				label:'CentOS-7.2-server_1116',
  				value:'CentOS-7.2-server_1116'
  			},{
  				label:'CentOS-7.3-server_0217',
  				value:'CentOS-7.3-server_0217'
  			}]
  		},
  		{
  			label:"Ubuntu",
  			value:'Ubuntu',
  			children:[{
  				label:'ubuntu_0908',
  				value:'ubuntu_0908'
  			}]
  		},
      	{
  			label:"Windows",
  			value:'Windows',
  			children:[{
  				label:'windows-server-mis-2008',
  				value:'windows-server-mis-2008'
  			},{
  				label:'windows-server-mis-2012',
  				value:'windows-server-mis-2012'
  			},{
  				label:'windows-server-mis-2016',
  				value:'windows-server-mis-2016'
  			}]
  		},
      	{
  			label:"Others",
  			value:'Others',
  			children:[{
  				label:'目前未有其他版本',
  				value:'none',
  				disabled:true
  			}]
  		}
	 ],
   //  statistic 统计方法
    statistic:[
      {
        label:'平均值',
        value:'avg'
      },{
        label:'最大值',
        value:'max'
      },{
        label:'最小值',
        value:'min'
      },{
        label:'求和值',
        value:'sum'
      }
    ],
    // 大小
    operators:['==','!=','<','<=','>','>=']
};

export default state;