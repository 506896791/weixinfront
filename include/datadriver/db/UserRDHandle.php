<?php

class UserRDHandle extends DbTableRDHandle{
	public function __construct()
    {
        parent::__construct("user");
        $this->Query("SET NAMES UTF8");
    }

    public function getUser($name,$password){
    	$name = $name ? $name : getFormItemValue('name');
    	$password = $password ? $password : getFormItemValue('password');
    	$where = array(
    		array("name"=>"name","oper"=>"=","value"=>$name),
    		array("name"=>"password","oper"=>"=","value"=>$password)
    		);
        if($this->setSearchWhere($where) === false){
            $this->_set_error("set where fail");
            return false;
        }
        return $this->getSearchResult();
    }
}