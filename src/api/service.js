export function getInstanceList(){
	return window.vm.$http.get('/noec2/instances');
}

export function getUser(){
	// return window.vm.$http.get('/api/instance-list');
}