<?php
/*
* Copyright(c) 201x,
* All rights reserved.
*
* 文件名称: MysqlDriver.php
* 摘    要: MySQL访问驱动
* 作    者: sengjiang
* 版    本: $Id:$
*/
class MysqlDriver
{
	private $host     = "";						//mysql主机名
	private $user     = "";						//mysql用户名
	private $pwd      = "";						//mysql密码
	private $dbName   = "";						//mysql数据库名称
	private $linkID   = 0;						//用来保存连接ID
	private $queryID  = 0;						//用来保存查询ID
	private $fetchMode= MYSQL_ASSOC;			//取记录时的模式
	private $queryTimes = 0;					//保存查询的次数
	private $errno    = 0;						//mysql出错代号
	private $error    = "";						//mysql出错信息
	private $record   = array();				//一条记录数组

	//======================================
	// 函数: __construct()
	// 功能: 构造函数
	// 参数: 参数类的变量定义
	// 说明: 构造函数将自动连接数据库
	//       如果想手动连接去掉连接函数
	//======================================
	function __construct($host,$user,$pwd,$dbName)
	{
		$this->host    = $host;
		$this->user    = $user;
		$this->pwd     = $pwd;
		$this->dbName  = $dbName;
		$this->connect();	//设置为自动连接
	}

	//======================================
	// 函数: connect($host,$user,$pwd,$dbName)
	// 功能: 连接数据库
	// 参数: $host 主机名, $user 用户名
	// 参数: $pwd 密码, $dbName 数据库名称,不调用select
	// 返回: false:失败
	// 说明: 默认使用类中变量的初始值
	//======================================
	function connect($host = "", $user = "", $pwd = "", $dbName = "")
	{
		$this->errno = 0;
		$this->error = "";
		if ("" == $host)
		{
			$host = $this->host;
		}
		else
		{
			$this->host = $host;
		}
		if ("" == $user)
		{
			$user = $this->user;
		}
		else
		{
			$this->user = $user;
		}
		if ("" == $pwd)
		{
			$pwd = $this->pwd;
		}
		else
		{
			$this->pwd = $pwd;
		}
		if ("" == $dbName)
		{
			$dbName = $this->dbName;
		}
		else
		{
			$this->dbName = $dbName;
		}
		//now connect to the database
		$this->linkID = mysql_connect($host,$user,$pwd,true);
		if (!$this->linkID)
		{
			$this->errno = mysql_errno();
			$this->error = "can't connect db:".mysql_error();
			return false;
		}
		if (!mysql_select_db($dbName, $this->linkID))
		{
			$this->errno = mysql_errno();
			$this->error = "can't select db[".$this->dbName."]:".mysql_error();
			return false;
		}
		if( __DEBUG_MODE__ == 1 )
		{
			echo "<b>connect ok[".intval($this->linkID)."]</b> host:".$host . " db:". $dbName ."<br />\n";
		}
		//$this->query("set names utf8");
		return $this->linkID;
	}
	//======================================
	// 函数: query($sql)
	// 功能: 数据查询
	// 参数: $sql 要查询的SQL语句
	// 返回: 0:失败
	//======================================
	function query($sql)
	{
		$this->errno = 0;
		$this->error = "";
		$this->queryTimes++;
		if( __DEBUG_MODE__ == 1 )
		{
			$timeStart = microtime(true);
		}
		//首先检查是否mysql resource
		//echo "SQL: ".$sql."<br />\n";
		if( strncasecmp(get_resource_type($this->linkID),"mysql",5) !== 0 )
		{
			if( __DEBUG_MODE__ == 1 )
			{
				echo "<b>type:".get_resource_type($this->linkID)."[".intval($this->linkID)."]</b><br />\n";
				echo "<b>is not resource...</b><br />\n";
				echo "<b>".$this->host."|".$this->user."|".$this->pwd."|</b><br />\n";
			}
			//不是，重新连接数据库
			$this->linkID = mysql_connect($this->host,$this->user,$this->pwd,true);
			if (!$this->linkID)
			{
				if( __DEBUG_MODE__ == 1 )
				{
					echo "<b>reconnect failture...</b><br />\n";
				}
				$this->errno = mysql_errno();
				$this->error = "can't connect db:".mysql_error($this->linkID);
				return false;
			}
			if( __DEBUG_MODE__ == 1 )
			{
				echo "<b>reconnect ok[".intval($this->linkID)."]...</b><br />\n";
			}
			//重新use DB
			if (!mysql_select_db($this->dbName, $this->linkID))
			{
				$this->errno = mysql_errno();
				$this->error = "reconnect,can't select db[".$this->dbName."]:".mysql_error($this->linkID);
				return false;
			}
			if( __DEBUG_MODE__ == 1 )
			{
				echo "<b>re select db ok...</b><br />\n";
			}
		}

		$this->queryID = mysql_query($sql, $this->linkID);
		if ( $this->queryID === false)
		{
			if( mysql_errno($this->linkID) == 1146 )
			{
				$this->errno = mysql_errno();
				$this->error = "QUERY ERROR[$sql]:".mysql_error($this->linkID);
				return false;
			}

			//执行失败,测试数据是否连接
			if( mysql_ping($this->linkID) === false )
			{
				//连接已断,重新连接
				$this->linkID = mysql_connect($this->host,$this->user,$this->pwd,true);
				if (!$this->linkID)
				{
					$this->errno = mysql_errno();
					$this->error = "can't connect db:".mysql_error($this->linkID);
					return false;
				}

				//重新use DB
				if (!mysql_select_db($this->dbName, $this->linkID))
				{
					$this->errno = mysql_errno();
					$this->error = "reconnect,can't select db[".$this->dbName."]:".mysql_error($this->linkID);
					return false;
				}
			}

			//重新执行查询
			$this->queryID = mysql_query($sql, $this->linkID);
			if( $this->queryID === false )
			{
				$this->errno = mysql_errno();
				$this->error = "QUERY ERROR[$sql]:".mysql_error($this->linkID);
				return false;
			}
		}

		if( __DEBUG_MODE__ == 1 )
		{
			echo "SQL: ".$sql.",<b> query OK </b>".' uses '.(microtime(true) - $timeStart).' second.<br/>';
		}
		/*$objLog = new FileLog('sql_debug');
		$log = '"'.$sql.'"'.','.'"'.(microtime(true) - $timeStart).'"';
		$res = str_replace("\n"," ",$log);
		//echo $res;
		$objLog->fileWrite($res);*/
		return true;
	}
	//======================================
	// 函数: setFetchMode($mode)
	// 功能: 设置取得记录的模式
	// 参数: $mode 模式 MYSQL_ASSOC, MYSQL_NUM, MYSQL_BOTH
	// 返回: 0:失败
	//======================================
	function setFetchMode($mode)
	{
		$this->errno = 0;
		$this->error = "";
		if ($mode == MYSQL_ASSOC || $mode == MYSQL_NUM || $mode == MYSQL_BOTH)
		{
			$this->fetchMode = $mode;
			return 1;
		}
		else
		{
			$this->error = "SET MODE ERROR: the Mode is not exist";
			return false;
		}

	}

