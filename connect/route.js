var url = require('url');
var util = require('./util');

//为每个restful形成一个stack, 再为所有的形成一个stack
var routes = {
	all:[]
};

exprots = module.exports = router;

//匹配分发部分
function router(req,res){
	var pathname = url.parse(req.url).pathname;
	//网络请求的方式
	var method = req.method.toLowerCase();

	//把all注册的中间键都返回就可以了
	//console.log(routes.all
	var stacks = router.match(pathname,routes.all);
	//console.log(stacks);
	if(routes.hasOwnProperty(method)){
		stacks = stacks.concat(router.match(pathname, routes[method]));
	}

	if(stacks.length){
		router.handle(req,res,stacks);
	}else{
		res.writeHead(404);
		res.end('页面没找到')
	}
	//console.log(stacks);
	
}
//匹配特定，restful，rotues,并执行相应的action
router.match = function(pathname, routes){
	
	var stacks = [];
	//匹配成功后把stack保存下来
	for(var i=0,l = routes.length; i<l;i++){

		var route = routes[i];
		var keys = route.path.keys;
		var reg = route.path.regexp;
		var op = route.path.op;
		var matched = reg.exec(pathname);	
		
		//console.log(route.stack);
		if(matched||op=="/"){
			//抽取具体值
			// var params = {};
			// var value = matched[i+1];
			// for(var j=0,l = keys.length;j<l;j++){
			// 	if(value){
			// 		params[keys[i]] = value;
			// 	}	
			// }
			// req.params = params;
			//console.log(route.stack);
			stacks = stacks.concat(route.stack);
			//return route.stack;
			//now this is stack
			//router.handle(req,res,route.stack);
			//成功匹配第一个后就返回
			//return true;

		}	
	}
	return stacks;
}


router.handle = function(req, res, stack){


	//根据handle长度，把handle分成，errmiddleware和正常的midleware
	// error和right使用不同的handle
	var errStack = stack.filter(function(middleware){
		return middleware.length === 4;
	});

	var rightStack = stack.filter(function(middleware){
		return middleware.length === 3;
	});

	var next = function(err){

		if(err){
			//在下个函数执行前，捕获错误，执行错误处理程序
			//handle可以继续执行下面中间件
			//return 是为了中断执行，返回undefined
			return router.handleError(err,req,res,errStack);
		}

		var m = rightStack.shift();

		if(m){
			try{
				// 异步错误无法捕获
				m(req,res,next);
			}catch(err){
				//抛出错误
				next(err)
			}
			
		}
	}

	next();

}
//handle 是通过use注册的，通过筛选stack 里的handle的参数个数过滤出新的stack
router.handleError = function(err,req,res,stack){

	var next = function(){

		var errMiddleware = stack.shift();

		if(errMiddleware){

			errMiddleware(err,req,res,next);

		}

	}

	next();
}

//注册部分
//path 用户注册的路径
router.use = function(path){

	var handle;

	if(typeof path == 'string'){
		handle = {
			path: util.pathRegexp(path),
			stack: Array.prototype.slice.call(arguments,1)
		}		
	}else{
		handle = {
			path: util.pathRegexp('/'),
			stack: Array.prototype.slice.call(arguments)
		}

	}
	//if(arguments.length == 1){

	//	router.use('/',  arguments[0]);

	//}else{
		//注册为全局中间件
		//现在的路径是1vs1
		//如果我用相同路径注册一个方法，就不会执行。其实可以{path:[action]},注册时如果路径存在可以继续追加 
		//console.log(handle);
	routes.all.push(handle);
	//}
}

//为restful方法注册中间件
var methods = ['get','post','put','delete'];

methods.forEach(function(method){

	routes[method] = [];

	router[method] = function(path){

		var handle = {
			path:util.pathRegexp(path),
			stack:Array.prototype.slice.call(arguments,1)
		}

		routes[method].push(handle);
	}
});


