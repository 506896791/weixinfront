/*
 * 导航菜单模块
 */
define(function(require,exports,modules){
	//app名称
	var appName = "indexMenu",
	    mainMenu = require("directives/mainMenu"),
	    util = require('common/util'),
	    activeClassName = "active",
	    $main = $('#main');
	//注册app
	$ng.registerApp(appName,[],function($provide){
		//注册自定义服务
		$provide.provider('$$util',util.fn);
	});
    //注册mainMenu指令
	$ng.registerDirective(appName,"mainMenu",mainMenu.fn);
    //注册控制器indexMenuCtrl
	$ng.registerController(appName,'indexMenuCtrl',['$scope','$element','$$util',function($scope,$element,$$util){
        $scope.authorName = gSelf.siteTitle;
        //切换导航菜单
        $scope.switchTab = function(event){
            if(event.currentTarget.nodeName === "UL"){
                var $target,
                    $li,
                    $menu = $($element).find("ul"),
                    $menuItems = $menu.children(),
                    container,
                    moduleName,
                    modulePath,
                    tplPath,
                    tplId,
                    $module;

                if(event.target.nodeName === "UL"){
                    $li = $menu.children('.active');
                }
                else if(event.target.nodeName === "LI"){
                    $li = $(event.target);
                    //切换菜单样式
                    $menuItems.removeClass(activeClassName);
                    $li.addClass(activeClassName);
                }
                else{
                    $target = $(event.target);
                    $li = $target.parent();

                    //切换菜单样式
                    $menuItems.removeClass(activeClassName);
                    $li.addClass(activeClassName);
                }
                container = $li.attr('container');//容器id
                moduleName = $li.attr('moduleName');//模块名称
                modulePath = $li.attr('modulePath');//模块路径
                tplPath = $li.attr('tplPath');//模版文件路径
                tplId = $li.attr('tplId');//模版id
                $module = $('#'+container);//容器对象

                //加载对应模块
                if($module.length == 0){
                   //第一次加载时新增一个结点
                   $module = $('<div id="'+ container +'" class="span12"></div>');
                   $main.append($module);
                   //加载模版
                   $$util.getTplFile(tplPath,function($tpl){
                   	  var tpl = $$util.getTpl(tplId,$tpl);
                   	  $module.html(tpl);

                   	  require.async(modulePath,function(m){
                   	    $ng.bootstrap(container,[moduleName]);
                   	  	$main.children().hide('slow');
               		  	  $module.show('slow');
                   	  });
                   });

                }
                else if($module.css('display') != 'block'){
                	$main.children().hide('slow');
                	$module.show('slow');
                }
            }
        };
  }]);
});