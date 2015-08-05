
//sessions保存在内存里，用过访问过大有可能会导致内存占用过大，影响性能，
//在遇到多个子进程时，相互之间不能通信，解决方案是是使用redis高速缓存服务
//一个进程内存占用最好不超过300M，根据内存起相应的子进程
var redis = require('redis').createClient();

//取消进程内存存储
//var sessions = {};
var key = "session_id";
var EXPIRES = 3*1000;


var  SS = module.exports  = function (req, res, next){
	//req cookie-parse 中间键产生

	var id = req.cookies[key];
	if(!id){
		//if no , generate
		req.session = SS.generate();

	}else{
		//get session from redis
		//保持进程与redis的长链接，以减少网络请求时间
		redis.get(id, function(err,session){

			if(session){
				//没过期
				if(session.cookie.expire > (new Date()).getTime()){
					//更新时间
					session.cookie.expire = (new Date()).getTime() + EXPIRES;
					//为response 挂载 session
					req.session = session;

				}else{
					//过去删除旧的重新生成
					redis.del(id)
					req.session = SS.generate();
				}
			}else{
				//have id but no corrert
				req.session = SS.generate();	
			}

		});

	}

	//session 不应该给前端设置过期时间，否则前端cookie.session_id消失后，后端无法获取，只能重新生成
	//达不到验证目的,原sessions列表也并没有清楚，留下垃圾数据
	res.cookie(key,req.session.id);

	//保存回缓存
	redis.save(req.session.id, req.session.cookie); 

	next();
}

SS.generate = function(){

	var session = {};

	session.id = (new Date()).getTime() + Math.random();

	session.cookie = {

		expire:(new Date()).getTime() + EXPIRES

	};

	sessions[session.id] = session;

	return session;
}
