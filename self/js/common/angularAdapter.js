/*
 * 包装angular公共方法
 */
;(function(window) {
	function angularAdapter() {
		this.appList = {};
    }

	angularAdapter.prototype.registerApp = function(appName,deps,func) {
		if (!this.appList[appName]) {
			deps = deps || [];
			func = func || angular.noop();
			this.appList[appName] = angular.module(appName, deps,func);
		}
		return this;
	};

	angularAdapter.prototype.registerController = function(appName, controllName, options) {
		if (this.appList[appName]) {
			var app = this.appList[appName];
			app.controller(controllName, options);
		}
		return this;
	};

	angularAdapter.prototype.registerFilter = function(appName, filterName, filterFunc) {
		if (this.appList[appName]) {
			var app = this.appList[appName];
			app.filter(filterName, filterFunc);
		}
		return this;
	};

	angularAdapter.prototype.registerDirective = function(appName,name,func){
		if(this.appList[appName]){
			var app = this.appList[appName];
			app.directive(name,func);
		}
		return this;
	};

	angularAdapter.prototype.bootstrap = function(id,deps){
		if(id && deps){
			angular.bootstrap(angular.element(document.getElementById(id)),deps);
		}
	};

	window.$ng = window.ngAdapter = new angularAdapter();
})(window);