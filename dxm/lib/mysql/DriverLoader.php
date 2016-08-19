<?php
/*
 * Copyright(c) 201x,
 * All rights reserved.
 * 
 * �ļ�����: DriverLoader.php
 * ժ    Ҫ: ��������
 * ��    ��: senjiang
 * ��    ��: $Id$
 */	
class DriverLoader
{
	public static function & dbFactory($type,$info)
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
		
					$instance[$key] = new MysqlDriver($dbinfo['host'],$dbinfo['user'],
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
					$instance[$key] = new MysqlDriver($dbinfo['host'],$dbinfo['user'],
												$dbinfo['pwd'],$dbinfo['db']);
					
					return $instance[$key];
				  	break;
			
			default:
					return NULL;
		}
		
		return NULL;
	}
	//sqlserver���ݿ���������
	public static function & sqlserverdbFactory($type,$info)
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
		
					$instance[$key] = new MssqlDriver($dbinfo['host'],$dbinfo['user'],
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
					$instance[$key] = new MssqlDriver($dbinfo['host'],$dbinfo['user'],
												$dbinfo['pwd'],$dbinfo['db']);
					
					return $instance[$key];
				  break;
			
			default:
					return NULL;
		}
		
		return NULL;
	}
	//oracle���ݿ���������
	public static function & oracledbFactory($type,$info)
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
					
					$instance[$key] = new OracleDriver($dbinfo['host'],$dbinfo['user'],$dbinfo['pwd'],$dbinfo['sid']);
					
					return $instance[$key];
					break;
			
			case "slaveDB":
			
					$dbinfo = DriverLoader::getOracleSlaveDbInfo($info);
					$key = $dbinfo['host']."_".$dbinfo['sid'];
					
					if( isset($instance[$key]) )
					{
						return $instance[$key];	
					}
					
					$instance[$key] = new OracleDriver($dbinfo['host'],$dbinfo['user'],$dbinfo['pwd'],$dbinfo['sid']);
					
					return $instance[$key];
				  	break;
			
			default:
					return NULL;
		}
		
		return NULL;
	}
	/**
	 * ********************************************************************************
	 * ����: cacheFactory()
	 * ����:
	 * 		$info   ����������Ϣ,��ʽ array('0' => array('host' => ,'port'=>  ),
	 * 										...
	 *                                   );
	 * 
	 * ˵����cacheĿǰֻ�ṩ����ģʽ,���ṩ�ֲ�ʽ
	 * ���أ�
	 */
	public static function cacheFactory($info)
	{
		static $instance;
		
		$suffix = serialize($info);
		if( !isset($instance["$suffix"]) )
		{
			$instance["$suffix"] = new MemcacheDriver($info);
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