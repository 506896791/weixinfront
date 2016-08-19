<?php
/*
 * Copyright(c) 201x,
 * All rights reserved.
 *
 * 文件名称: DbTableWRHandle.php
 * 摘    要: 数据表写操作类
 * 作    者: sengjiang
 * 版    本: $Id$
 */
class DbTableWRHandle extends DbTableHandle 
{
	private $m_isExists = false;
	function __construct($table,$type='',$db='')
	{
		if($db != ''){
			$dbinfo = $db;
		}
		else if($type == '')
		{
			global $g_masterdbinfo;
			$dbinfo = $g_masterdbinfo;
		}
		else
		{
			global $g_masterdbinfo_for_type;
			$dbinfo = $g_masterdbinfo_for_type[$type];
		}
		parent::__construct("masterDB",$dbinfo,$table);
	}
	
	/*
		函数名：insert
		说  明：批量插入数据(也可以只插入一条数据,此时如有存在自增长ID则返回自增长ID)
		参  数：$data = array( 0 => array('filedname1' => $value1,....),....);
		返回值：true/false; 如果插入单条，并且有自增长ID,则返回自增长ID;多条返回 true/false;
	*/
	function insert($data,$isignore = false)
	{
			$this->clear_error();
			$this->m_isExists = false;
			$sql = "";
			$valueLensMin = 0;
			if( is_array($data) && count($data) > 0 )
			{
					$g_keyList = false;
					
					//1.遍历所有key,构成key列表;
					foreach($data as $suffix => $row )
					{
							if( is_array($row) && count($row) > 0 )
							{
									$valueLensMin ++;
									foreach($row  as $key => $value )
									{
											if( !$this->CheckSQLNameRole($key) )
											{
													$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$key] is error!");
													return false;
											}
											
											if( isset($g_keyList["$key"]) ) continue;
											$g_keyList["$key"] = $key;
									}
							}
							else
							{
									continue;
							}
					}
					
					//2.遍历key列表
					if($isignore === true)
					{
						$sqlignore = "ignore";
					}
					else
					{
						$sqlignore = "";
					}
					$sql = " insert $sqlignore into ".$this->m_table." (";
					$num = 0;
					if( is_array($g_keyList) && count($g_keyList) > 0 )
					{
							foreach($g_keyList as $key => $filed )
							{
								if( $num > 0 ) $sql .= ",";
								$num ++;
								$sql .= "`$key`";
							}
					}
					else
					{
							$this->set_error("(".__FILE__.":".__LINE__."),errors:data struct is error!");
							return false;
					}
					$sql .= ") values";
					
					//3.造就value列表，该行不存在，则输入 ''来替代
					$i = 0;
					foreach($data as $suffix => $row )
					{
							if( $i > 0 ) $sql .= ",";
							$i ++;
							$sql .= " (";
							$mynum = 0;
							foreach($g_keyList as $key => $filed )
							{
									if( is_array($row) && count($row) > 0 )
									{
											if( $mynum > 0 ) $sql .= ",";
											$mynum ++;
											if( isset($row["$key"]) )
											{
													$sql .= "'".mysql_real_escape_string($row["$key"])."'";
											}
											else
											{
												$sql .= "''";
										}
									}
							}
							$sql .= " )";
					}
			}
			else
			{
					return false;
			}

			$this->m_sql = $sql;
			if( !$this->m_db->query($sql) )
			{
					if( $this->m_db->getErrno() == 1062 ) $this->m_isExists = true;
					$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       		return false;
			}
			
