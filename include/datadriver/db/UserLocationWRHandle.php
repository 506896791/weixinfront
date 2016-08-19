<?php

class UserLocationWRHandle extends DbTableWRHandle{
	private $fields = array(
        'user_id' => array('required' => true),
        'x' => array('required' => true),
        'y' => array('required' => true),
        'desc' => array('required' => false),
        'label' => array('required' => false),
        'enable' => array('required' => false)
    );

    public function __construct()
    {
        parent::__construct("user_location");
        $this->Query("SET NAMES UTF8");
    }
    /*
        插入一条数据
    */
    public function insertOne(){
    	$this->clear_error();
    	$insertData = array();
        foreach ($this->fields as $key => $val) {
            $_data = getFormItemValue($key);
            if (empty($_data) && $val['required']) {
                $this->_set_error("{$key} required");
                return false;
            }
            $insertData[$key] = $_data;
        }
        //计算地理位置
        $desc = '--';
        $str_json = file_get_content("http://lbs.juhe.cn/api/getaddressbylngb?lngx={$insertData['x']}&lngy={$insertData['y']}");
        $obj_json = custom_json_decode($str_json);
        if(!is_null($obj_json) && $obj_json->resultcode == 1){
        	$desc = json_encode($obj_json->row);
        }
        $insertData['enable'] = 1;
        $insertData['desc'] = $desc;
        $res = $this->insert(array(0 => $insertData));
        if ($res === false) {
            if ($this->InsertIsExistsItem() === true) {
                $this->_set_error("insert is exists item");
                return false;
            }
            $this->_set_error("insert error");
            return false;
        }
        return $res;
    }
    /*
     * 根据id更新记录
     */
    public function updateByid()
    {
        $this->clear_error();
        $id = getFormItemValue('id');
        if (!is_numeric($id) || $id < 0) {
            $this->_set_error("id empty");
            return false;
        }
        $where = array(array("name"=>"id","oper"=>"=","value"=>$id));
        if($this->setSearchWhere($where) === false){
            $this->_set_error("set where fail");
            return false;
        }
        $updateData = array();
        foreach ($this->fields as $key => $val) {
            $_data = getFormItemValue($key);
            if (empty($_data) && $val['required']) {
                $this->_set_error("{$key} required");
                return false;
            }
            $updateData[$key] = $_data;
        }
        $res = $this->update($updateData);
        if ($res === false) {
            $this->_set_error("update error");
            return false;
        }
        return $res;
    }

    /*
     * 根据id删除记录
     */
    public function delByid()
    {
        $this->clear_error();
        $id = getFormItemValue('id');
        if (!is_numeric($id) && $id > 0) {
            $this->_set_error("id empty");
            return false;
        }
        return $this->DeleteItemListByUniqueKeyList('id', $id);
    }
    /*
     * 根据code删除记录
     */
    public function delByCode($codeList)
    {
        $this->clear_error();
        return $this->DeleteItemListByUniqueKeyList('code', $codeList);
    }
    /*
     * 写错误信息
     */
    private function _set_error($msg)
    {
        $this->set_error(__CLASS__ . '|' . __METHOD__ . '|' . $msg);
    }
}