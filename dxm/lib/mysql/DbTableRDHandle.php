<?php
/*
 * Copyright(c) 201x,
 * All rights reserved.
 *
 * 文件名称: DbTableRDHandle.php
 * 摘    要: 数据表读操作类
 * 作    者: senjiang
 * 版    本: $Id$
 */
class DbTableRDHandle extends DbTableHandle 
{
	function __construct($table,$type='')
	{
		if($type == '')
		{
			global $g_slavedbinfo;
			$dbinfo = $g_slavedbinfo;
		}
		else
		{
			global $g_slavedbinfo_for_type;
			$dbinfo = $g_slavedbinfo_for_type[$type];
		}
		parent::__construct("slaveDB",$dbinfo,$table);
	}
	
	/****************************************************************
												条件搜索组合(固定)
	*****************************************************************/
	//参数，无，返回满足条件的记录总数
	function countSearchNum($bigtable=false)
	{
			$this->clear_error();
			$this->m_sql = "";
			if( $bigtable && strlen($this->m_sqlwhere) > 0 )
			{
				//mysql 4.0以上，高效率替代count(*) 的办法
				$this->m_sql = " select SQL_CALC_FOUND_ROWS * from ".$this->m_table.$this->m_sqlwhere." limit 1";
				$this->m_db->setFetchMode(MYSQL_ASSOC);
      	if( $this->m_db->query($this->m_sql) === false )
     		{
       			$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       			return false;
      	}
      	
				//遍历结果
				$res = $this->m_db->fetchAll();
				if( $res == false ) return 0;
				
				$this->m_sql = " select FOUND_ROWS() as total ";
			}
			else
			{
				$this->m_sql = " select count(*) as total from ".$this->m_table.$this->m_sqlwhere;
			}
			
			
			//查询
			$this->m_db->setFetchMode(MYSQL_ASSOC);
      if( $this->m_db->query($this->m_sql) === false )
      {
       			$this->set_error(__FILE__."|".__FUNCTION__.": query ".$this->m_sql." failture,error is".$this->m_db->getError());
       			return false;
      }
      
			//遍历结果
			$res = $this->m_db->fetchAll();
			if( isset($res[0]) && isset($res[0]['total']) )
			{
					return intval($res[0]['total']);
			}
			return false;
	}
	
	/*
		函数名：getSearchResult
		说  明：获取查询结果
		参  数：$orderby = array( 0=> array('name' => ,'order' => DESC/ASC)...);
						$startpos  开始位置
						$limitnum  需要的记录条目
						
		返回值：数据库记录数组 array(0 => array('field1'=> 'field1value',...),...);
	*/
	function getSearchResult($orderby = array(),$startpos=0,$limitnum = 0)
	{
			$this->clear_error();
			$sql = " select * from ".$this->m_table.$this->m_sqlwhere;
			if( is_array($orderby) && count($orderby) > 0 )
			{
					$num = 0;
					foreach($orderby as $key => $value )
					{
							$filedName = $value['name'];
							$orderType = $value['order'];
							if( strlen($orderType) != 4 && strncasecmp($orderType,"DESC",4) !== 0 )
							{
									$orderType = "ASC";
							}
							
							if( !$this->CheckSQLNameRole($filedName) )
							{
									$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$filedName] is error!");
         					return false;
							}
							
							if( $num > 0 )
							{
									$sql .= ",";
							}	
							else
							{
									$sql .= " order by ";
							}
							$num ++;
							$sql .= " $filedName $orderType ";
					}
			}
			
			if( $limitnum > 0 )
			{
					$sql .= " limit $startpos,$limitnum ";
			}
			//查询
			$this->m_sql = $sql;
			$this->m_db->setFetchMode(MYSQL_ASSOC);
      if( $this->m_db->query($sql) === false )
      {
       			$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       			return false;
      }
      
			//遍历结果
			return $this->m_db->fetchAll();
	}
	
	/*
		函数名：GetItemListByUniqueKeyList
		说  明：通过唯一建值列表获取所有元素结果
		参  数：$fieldname 字段名;$valueList  值列表
		返回值：array('$value1' => array('fieldvalue1' => '',...),...);
	*/
	function GetItemListByUniqueKeyList($fieldname,$valueList)
	{
			$this->clear_error();
			if( !$this->CheckSQLNameRole($fieldname) )
			{

					$this->set_error("(".__FILE__.":".__LINE__."),errors:field[$fieldname] is error!");
          			return false;
			}
			
			$sql = " select * from ".$this->m_table.$this->m_sqlwhere;
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
					foreach($valueList as $key => $value )
					{
							if( $num > 0 ) $sql .= ",";
							$num ++;
							$sql .= " '".mysql_real_escape_string($value)."' ";
					}
			}
			else
			{
					$sql .= " '".mysql_real_escape_string($valueList)."' ";
			}
			$sql .= ' )';
			
			//查询
			$this->m_sql = $sql;
			$this->m_db->setFetchMode(MYSQL_ASSOC);

      if( $this->m_db->query($sql) === false )
      {
      	$this->set_error(__FILE__."|".__FUNCTION__.": query $sql failture,error is".$this->m_db->getError());
       			return false;
      }
      
			//遍历结果
			$res = $this->m_db->fetchAll();
			$ret = array();
      if( is_array($res) && count($res) > 0 )
      {
           foreach($res as $key => $value )
           {
           		$mysuffix = $value["$fieldname"];
           		$ret["$mysuffix"] = $value;
           }
      }

      return $ret;
	}
}
?>