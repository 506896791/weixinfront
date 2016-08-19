/*
 * 提供注册mainMenu指令的link方法
 */
define(function(require,exports,module){
	exports.fn = function(){
		var func = function($scope,$element,$attrs){
			var hasDefault = false,//是否有默认加载项，用于限制只能有一个加载项
			    menuPath = $attrs['mainMenu'];
			//清空容器
			$element.html('');
            //加载菜单数据
			require.async(menuPath,function(m){
               //遍历菜单数据并生成li结点填充到容器中
				$.each(m.data, function(index, val) {
					var $li = $('<li></li>');
					$li.attr('container', val.container);
					$li.attr('moduleName', val.moduleName);
					$li.attr('modulePath', val.modulePath);
					$li.attr('tplPath', val.tplPath);
					$li.attr('tplId', val.tplId);
					if (!hasDefault && val.autoLoad) {
						$li.addClass('active');
						hasDefault = true;
					}

					var $a = $('<a href="#"></a>');
					$a.html(val.title);

					$li.append($a);
					$element.append($li);
				});
				//加载默认项
				$($element).click();
			});
		};
		return {
			link : func,
			restrict:'A'
		};
	};
});