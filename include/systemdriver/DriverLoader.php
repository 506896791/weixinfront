<?php
/*
 * Copyright(c) 201x,
 * All rights reserved.
 * 
 * 文件名称: DriverLoader.php
 * 摘    要: 驱动工厂
 * 作    者: senjiang
 * 版    本: $Id$
 */	
class DriverLoader
{
	function & dbFactory($type,$info)
	{
		static $instance;
		switch($type)
		{
			case "masterDB":
					
					$dbinfo = DriverLoader::getMasterDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['db'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
		
					$instance[$key] = & new MysqlDriver($dbinfo['host'],$dbinfo['user'],
												$dbinfo['pwd'],$dbinfo['db']);
					
					return $instance[$key];
					break;
			
			case "slaveDB":
			
					$dbinfo = DriverLoader::getSlaveDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['db'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
					$instance[$key] = & new MysqlDriver($dbinfo['host'],$dbinfo['user'],
												$dbinfo['pwd'],$dbinfo['db']);
					
					return $instance[$key];
				  	break;
			
			default:
					return NULL;
		}
		
		return NULL;
	}
	//sqlserver数据库链接驱动
	function & sqlserverdbFactory($type,$info)
	{
		static $instance;
		switch($type)
		{
			case "masterDB":
					
					$dbinfo = DriverLoader::getSqlServerMasterDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['db'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
		
					$instance[$key] = & new MssqlDriver($dbinfo['host'],$dbinfo['user'],
												$dbinfo['pwd'],$dbinfo['db']);
					
					return $instance[$key];
					break;
			
			case "slaveDB":
			
					$dbinfo = DriverLoader::getSqlServerSlaveDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['db'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
					$instance[$key] = & new MssqlDriver($dbinfo['host'],$dbinfo['user'],
												$dbinfo['pwd'],$dbinfo['db']);
					
					return $instance[$key];
				  	break;
			
			default:
					return NULL;
		}
		
		return NULL;
	}
	//oracle数据库链接驱动
	function & oracledbFactory($type,$info)
	{
		static $instance;
		switch($type)
		{
			case "masterDB":
					
					$dbinfo = DriverLoader::getOracleMasterDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['sid'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
					
					$instance[$key] = & new OracleDriver($dbinfo['host'],$dbinfo['user'],$dbinfo['pwd'],$dbinfo['sid']);
					
					return $instance[$key];
					break;
			
			case "slaveDB":
			
					$dbinfo = DriverLoader::getOracleSlaveDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['sid'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
					
					$instance[$key] = & new OracleDriver($dbinfo['host'],$dbinfo['user'],$dbinfo['pwd'],$dbinfo['sid']);
					
					return $instance[$key];
				  	break;
			
			default:
					return NULL;
		}
		
		return NULL;
	}
	/**
	 * ********************************************************************************
	 * 函数: cacheFactory()
	 * 参数:
	 * 		$info   缓存主机信息,格式 array('0' => array('host' => ,'port'=>  ),
	 * 										...
	 *                                   );
	 * 
	 * 说明：cache目前只提供冗余模式,不提供分布式
	 * 返回：
	 */
	function cacheFactory($info,$exptime = 0)
	{
		static $instance;
		
		$suffix = serialize($info)."_".$exptime;
		if( !isset($instance["$suffix"]) )
		{
			$instance["$suffix"] = & new MemcacheDriver($info,$exptime);
		}
		return $instance["$suffix"];
	}
	public static function getMasterDbInfo($info)
	{
		return $info;
	}
	
	public static function getSlaveDbInfo($info)
	{
		return $info[0];
	}
	
	public static function getSqlServerMasterDbInfo($info)
	{
		return $info;
	}
	
	public static function getSqlServerSlaveDbInfo($info)
	{
		return $info;
	}
	
	public static function getOracleMasterDbInfo($info)
	{
		return $info;
	}
	
	public static function getOracleSlaveDbInfo($info)
	{
		return $info;
	}
}
?>