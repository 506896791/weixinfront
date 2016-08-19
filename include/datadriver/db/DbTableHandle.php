<?php

/*
 * Copyright(c) 201x,
 * All rights reserved.
 *
 * 文件名称: DbTableHandle.php
 * 摘    要: 数据表操作基类
 */

class DbTableHandle
{
    protected $m_db = NULL;
    protected $m_table = NULL;
    protected $m_isOk = true;
    protected $m_errorstr = "";
    protected $m_sqlwhere = "";
    protected $m_sql = "";

    function __construct($type, $info, $table)
    {
        $this->m_db = DriverLoader::dbFactory($type, $info);
        $this->m_table = $table;
    }

    function isOk()
    {
        return $this->m_isOk;
    }

    function errors()
    {
        return $this->m_errorstr;
    }

    function clear_error()
    {

        $this->m_isOk = true;
        $this->m_errorstr = "";
    }

    function set_error($str)
    {
        $this->m_isOk = false;
        $this->m_errorstr = $str;
    }

    function getQuerySql()
    {
        return $this->m_sql;
    }

    public function getTableName()
    {
        return $this->m_table;
    }

    function CheckSQLNameRole($str)
    {
        //字段和表名 只能出现 A-Z;a-z;0-9;以及'-','_' 其他均无效
        $lens = strlen($str);
        if ($lens <= 0) return false;
        for ($i = 0; $i < $lens; $i++) {
            $s = $str[$i];

            if ($s == '-' || $s == '_') continue;
            $a = ord($s);
            if ($a >= 65 && $a <= 90) continue;
            if ($a >= 48 && $a <= 57) continue;
            if ($a >= 97 && $a <= 122) continue;
            return false;;
        }
        return true;
    }

    /*
        函数名：Query
        说  明：执行 SQL 查询
        参  数：$sql SQL语句；$mode  MYSQL_ASSOC MYSQL_NUM MYSQL_BOTH,默认为空，执行，不查询数据
        返回值：true/false/ 符合$mode格式的数组 array(0 => array('field' => $value,...),1=> ...);
    */
    function Query($sql, $mode = "")
    {
        if ($mode != "") {
            $this->m_db->setFetchMode($mode);
        }
        $this->m_sql = $sql;
        if ($this->m_db->query($sql) === false) {
            $this->set_error(__FILE__ . "|" . __FUNCTION__ . ": query $sql failture,error is" . $this->m_db->getError());
            return false;
        }

        if ($mode != "") {
            return $this->m_db->fetchAll();
        }
        return true;
    }

    /*
        函数名：setSearchWhere
        说  明：设置查询条件,只支持简单查询(and/or),要想自由组合，请直接Query)
        参  数：$where = array( 0 => array('name' => ,'oper' => like ,= ; > ; < ; <> ; != ; >=; <=;,'value' => 任意字符串 )...);
                        $isand 默认 true
        返回值：true/false
    */
    function setSearchWhere($where, $isand = true)
    {
        $this->m_sqlwhere = "";
        $this->clear_error();
        if (is_array($where) && count($where) > 0) {
            $num = 0;
            foreach ($where as $key => $value) {
                $filedName = $value['name'];
                $operType = trim($value['oper']);
                $filedValue = $value['value'];

                //检查field
                if (!$this->CheckSQLNameRole($filedName)) {
                    $this->set_error("(" . __FILE__ . ":" . __LINE__ . "),errors:field[$filedName] is error!");
                    return false;
                }

                //检查oper
                if ($operType != '=' && $operType != '>' && $operType != '<'
                    && $operType != '>=' && $operType != '<=' && $operType != '!='
                    && $operType != '<>' && $operType != 'like'
                ) {
                    $this->set_error("(" . __FILE__ . ":" . __LINE__ . "),errors:field[$filedName] 's type[$operType] is error!");
                    return false;
                }

                if ($num > 0) {
                    if ($isand) {
                        $this->m_sqlwhere .= " and ";
                    } else {
                        $this->m_sqlwhere .= " or ";
                    }
                } else {
                    $this->m_sqlwhere .= " where ";
                }
                $num++;

                $this->m_sqlwhere .= " $filedName $operType '" . mysql_escape_string($filedValue) . "' ";
            }
        }
        return true;
    }
}

?>