<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define("DBNAME","OdTidEUNiTtHpJhzHDBq");
/**
 * Description of WexinMsgHelper
 *
 * @author dickzhou
 */
class WexinMsgHelper {
    //put your code here
    public function save($postObj)
    {
        if($postObj->Event == 'event')
        {
            return;
        }
        $str = "";
        $dbname = DBNAME;
 
        $host = getenv('HTTP_BAE_ENV_ADDR_SQL_IP');
        $port = getenv('HTTP_BAE_ENV_ADDR_SQL_PORT');
        $user = getenv('HTTP_BAE_ENV_AK');
        $pwd = getenv('HTTP_BAE_ENV_SK');

        $link = @new mysqli($host, $user, $pwd, $dbname, $port);
        if($link->connect_errno) {
            $str = "connect error" ;
        }
        
        $toUsername = $postObj->ToUserName;
        $fromUsername = $postObj->FromUserName;
        $createTime = $postObj->CreateTime;
        $msgType = $postObj->MsgType;
        $msgId = $postObj->MsgId;
        $content = $postObj->Content;
        $picUrl = $postObj->PicUrl;
        $location_x = $postObj->Location_X;
        $location_y = $postObj->Location_Y;
        $Scale = $postObj->Scale;
        $Label = $postObj->Label;
        $Title = $postObj->Title;
        $Description = $postObj->Description;
        $Url = $postObj->Url;
        $Event = $postObj->Event;
        $EventKey = $postObj->EventKey;
        
        if(!isset($location_x) || empty($location_x))
        {
            $location_x = 0.0;
        }
        if(!isset($location_y) || empty($location_y))
        {
            $location_y = 0.0;
        }
        if(!isset($Scale) || empty($Scale))
        {
            $Scale = 1;
        }
        if(!isset($Event))
        {
            $Event = '';
        }
        if(!isset($EventKey))
        {
            $EventKey = '';
        }
        
        $insertMsg = "insert into WexinMsg(ToUserName,FromUserName,CreateTime,MsgType,MsgId,Content,PicUrl,Location_X,Location_Y,Scale,Label,Title,Description,Url,Event,EventKey) values('{$toUsername}','{$fromUsername}',{$createTime},'{$msgType}',{$msgId},'{$content}','{$picUrl}',{$location_x},{$location_y},{$Scale},'{$Label}','{$Title}','{$Description}','{$Url}','{$Event}','{$EventKey}')";
        $insertUser = "insert into WexinUser(UserName,EnableFlag) values('$fromUsername',1)";
        
        if(mysqli_query($link, $insertMsg))
        {
            mysqli_query($link, $insertUser);
        }
        $link->close();
    }
    
    public function joke_get_random()
    {
        $dbname = DBNAME;
 
        $host = getenv('HTTP_BAE_ENV_ADDR_SQL_IP');
        $port = getenv('HTTP_BAE_ENV_ADDR_SQL_PORT');
        $user = getenv('HTTP_BAE_ENV_AK');
        $pwd = getenv('HTTP_BAE_ENV_SK');

        $link = @new mysqli($host, $user, $pwd, $dbname, $port);
        $sql_total = "select count(1) from Data_Joke where EnableFlag =1";
        $result_total = mysqli_query($link, $sql_total);
        $firstRow_total = mysqli_fetch_row($result_total);
        $totalCount = $firstRow_total[0];
        $randNum = rand(1, $totalCount -1);
        $sql = "select * from Data_Joke limit {$randNum},1";
        $result = mysqli_query($link, $sql);
        $firstRow = mysqli_fetch_row($result);
        $joke = $firstRow[1];
        return $joke;
    }
}

?>
