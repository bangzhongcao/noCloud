import state from './state.js';

const mutations = {
	changeNumber(state,n){
		state.createNum = n;
	}
};

export default mutations;