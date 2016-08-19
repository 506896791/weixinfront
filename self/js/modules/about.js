/*
 * 关于作者模块
 */
 define(function(require,exports,module){
 	var appName = "about",
 	    util = require('common/util');

 	//注册app
 	$ng.registerApp(appName,[],function($provide){
 		//注册自定义服务
        $provide.provider('$$util',util.fn);
 	});

 	$ng.registerController(appName,'weixinMainCtrl',['$scope','$$util',function($scope,$$util){
 		$scope.info = '我是先秦剑仙，请接受我的爱吧';
 	}]);
 });