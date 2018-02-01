import Vue from 'vue';
import Router from 'vue-router';
import homeCont from 'components/homeCont/homeCont';
import instanceCont from 'components/cloudService/instance/instance';
import diskCont from 'components/cloudService/disk/disk';
import osCont from 'components/cloudService/os/os';

import alarm from 'components/monitor/alarmStrategy/alarm';
import contacts from 'components/monitor/contacts/contacts';
import instanceGroup from 'components/monitor/instanceGroup/instanceGroup';
import panels from 'components/monitor/Panel/panel';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base:'/console',
	routes:[
		{
			path:'/home',
			name:'home',
			component:homeCont,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["/home"];
	        	next();
	      	}
		},
		{
			path:'/instance',
			name:'instance',
			component:instanceCont,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["2", "2-1", "/instance"];
	        	next();
	      	}
		},
		{
			path:'/disk',
			name:'disk',
			component:diskCont,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["2", "2-1", "/disk"];
	        	next();
	      	}
		},
		{
			path:'/os',
			name:'os',
			component:osCont,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["2", "2-1", "/os"];
	        	next();
	      	}
		},
		{
			path:'/alarm',
			name:'alarm',
			component:alarm,
			beforeEnter: (to, from, next) => {
				window.scrollTo(0,0);
				window.keyPath = ["3", "/alarm"];
	        	next();
	      	}
		},
		{
			path:'/panel',
			name:'panel',
			component:panels,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["3", "/panel"];
	        	next();
	      	}
		},
		{
			path:'/instanceGroup',
			name:'instanceGroup',
			component:instanceGroup,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["3", "/instanceGroup"];
	        	next();
	      	}
		},
		{
			path:'/contacts',
			name:'contacts',
			component:contacts,
			beforeEnter: (to, from, next) => {
				window.keyPath = ["3", "/contacts"];
	        	next();
	      	}
		}
	]
});
