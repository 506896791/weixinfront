define(function(require,exports,module){
    exports.fn = function(){
		this.$get = function(){
			var _export = {};
            /*
			 * 获取模版文件，加载完成后执行回调函数并传入jQuey对象
			 * @param tplPath string 模版文件路径
			 * @param callback function 模版文件加载完成后执行的回调函数
			 */
			_export.getTplFile = function(tplPath,callback){
		        require.async(tplPath,function(tpl){
		        	if(callback){
		        		callback($(tpl));
		        	}
		        });
			};

		    /*
		     * 获取模版内容
		     * @param id  string   模版id
		     * @param $tpl jQuery  模版jQuery对象
		     * $return string 模版内容
		     */
			_export.getTpl = function(id,$tpl){
				if(!id) return '';

				var tpl = _.find($tpl,function(one){
					return one.id == id;
				});
				return tpl ? tpl.innerHTML : '';
			};

			return _export;
		};
	};
});