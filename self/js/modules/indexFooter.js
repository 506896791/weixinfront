define(function(require,exports,module){
	var appName = 'indexFooter';
	$ng.registerApp(appName);
	$ng.registerController(appName,'copyCtrl',['$scope',function($scope){
		$scope.copyright = gSelf.author + " 2013 ~ " + (new Date()).getFullYear();
	}]);
});