			if( $valueLensMin == 1 )
			{
					$auto_increatment = intval($this->m_db->InsertID());
					if( $auto_increatment > 0 ) return $auto_increatment;
			}
			return true;
	}
	
	function InsertIsExistsItem()
	{
			return $this->m_isExists;
	}
	
	/*
		函数名：update
		说  明：数据库更新操作
		参  数：data = array('filedname1' => $value1,....),更新的值；条件请通过 setSearchWhere来设置
		返回值：true/false
	*/
	function update($data)
	{
			$this->clear_error();
			$this->m_isExists = false;
			
			$sql = "update ".$this->m_table." set ";
			if( is_array($data) && count($data) > 0 )
			{
					$num = 0;
					foreach($data as $field => $value )
					{
							//1.检查
							if( !$this->CheckSQLNameRole($field) )
							{
									$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$field] is error!");
									return false;
							}
							
							if($num > 0 ) $sql .= ",";
							$num ++;
							$sql .= "$field='".mysql_real_escape_string($value)."' ";
					}
			}
			else
			{
					return false;
			}
			
			$sql .= " ".$this->m_sqlwhere;
			$this->m_sql = $sql;
			if( !$this->m_db->query($sql) )
			{
				//update 主键冲突判断
				if( $this->m_db->getErrno() == 1062 ) $this->m_isExists = true;	
				$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       		return false;
			}
			return true;
	}
	
	/*
		函数名：update
		说  明：数据库更新操作
		参  数：data = array('filedname1' => $value1,....),replace 由默认unique key值来更新替换
		返回值：true/false
	*/
	function replace($data)
	{
			$this->clear_error();
			$this->m_isExists = false;
			$sql = "";
			$valueLensMin = 0;
			if( is_array($data) && count($data) > 0 )
			{
					$g_keyList = false;
					
					//1.遍历所有key,构成key列表;
					foreach($data as $suffix => $row )
					{
							if( is_array($row) && count($row) > 0 )
							{
									$valueLensMin ++;
									foreach($row  as $key => $value )
									{
											if( !$this->CheckSQLNameRole($key) )
											{
													$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$key] is error!");
													return false;
											}
											
											if( isset($g_keyList["$key"]) ) continue;
											$g_keyList["$key"] = $key;
									}
							}
							else
							{
									continue;
							}
					}
					
					//2.遍历key列表
					$sql = " replace into ".$this->m_table." (";
					$num = 0;
					if( is_array($g_keyList) && count($g_keyList) > 0 )
					{
							foreach($g_keyList as $key => $filed )
							{
								if( $num > 0 ) $sql .= ",";
								$num ++;
								$sql .= "`$key`";
							}
					}
					else
					{
							$this->set_error("(".__FILE__.":".__LINE__."),errors:data struct is error!");
							return false;
					}
					$sql .= ") values";
					
					//3.造就value列表，该行不存在，则输入 ''来替代
					$i = 0;
					foreach($data as $suffix => $row )
					{
							if( $i > 0 ) $sql .= ",";
							$i ++;
							$sql .= " (";
							$mynum = 0;
							foreach($g_keyList as $key => $filed )
							{
									if( is_array($row) && count($row) > 0 )
									{
											if( $mynum > 0 ) $sql .= ",";
											$mynum ++;
											if( isset($row["$key"]) )
											{
													$sql .= "'".mysql_real_escape_string($row["$key"])."'";
											}
											else
											{
												$sql .= "''";
										}
									}
							}
							$sql .= " )";
					}
			}
			else
			{
					return false;
			}

			$this->m_sql = $sql;
			if( !$this->m_db->query($sql) )
			{
				$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       			return false;
			}
			return true;
	}
	
	/*
		函数名：DeleteItemListByUniqueKeyList
		说  明：通过唯一建值列表删除结果
		参  数：$fieldname 字段名;$valueList  值列表
		返回值：boolean
	*/
	function DeleteItemListByUniqueKeyList($fieldname,$valueList)
	{
			$this->clear_error();
			
			if( !$this->CheckSQLNameRole($fieldname) )
			{
					$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$fieldname] is error!");
					return false;
			}
			
			$sql = " delete from ".$this->m_table.$this->m_sqlwhere;
			if( strlen($this->m_sqlwhere) > 0 )
			{
					$sql .= " and ";
			}
			else
			{
					$sql .= " where ";
			}
			
			$sql .= " $fieldname in (";
			
			if( is_array($valueList) && count($valueList) > 0 )
			{
					$num = 0;
					foreach ($valueList as $v)
					{
							if( $num > 0 ) $sql .= ",";
							$num++;
							$sql .= " '".mysql_real_escape_string($v)."' ";
					}
			}
			else
			{
					$sql .= " '".mysql_real_escape_string($valueList)."' ";
			}
			$sql .= ' )';
			
			//查询
			$this->m_sql = $sql;
			if( $this->m_db->query($sql) === false )
			{
					$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
					return false;
			}
			
			return true;
	}
	/*
		函数名：insert
		说  明：批量插入数据(也可以只插入一条数据,此时如有存在自增长ID则返回自增长ID)
		参  数：$data = array( 0 => array('filedname1' => $value1,....),....);
		返回值：true/false; 如果插入单条，并且有自增长ID,则返回自增长ID;多条返回 true/false;
	*/
	function insertupdate($data,$updatefiled='')
	{
			$this->clear_error();
			$this->m_isExists = false;
			$sql = "";
			$valueLensMin = 0;
			$updatesql = '';
			if( is_array($data) && count($data) > 0 )
			{
					$g_keyList = false;
					
					//1.遍历所有key,构成key列表;
					foreach($data as $suffix => $row )
					{
							if( is_array($row) && count($row) > 0 )
							{
									$valueLensMin ++;
									foreach($row  as $key => $value )
									{
											if( !$this->CheckSQLNameRole($key) )
											{
													$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$key] is error!");
													return false;
											}
											
											if( isset($g_keyList["$key"]) ) continue;
											$g_keyList["$key"] = $key;
									}
							}
							else
							{
									continue;
							}
					}
					
					//2.遍历key列表
					$sql = " insert into ".$this->m_table." (";
					$num = 0;
					if( is_array($g_keyList) && count($g_keyList) > 0 )
					{
							foreach($g_keyList as $key => $filed )
							{
								if( $num > 0 ) $sql .= ",";
								
								$num ++;
								$sql .= "`$key`";
								if($updatefiled != $key)
								{
									if( $updatesql != '') $updatesql .= ",";
									$updatesql .= "$key=VALUES($key)";
								}
							}
					}
					else
					{
							$this->set_error("(".__FILE__.":".__LINE__."),errors:data struct is error!");
							return false;
					}
					$sql .= ") values";
					
					//3.造就value列表，该行不存在，则输入 ''来替代
					$i = 0;
					foreach($data as $suffix => $row )
					{
							if( $i > 0 ) $sql .= ",";
							$i ++;
							$sql .= " (";
							$mynum = 0;
							foreach($g_keyList as $key => $filed )
							{
									if( is_array($row) && count($row) > 0 )
									{
											if( $mynum > 0 ) $sql .= ",";
											$mynum ++;
											if( isset($row["$key"]) )
											{
													$sql .= "'".mysql_real_escape_string($row["$key"])."'";
											}
											else
											{
												$sql .= "''";
										}
									}
							}
							$sql .= " )";
					}
			}
			else
			{
					return false;
			}
			if($updatefiled != '' && $updatesql != '')
			{
				$sql .= "ON DUPLICATE KEY UPDATE ".$updatesql;
			}
			$this->m_sql = $sql;
			if( !$this->m_db->query($sql) )
			{
					if( $this->m_db->getErrno() == 1062 ) $this->m_isExists = true;
					$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       		return false;
			}
			
			if( $valueLensMin == 1 )
			{
					$auto_increatment = intval($this->m_db->InsertID());
					if( $auto_increatment > 0 ) return $auto_increatment;
			}
			return true;
	}
}
?>