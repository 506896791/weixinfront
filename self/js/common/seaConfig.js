//配置seajs,预先加载angular,underscore,angularAdapter
seajs.config({
	debug:true,
	base:'/self/js',

    plugins:['text'],

	preload:[
	    'lib/jquery',
	    'lib/angular',
        'lib/underscore',
        'common/angularAdapter',
        'common/global'
	]
});