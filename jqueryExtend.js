
//扩展LTK全局扩展函数
(function(win,$){

	win.define = function (id, value) {
		LTK[id] = value;
	};
	
	//模块会全部挂在LTK上，嘿嘿
	win.LTK = {
		version: '2.1'
	};
	
	var done = {}; //已经执行过的列表
	var req = function (id) {
		id.indexOf('/')>0 || (id = id.replace(/\./g, '/')); //所有的.引用全部变成/引用
		if (done.hasOwnProperty(id)) {
			return done[id];
		}
		var x = LTK[id];
		if (typeof x==='function') {
			done[id] = function () {}; //jiandan-cubao-di break circular dependency
			var module = {exports:{}};
			x = x(req, module.exports, module);
			x==='undefined' && (x = module.exports);
		} else if (x==='undefined') {
			throw 'LTK error: module '+id+' is not found';
		}
		LTK[id] = null;
		return done[id] = x;
	};

	//打包工具会把LTK.require替换为require，为了保留LTK.require兼容老的，所以用LTK['require']
	//LTK.use也用来引用模块，但是打包工具不通过它分析模块依赖，
	// 并且它的参数必须是完整的模块路径，不能是相对路径
	win.require = LTK['require'] = LTK.use = req;

})(win,$);

//静态方法扩展
(function(win, $){

	var StringH = {
		// s.clip(len,suffix)
		// 参数：	类型	  描述
		// 截取长度	num	  用来换字符串中的“{0}”
		// 追加字符	str	  用来换字符串中的“{1}”

		// 返回值：  str   截取后的字符串
		// PS: 一个中文两个长度,不够下取整
		// 例子:'你好a北京'.clip(6,'...') //should be: 你好a...
		clip: function(s,len,suffix){
			if(!s || !len) { return ''; }
			var a = 0;
			var i = 0;
			var temp = '';
			for (i=0;i<s.length;i++)
		    {
		        if (s.charCodeAt(i)>255) a+=2;
		    	else a++;
		        
		        if(a > len) { return temp+(suffix||'');}
				temp += s.charAt(i);
		    }
		    return s;
		},

		// s.format(args0)
		// 参数：	类型	描述
		// args0	any	用来换字符串中的“{0}”
		// args1	any	用来换字符串中的“{1}”
		// argsn	any	用来换字符串中的“{n}”
		
		// 返回值： any 填充后的字符串
		// 例子: '{0} love {1}'.format('I','You') //should be: I love You
		format: function(s, arg0) {
			var args = arguments;
			return s.replace(/\{(\d+)\}/ig, function(a, b) {
				var ret = args[(b | 0) + 1];
				return ret == null ? '' : ret;
			});
		},
		//s.mulReplace(arr)
		//参数	类型	    描述
		//arr	Array	替换参数数组，其格式为：[ [rgExp1, replaceText1], [rgExp2, replaceText2]]
		
		//返回值：string 替换结果
		//例子：'I like aa and bb. He likes aa'.mulReplace([[/aa/g,'山'],[/bb/g,'水']])	 //should be:I like 山 and 水. He likes 山	
		mulReplace: function(s, arr) {
			for (var i = 0; i < arr.length; i++) {
				s = s.replace(arr[i][0], arr[i][1]);
			}
			return s;
		},
		escapeChars: function(s){
			return StringH.mulReplace(s, [
				[/\\/g, "\\\\"],
				[/"/g, "\\\""],
				//[/'/g, "\\\'"],//标准json里不支持\后跟单引号
				[/\r/g, "\\r"],
				[/\n/g, "\\n"],
				[/\t/g, "\\t"]
			]);
		},
		//s.encode4Html()
		//返回值 string 编码结果	
		//例子:'A<B'.encode4Html() //should be:A&lt;B		
		encode4Html: function(s) {
			var el = document.createElement('pre'); //这里要用pre，用div有时会丢失换行，例如：'a\r\n\r\nb'
			var text = document.createTextNode(s);
			el.appendChild(text);
			return el.innerHTML;
		},
		//s.encode4Html()
		//返回值 string 编码结果	
		//例子:A"B'.encode4HtmlValue() //should be:A&lt;B		
		encode4HtmlValue: function(s) {
			return StringH.encode4Html(s).replace(/"/g, "&quot;").replace(/'/g, "&#039;");
		},
		//s.decode4Html()
		//返回值 string 解码结果
		//例子:"A&lt;B".decode4Html() //should be:"A<B"
		decode4Html: function(s) {
			var div = document.createElement('div');
			div.innerHTML = StringH.stripTags(s);
			return div.childNodes[0] ? div.childNodes[0].nodeValue || '' : '';
		},
		//s.stripTags()
		//返回值：string 替换结果
		//例子：'a<input>b<input>c'.stripTags()  //should be: abc
		stripTags: function(s) {
			return s.replace(/<[^>]*>/gi, '');
		},

		// s.evalJs(opts)
		// 参数    类型	   描述
		// opts	any	   字符串代表的js中，opts这个变量所对应的值

		// 返回值： any    返回eval的结果	
		// 例子：'var a=1;return a == 1'.evalJs() //should be true
		evalJs: function(s, opts) { 
			//如果用eval，在这里需要加引号，才能不影响YUI压缩。不过其它地方用了也会有问题，所以改成evalJs，
			return new Function("opts", s)(opts);
		},
		//同上只不过是表达式
		evalExp: function(s, opts) {
			return new Function("opts", "return (" + s + ");")(opts);
		},

		//desc: s.queryUrl 解析url或search字符串
		// s.queryUrl(key)
		// 参数：	类型		描述
		// key		String	(Optional) 请求数据的参数名。
		//             		如果没有此参数，s.queryUrl()返回解析出的json数据
		// 					如果有此参数，则返回其对应的请求数据

		// 返回值：如果没有key参数，则返回解析出的json数据。如果有key参数，则返回其对应的请求数据	
		// 例子 'a=1&b=1&b=2'.queryUrl() //should be:{a:"1",b:["1","2"]}
		// 		'a=1&b=1&b=2'.queryUrl('b') //should be: ["1", "2"]
		queryUrl: function(url, key) {
			url = url.replace(/^[^?=]*\?/ig, '').split('#')[0];	//去除网址与hash信息
			var json = {};
			//考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
			url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key , value){
				//对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
				try {
				key = decodeURIComponent(key);
				} catch(e) {}
				try {
				value = decodeURIComponent(value);
				} catch(e) {}
				if (!(key in json)) {
					json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
				}
				else if (json[key] instanceof Array) {
					json[key].push(value);
				}
				else {
					json[key] = [json[key], value];
				}
			});
			return key ? json[key] : json;
		},

		//将jQuery的静态方法也扩展进来
		trim: $.trim,
		parseJSON:$.parseJSON,
		inArray:$.inArray
	};

	var ObjectH = {
		//返回需要判断的类型
		//$.getConstructorName('sss') //should be:String
		getConstructorName:function(o){
			//加o.constructor是因为IE下的window和document
			if(o != null && o.constructor != null){
				return  Object.prototype.toString.call(o).slice(8, -1);
			}else{
				return '';
			}
		},
		isString: function(obj) {
			return ObjectH.getConstructorName(obj) == 'String';
		},
		isArray: function(obj) {
			return ObjectH.getConstructorName(obj) == 'Array';
		},
		//一个对象是否有length
		//例子：$.isArrayLike({'a':'bc'}) //should be false
		//	   $.isArrayLike({'a':'bc',length:1})) //should be false
		isArrayLike: function(obj) {
			return !!obj && typeof obj == 'object' && obj.nodeType != 1 && typeof obj.length == 'number';
		},
		isElement: function(obj) {
			return !!obj && obj.nodeType == 1;
		},
		keys: function(obj) {
			var ret = [];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					ret.push(key);
				}
			}
			return ret;
		},
		values: function(obj) {
			var ret = [];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					ret.push(obj[key]);
				}
			}
			return ret;
		},
		stringify: function(obj) {
			if (obj == null) {return 'null'; }
			if (typeof obj !='string' && obj.toJSON) {
				return obj.toJSON();
			}
			var type = ObjectH.getConstructorName(obj).toLowerCase();
			switch (type) {
				case 'string':
					return '"' + StringH.escapeChars(obj) + '"';
				case 'number':
					var ret = obj.toString();
					return /N/.test(ret) ? 'null' : ret;
				case 'boolean':
					return obj.toString();
				case 'date' :
					return 'new Date(' + obj.getTime() + ')';
				case 'array' :
					var ar = [];
					for (var i = 0; i < obj.length; i++) {ar[i] = ObjectH.stringify(obj[i]); }
					return '[' + ar.join(',') + ']';
				case 'object':
					if (ObjectH.isPlainObject(obj)) {
						ar = [];
						for (i in obj) {
							ar.push('"' + $.escapeChars(i) + '":' + ObjectH.stringify(obj[i]));
						}
						return '{' + ar.join(',') + '}';
					}
			}
			return 'null'; //无法序列化的，返回null;
		},
		encodeURIJson: function(json){
			var s = [];
			for( var p in json ){
				if(json[p]==null) continue;
				if(json[p] instanceof Array)
				{
					for (var i=0;i<json[p].length;i++) s.push( encodeURIComponent(p) + '=' + encodeURIComponent(json[p][i]));
				}
				else
					s.push( encodeURIComponent(p) + '=' + encodeURIComponent(json[p]));
			}
			return s.join('&');
		}
	};

	var ArrayH = {
		clear: function(arr) {
			arr.length = 0;
		},
		remove: function(arr, obj) {
			var idx = -1;
			for (var i = 1; i < arguments.length; i++) {
				var oI = arguments[i];
				for (var j = 0; j < arr.length; j++) {
					if (oI === arr[j]) {
						if (idx < 0) {
							idx = j;
						}
						arr.splice(j--, 1);
					}
				}
			}
			return idx;
		},
		expand: function(arr, shallow) {
			var ret = [],
				i = 0,
				len = arr.length;
			for (; i<len; i++) {
				if (ObjectH.isArray(arr[i])) {
					ret = ret.concat(shallow ? arr[i] : ArrayH.expand(arr[i]));
				}
				else {
					ret.push(arr[i]);
				}
			}
			return ret;
		},
		toArray: function(arr) {
			var ret = [];
			for (var i = 0; i < arr.length; i++) {
				ret[i] = arr[i];
			}
			return ret;
		},
		//jQuery 静态方法
		each:$.each,
		grep:$.grep,
		map:$.map,
		unique:$.unique,
		merge:$.merge
	};

	var DateH = {
		format: function(d, pattern) {
			pattern = pattern || 'yyyy-MM-dd';
			var y = d.getFullYear().toString(),
				o = {
					M: d.getMonth() + 1, //month
					d: d.getDate(), //day
					h: d.getHours(), //hour
					m: d.getMinutes(), //minute
					s: d.getSeconds() //second
				};
			pattern = pattern.replace(/(y+)/ig, function(a, b) {
				return y.substr(4 - Math.min(4, b.length));
			});
			for (var i in o) {
				pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function(a, b) {
					return (o[i] < 10 && b.length > 1) ? '0' + o[i] : o[i];
				});
			}
			return pattern;
		}	
	};

	var FunctionH = {
		methodize: function(func, attr) {
			if (attr) {
				return function() {
					return func.apply(null, [this[attr]].concat([].slice.call(arguments)));
				};
			}
			return function() {
				return func.apply(null, [this].concat([].slice.call(arguments)));
			};
		}
	};
	var Methodized = function() {};
	var HelperH = {
		methodize: function(helper, attr, preserveEveryProps) {
			var ret = new Methodized(); //因为 methodize 之后gsetter和rwrap的行为不一样
			for (var i in helper) {
				var fn = helper[i];
				if (fn instanceof Function) {
					ret[i] = FunctionH.methodize(fn, attr);
				}else if(preserveEveryProps){
					//methodize默认不保留非Function类型的成员
					//如特殊情况需保留，可将preserveEveryProps设为true
					ret[i] = fn;
				}
			}
			return ret;
		}
	};


	//为jQuery添加各种静态方法
	$.extend({
		formatNum:function(num,suffix){
			if(!Number(num)){return num};
			num = num.toString();
			suffix = suffix||'';
			return num.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1'+suffix);
		},
		nameSpace:function(sSpace, root) {

			var arr = sSpace.split('.'),
				i = 0,
				nameI;
			if (sSpace.indexOf('.') == 0) {
				i = 1;
				root = root || $;
			}
			root = root || window;
			for (; nameI = arr[i++];) {
				if (!root[nameI]) {
					root[nameI] = {};
				}
				root = root[nameI];
			}
			return root;
		},
		Cookie:{
			def:null,
			set:function(key, value, opt){
				if($.isPlainObject(this.def) && $.isPlainObject(opt)){
					opt = $.extend(this.def,opt);
				}
				var expires = opt.expires;

				if(typeof(expires) == "number"){
					expires = new Date();
					expires.setTime(expires.getTime() + opt.expires);
				}

				document.cookie =
					key + "=" + escape(value)
					+ (expires ? ";expires=" + expires.toGMTString() : "")
					+ (opt.path ? ";path=" + opt.path : "")
					+ (opt.domain ? "; domain=" + opt.domain : "")
					+ (opt.secure ? "; secure" : "");
			},
			get:function(key){
				var a, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
				if(a = document.cookie.match(reg)){
					return unescape(a[2]);
				}else{
					return "";
				}
			},
			remove:function(key){
				var expires = new Date(0);
				this.set(key,"",{'expires':expires});
			}
		}
	});
	$.extend(StringH);
	$.extend(ObjectH);
	$.extend(ArrayH);
	$.extend(DateH);

	//将静态方法扩展到各个类型
	var M = HelperH.methodize;

	//$.extend(Array,ArrayH);
	$.extend(Array.prototype, M(ArrayH));

	//$.extend(Function, FunctionH);

	//$.extend(Date, DateH);
	$.extend(Date.prototype, M(DateH));

	//$.extend(String, StringH);
	$.extend(String.prototype, M(StringH));	

})(window, jQuery);

//为jQuery扩展浏览器检测
(function(win, $){

	function getBrowser() {
		var na = window.navigator,
			ua = na.userAgent.toLowerCase(),
			browserTester = /(msie|webkit|gecko|presto|opera|safari|firefox|chrome|maxthon|android|ipad|iphone|webos|hpwos|trident)[ \/os]*([\d_.]+)/ig,
			Browser = {
				platform: na.platform
			};

		ua.replace(browserTester, function(a, b, c) {
			if (!Browser[b]) {
				Browser[b] = c;
			}
		});

		if (Browser.opera) { //Opera9.8后版本号位置变化
			ua.replace(/opera.*version\/([\d.]+)/, function(a, b) {
				Browser.opera = b;
			});
		}

		//IE11+ 会进入这个分支
		if (!Browser.msie && Browser.trident) { 
			ua.replace(/trident\/[0-9].*rv[ :]([0-9.]+)/ig, function(a, c) {
					Browser.msie = c;
				});
		}

		if (Browser.msie) {
			Browser.ie = Browser.msie;
			var v = parseInt(Browser.msie, 10);
			Browser['ie' + v] = true;
		}

		return Browser;
	}

	$.Browser = getBrowser();

})(window, jQuery);

