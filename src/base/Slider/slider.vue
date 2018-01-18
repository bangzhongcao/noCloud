<template>
	<div class="slider p-f">
		<div class='p-r'>
			<router-link tag='div' to='home' class="logo ta-c c-p" :class="isCollapse?'logoCollapse':''">
				<!-- <i class='fa fa-cloud icon-logo va-m'></i> -->
				<i class='fa fa-mixcloud icon-logo va-m'></i>
				<span v-show='!isCollapse' class='text-logo va-m'>NO Cloud</span>
			</router-link>
			<div class="collapse-btn p-a c-p ta-c" @click='collapse'>
				<i class='el-icon-d-arrow-left' v-show='!isCollapse'></i>
				<i class='el-icon-d-arrow-right' v-show='isCollapse'></i>
			</div>
		</div>
		<el-menu class="el-menu-vertical-demo" :default-openeds='openArr' :default-active='$route.path' background-color="#242424" text-color="#fff" active-text-color="#ffd04b" @open="handleOpen" @close="handleClose" @select="handelSelect" :collapse="isCollapse" unique-opened router>
			<el-menu-item index="/home"> 
				<i class="fa fa-home fa-fw slider-font" style="font-size:18px"></i>
				<span slot="title">控制台首页</span>
			</el-menu-item>
			<el-submenu index="2">
				<template slot="title"> 
					<i class="fa fa-desktop fa-fw slider-font"></i>
					<span slot="title">云计算与网络</span>
				</template>
				<el-submenu index="2-1">
					<span slot="title">云服务器</span>
					<el-menu-item index="/instance">实例</el-menu-item>
					<el-menu-item index="/disk">硬盘</el-menu-item>
					<el-menu-item index="/os">快照</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title"> 
					<i class="fa fa-dashboard fa-fw slider-font"></i>
					<span slot="title">监控</span>
				</template>
				<el-menu-item index="/alarm">告警策略</el-menu-item>
				<el-menu-item index="/panel">自定义面板</el-menu-item>
				<el-menu-item index="/instanceGroup">实例组管理</el-menu-item>
				<el-menu-item index="/contacts">联系人管理</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: false
      };
    },
    computed:{
    	openArr(){
    		console.log(this.$route.path);
    		return window.keyPath;
    	}
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handelSelect(key,keyPath){
      	console.log(this.$route.path);
      	console.log(key,keyPath);
      },
      // 折叠
      collapse(){
      	this.isCollapse = !this.isCollapse;
      	this.$emit('collapse',this.isCollapse);
      }
    }
  }
</script>

<style scoped lang='less'>
  @import "~common/less/variable.less";
	.slider{
		height:100%;
		top:0px;
		z-index: 2001;
		.collapse-btn{
			width: 40px;
			height: 40px;
			line-height: 40px;
			top:10px;
			right:-40px;
			background-color: @shrinkBtnColor;
			color: @colorText;
			font-size: 20px;
			font-weight: 700;
		}
		.el-menu-vertical-demo {
		  	&:not(.el-menu--collapse){
		  		width: 240px;
		  	}
		  	width:64px;
		    height: 100%;
		    .slider-font{
		    	font-size: 16px;
		    	margin-right: 8px;
		    }
	  	}
		.logo{
			width: 240px;
			height: 59px;
			line-height: 59px;
			background-color: @logoColor;
			border-bottom: 1px solid #a40011;
			border-right: 1px solid #a40011;
			color:#fff;
			.icon-logo{
				font-size: 42px;
				font-weight: 700;
			}
			.text-logo{
				padding-left: 5px;
				font-size: 20px;
			}
		}
		.logoCollapse{
			width: 64px;
		}
	}
</style>