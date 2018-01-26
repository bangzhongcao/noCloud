import state from './state.js';

const mutations = {
	changeNumber(state,n){
		state.createNum = n;
	},
	// 更改浏览器窗口尺寸
	changeSize(state) {
		// state.winWidth=0;
		// 获取窗口宽度
		if (window.innerWidth){
			state.winWidth = window.innerWidth;
		}	
		else if ((document.body) && (document.body.clientWidth)){
			state.winWidth = document.body.clientWidth;
		}
		// 通过深入 Document 内部对 body 进行检测，获取窗口大小
		else if (document.documentElement && document.documentElement.clientWidth){
			state.winWidth = document.documentElement.clientWidth;
		}
		// 对窗口大小进行判断
		if(state.winWidth>=1440){
			state.Size = 'medium';
		}else if(state.winWidth>=1320){
			state.Size = 'small';
		}else{
			state.Size = 'mini';
		}
	}
};

export default mutations;