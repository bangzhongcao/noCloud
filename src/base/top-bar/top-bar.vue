<template>
	<div class="top-bar p-f">
		<el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect"
		  background-color="#242424" text-color="#fff" active-text-color="#ffd04b">
		  <el-submenu index="3" class='top-bar-item'>
		    <template slot="title">曹邦中</template>
		    <el-menu-item index="2-1" class='logout-btn'>退出</el-menu-item>
		  </el-submenu>
		  <el-menu-item index="2" class='top-bar-item'>工单</el-menu-item>
		  <el-menu-item index="1" class='top-bar-item'>备案</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style scoped lang='less'>
	@import "~common/less/variable";
	.top-bar{
		top:0;
		width: 100%;
		height: 60px;
		border-bottom: 1px solid @borderColor;
		background-color: @blackBackground;
		z-index: 2000;
		.top-bar-item{
			float: right !important;
			margin: 0 10px;
			&:first-child{
				margin-right: 80px;
			}
			.logout-btn{
				min-width:150px !important;
			}
		}
	}
</style>