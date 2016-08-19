/*
 * 联系我模块
 */
 define(function(require,exports,module){
 	var appName = "contract",
 	    util = require('common/util');

 	//注册app
 	$ng.registerApp(appName,[],function($provide){
 		//注册自定义服务
        $provide.provider('$$util',util.fn);
 	});

 	$ng.registerController(appName,'contractMainCtrl',['$scope','$$util',function($scope,$$util){
 		$scope.author = gSelf.author + '的邮箱';
 		$scope.email = '506896791@qq.com';
 	}]);
 });