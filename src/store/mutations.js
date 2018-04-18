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
	},
	// 列表内容赋值
	changeData(state,n){
		// debugger
		state.listData = n;
		state.tableData = n.slice(0);
	},
	// 搜索功能
    handleSearch(state,value){
        var v = value.trim();
        // var flag = this.isAccurate;
        // 将页码重设为1
        this.currentPage = 1;
        state.tableData = state.listData.filter(function(item){
            for(var key in item){
                // 精确搜索
                // if(flag){
                    if(String(item[key])===v){
                        return item;
                    } 
                // }else{//模糊搜索
                //     if(String(item[key]).indexOf(v)>=0){
                //         return item;
                //     }
                // }
            }
        });
        // 重新排序
        // state.tableData.sort(this.compare(state.key,state.order));
    },
    //当搜索框为空时自动返回所有数据
    emptySearch(state,value){
        if(!value){
            state.tableData = state.listData.slice(0);
            // 重新排序
            // state.tableData.sort(this.compare(state.key,state.order));
        }
    },
    // 排序
	sortChange(state,obj){
		// debugger
		// obj中的各个属性不为null时
		if(obj.order&&obj.prop){
			// 当关键字或排序顺序变化时才进行排序
			if(state.key!==obj.prop||state.order!==obj.order){
				state.key = obj.prop;
            	state.order = obj.order;
            	if(state.order==='ascending'){
            		state.tableData.sort(function(obj1,obj2){
            			debugger
            			return obj1[state.key].localeCompare(obj2[state.key]);
            		});                    	
            	}else if(state.order==='descending'){
            		state.tableData.reverse(function(obj1,obj2){
            			return obj1[state.key].localeCompare(obj2[state.key]);
            		});  
            	}
			}
        }
	},
};

export default mutations;