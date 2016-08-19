/*
 * 首页模块
 */
 define(function(require,exports,module){
 	var appName = "index",
 	    util = require('common/util');

 	//注册app
 	$ng.registerApp(appName,[],function($provide){
 		//注册自定义服务
        $provide.provider('$$util',util.fn);
 	});

 	$ng.registerController(appName,'weixinMainCtrl',['$scope','$$util','$element',function($scope,$$util,$element){
 		$scope.title = '猜猜我的年龄';
 		$scope.age = 0;
 		$scope.result = "放马过来吧";
 		$scope.change = function(){
 			if($scope.age > 27){
 				$scope.result = "猜错了！我有这么老吗？";
 			}
 			else if($scope.age < 27){
 				$scope.result = "哈哈！看来我还是蛮年轻的";
 			}
 			else{
 				$scope.age = 9999;
 				$scope.result = "别费劲儿啦！我的年龄可不是那么好猜滴";
 			}
 		};
 		$scope.$watch('age',function(to,from){
 			if(to != 0){
				//$element.find('input').val(to);
			}
 		});
 	}]);
 });