/*
 * 应用的入口，用于初始化导航菜单和首页
 */
define(function(require, exports, module) {
	var $menu = $('#menu'),
		init = function() {
			var $indexMenu = $('indexMenu');
			//初始化导航菜单
			require.async(['modules/indexMenu', 'modules/indexFooter'], function(index, f) {
				//绑定当行菜单
				$ng.bootstrap('indexMenu', ['indexMenu']);
				//绑定footer
				$ng.bootstrap('indexFooter', ['indexFooter']);
				//加载默认页
				$('#menu').click();
			});
		};
	init();
});