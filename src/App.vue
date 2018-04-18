<template>
  <div id="app">
  	<top-bar></top-bar>
  	<slider @collapse='collapsePanel'></slider>
  	<div class='content-panel' :class="iscollapse?'collapsePanel':''">
  		<router-view></router-view>
  	</div>
  </div>
</template>

<script>
import topBar from 'base/top-bar/top-bar';
import slider from 'base/Slider/slider';

export default {
	data(){
		return{
			iscollapse:false
		}
	},
	components:{topBar,slider},
	created(){
		if(window.url!=='{{ route }}'){
			window.url.split('/');
		}else{
			if(location.pathname==='/'||location.pathname==='/console'||location.pathname==='/console/'){
				this.$router.push({name:'home'});
			}
		}
	},
	methods:{
		collapsePanel(flag){
			this.iscollapse = flag;
		}
	}
}
</script>

<style socped lang='less'>
	@import "~common/less/variable.less";
	#app{
		// min-width: 1280px;
		min-width: 1200px;
		box-sizing: border-box;
		padding-top:75px; 
		height: 100%;
		background-color: @colorBackground;
		.content-panel{
			box-sizing: border-box;
			min-height: 100%;
			border-bottom: 15px solid @colorBackground;
			margin-right: 15px;
			margin-left: 245px;
			background-color: @whiteBackground; 
		}
		.collapsePanel{
			margin-left: 80px;
		}
	}
</style>
