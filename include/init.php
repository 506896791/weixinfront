<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

//设置时区
date_default_timezone_set('Asia/Shanghai');
if (substr(PHP_OS,0,3) == 'WIN')
{
	define('_PROJECTROOTDIR_',str_replace('\\','/',dirname(__FILE__)));
}
else
{
	define('_PROJECTROOTDIR_', dirname(__FILE__));
}
define('__LINKTAGERT__',PATH_SEPARATOR);
set_include_path(_PROJECTROOTDIR_."/conf/".__LINKTAGERT__._PROJECTROOTDIR_."/datadriver/db/".__LINKTAGERT__._PROJECTROOTDIR_."/function/".__LINKTAGERT__._PROJECTROOTDIR_."/systemdriver/".__LINKTAGERT__._PROJECTROOTDIR_."/api/");


include_once('db_config.php');
include_once('function.php');
