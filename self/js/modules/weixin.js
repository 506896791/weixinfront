/*
 * 微信模块
 */
 define(function(require,exports,module){
 	var appName = "weixin",
 	    util = require('common/util');

 	//注册app
 	$ng.registerApp(appName,[],function($provide){
 		//注册自定义服务
        $provide.provider('$$util',util.fn);
 	});

 	$ng.registerController(appName,'weixinMainCtrl',['$scope','$$util',function($scope,$$util){
 		$scope.title = '烂笔头';
 		$scope.picUrl = "./images/noetany.jpg";
 		$scope.info = '请微信扫描上面的二维码，或者搜索公众帐号 noteanywhere,烂笔头期待您的关注！';
 	}]);
 });