	function getDbName()
	{
		return $this->dbName;
	}

	//======================================
	// 函数: fetchAll()
	// 功能: 从记录集中取出所有记录
	// 返回: 记录集数组
	//======================================
	function fetchAll()
	{
		$arr = array();
		while($this->record = mysql_fetch_array($this->queryID,$this->fetchMode))
		{
			$arr[] = $this->record;
		}
		mysql_free_result($this->queryID);
		return $arr;
	}

	//======================================
	// 函数: affectedRows()
	// 功能: 返回影响的记录数
	//======================================
	function affectedRows()
	{
		return mysql_affected_rows($this->linkID);
	}

	//======================================
	// 函数: recordCount()
	// 功能: 返回查询记录的总数
	// 参数: 无
	// 返回: 记录总数
	//======================================
	function recordCount()
	{
		return mysql_num_rows($this->queryID);
	}

	//======================================
	// 函数: getQueryTimes()
	// 功能: 返回查询的次数
	// 参数: 无
	// 返回: 查询的次数
	//======================================
	function getQueryTimes()
	{
		return $this->queryTimes;
	}
	//======================================
	// 函数: getVersion()
	// 功能: 返回mysql的版本
	// 参数: 无
	//======================================
	function getVersion()
	{
		$this->query("select version() as ver");
		$this->fetchRow();
		return $this->getValue("ver");
	}
	//======================================
	// 函数: getDBSize($dbName, $tblPrefix=null)
	// 功能: 返回数据库占用空间大小
	// 参数: $dbName 数据库名
	// 参数: $tblPrefix 表的前缀,可选
	//======================================
	function getDBSize($dbName, $tblPrefix=null)
	{
		$sql = "SHOW TABLE STATUS FROM " . $dbName;
		if($tblPrefix != null) {
			$sql .= " LIKE '$tblPrefix%'";
		}
		$this->query($sql);
		$size = 0;
		while($this->fetchRow())
		$size += $this->getValue("Data_length") + $this->getValue("Index_length");
		return $size;
	}
	//======================================
	// 函数: insertID()
	// 功能: 返回最后一次插入的自增ID
	// 参数: 无
	//======================================
	function insertID() {
		return mysql_insert_id($this->linkID);
	}

	function getErrno()
	{
		return $this->errno;
	}

	function getError()
	{
		return $this->error;
	}

	//析构函数
	function __destruct()
	{
		/*
		if( !is_resource($this->queryID) )
		{
			@mysql_free_result($this->queryID);
		}
		*/
		return true;
	}
}