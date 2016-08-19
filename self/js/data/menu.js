/*
 *  定义导航菜单
 *  @param title 标题
 *  @param container 模块容器id
 *  @param moduleName 模块名称
 *  @param modulePath 模块路径
 *  @param tplPath 模版文件路径
 *  @param tplId 模版id
 */
define(function(require, exports, module) {
	exports.data = [{
			title: '首页',
			container: 'indexDiv',
			moduleName: 'index',
			modulePath: 'modules/index',
			tplPath: 'tpl/index.html',
			tplId: 'index_main_tpl',
			autoLoad:true
		}, {
			title: '公众帐号',
			container: 'weixinDiv',
			moduleName: 'weixin',
			modulePath: 'modules/weixin',
			tplPath: 'tpl/weixin.html',
			tplId: 'weixin_main_tpl',
			autoLoad:true
		}, {
			title: '关于作者',
			container: 'aboutDiv',
			moduleName: 'about',
			modulePath: 'modules/about',
			tplPath: 'tpl/about.html',
			tplId: 'about_main_tpl',
			autoLoad:false
		}, {
			title: '联系我',
			container: 'contractDiv',
			moduleName: 'contract',
			modulePath: 'modules/contract',
			tplPath: 'tpl/contract.html',
			tplId: 'contract_main_tpl',
			autoLoad:false
		}
	];
});