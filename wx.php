<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
include 'lib/WexinMsgHelper.php';


define("TOKEN", "noteany");
header("Content-Type: text/html; charset=utf-8");
/**
 * Description of weixin
 *
 * @author dickzhou
 */
$wechat = new WechatCallback();
//$wechat->valid();
$wechat->responseMsg();
class WechatCallback
{
    public function valid()
    {
//        $echoStr = $_GET["echostr"];
//
//        //valid signature , option
//        if($this->checkSignature()){
//        	echo $echoStr;
//        	exit;
//        }
        if(isset($_GET["echostr"]))
        {
            $echoStr = $_GET["echostr"];
            echo $echoStr;
        }
        else
        {
          echo "wexin";
        }
    }
    public function responseMsg(){
        $postStr = file_get_contents("php://input");
        // $postStr = '<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName> <CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[?]]></Content><MsgId>1234567890123456</MsgId></xml>';
	   if (!empty($postStr)){
                $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
                $fromUsername = $postObj->FromUserName;
                $toUsername = $postObj->ToUserName;
                $keyWord = trim($postObj->Content);
                $msgType = $postObj->MsgType;
                //保存微信消息
                $wexinMsg = new WexinMsgHelper();
                $wexinMsg->save($postObj);
                //判断消息类型
                $tmpMsg = "";
                //$tmpMsg = iconv("GB2312", "UTF-8", $tmpMsg);
                if($msgType == "text")//文本消息
                {
                    $key = strtolower(trim($keyWord));
                    $url_response = false;
                    // if($key == "笑话" || $key == "xh" || $key == "xiaohua")
                    // {
                    //     $tmpMsg = $wexinMsg->joke_get_random();
                    // }
                    if($key == "我要记" || $key == "woyaoji" || $key == "wyj")
                    {
                        $url_response = true;
                    }
                    else if($key == "菜单" || $key == "caidan" || $key == "cd" || $key == "?" || $key == "？")
                    {
                        $tmpMsg = $this->get_menu();
                    }
                    else if($this->is_translate($key))//翻译
                    {
                        $keys = explode("-", $key);
                        $word = trim($keys[1]);
                        $type = "zh";
                        if(count($keys) > 2 )
                        {
                            $type = trim($keys[2]);
                        }
                        $trans = new TranslateHelper($word,$type);
                        $result = iconv("GB2312", "UTF-8", $trans->translate($logger));
                        $this->responseTextMsg($result, $fromUsername, $toUsername, $keyWord);
                    }
                    else if($this->is_weather($key))
                    {
                        $keys = explode("-", $key);
                        $word = trim($keys[1]);
                        $weather = new WeatherHelper();
                        $result = $weather->get_city_weather($word);
                        $this->responseTextMsg($result, $fromUsername, $toUsername, $keyWord);
                    }
                    else  //自动聊天
                    {
                        $tmpMsg = $this->get_response_auto($keyWord);
                    }
                    if(!$url_response)
                    {
                        $this->responseTextMsg($tmpMsg, $fromUsername, $toUsername, $keyWord);
                    }
                    else
                    {
                        $this->responsePicMsg($fromUsername, $toUsername);
                    }
                }
                else if($msgType == "image")//图片消息
                {
                    $this->responseImageMsg($fromUsername, $toUsername, $postObj->PicUrl);
                }
                else if($msgType == "location")//地理位置消息
                {
                    $this->responseTextMsg($tmpMsg, $fromUsername, $toUsername, $keyWord);
                }
                else if($msgType == "link")//连接消息
                {
                    $this->responseTextMsg($tmpMsg, $fromUsername, $toUsername, $keyWord);
                }
                else//事件推送
                {
                    $event = $postObj->Event;
                    if($event == "subscribe")//订阅
                    {
                        $tmpMsg = "亲，欢迎关注烂笔头.\n".$this->get_menu();
                        $this->responseTextMsg($tmpMsg, $fromUsername, $toUsername, "subscribe");
                    }
                }
        }else {
            header("Location:/self/index.html");
            exit;
        }
    }
    private function checkSignature()
    {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

	$token = TOKEN;
	$tmpArr = array($token, $timestamp, $nonce);
	sort($tmpArr);
	$tmpStr = implode( $tmpArr );
	$tmpStr = sha1( $tmpStr );

	if( $tmpStr == $signature ){
		return true;
	}else{
		return false;
	}
    }

    private function responseTextMsg($msg,$fromUsername,$toUsername,$keyWord)
    {
        if(!empty($keyWord))
        {
            $time = time();
            $msgType = "text";
            $textTpl = "<xml>
		<ToUserName><![CDATA[%s]]></ToUserName>
	        <FromUserName><![CDATA[%s]]></FromUserName>
		<CreateTime>%s</CreateTime>
		<MsgType><![CDATA[%s]]></MsgType>
		<Content><![CDATA[%s]]></Content>
		<FuncFlag>0</FuncFlag>
		</xml>";
            $resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $msg);
            echo $resultStr;
        }
        else
        {
            echo iconv("GB2312", "UTF-8", "请输入您的指令");
        }
    }
    private function responsePicMsg($fromUsername,$toUsername)
    {
        $time = time();
        $msgType = "news";
        $title = "我要记";
        $description = "您可以用烂笔头记录下您在工作和生活中点点滴滴，安排即将要做的事情，记下所遇到的疑问。这些内容都将是您宝贵的财富。";
        $pic_url = "http://noteany.duapp.com/assets/images/logo_noteany.png";
        $url = "http://noteany.duapp.com/my/noteany.php";
        $textTpl = "<xml>
                <ToUserName><![CDATA[%s]]></ToUserName>
                <FromUserName><![CDATA[%s]]></FromUserName>
                <CreateTime>%s</CreateTime>
                <MsgType><![CDATA[%s]]></MsgType>
                <ArticleCount>%s</ArticleCount>
                <Articles>
                <item>
                <Title><![CDATA[%s]]></Title>
                <Description><![CDATA[%s]]></Description>
                <PicUrl><![CDATA[%s]]></PicUrl>
                <Url><![CDATA[%s]]></Url>
                </item>
                </Articles>
                </xml> ";
        $resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType ,1 ,$title,$description,$pic_url,$url);
        echo $resultStr;
    }

    private function responseImageMsg($fromUsername,$toUsername,$PicUrl)
    {
        $api_url = "http://apicn.faceplusplus.com/v2/detection/detect?api_key=a9acdffcdcc2aebfb2d8dea64b3723d0&api_secret=UgDdu3cJJyuy69E-1yzPXe62WRuWCEy7&url=".$PicUrl;
        $pic_json = $this->file_get_content($api_url);
        $pic_info = json_decode($pic_json);
        $faces = $pic_info->face;
        $facecount = count($faces);
        $faceindex = 1;
        $resultstr = "";
        foreach($faces as $f)
        {
            if($facecount > 1)
            {
                $resultstr .= "人物".$faceindex."\n";
            }
            $attr = $f->attribute;
            //年龄
            $resultstr .= "年龄：".$this->format_age($attr->age->value, $attr->age->range)."\n";
            //性别
            $resultstr .= "性别：".  $this->format_sex($attr->gender->value)."\n";
            //人种
            $resultstr .= "人种：".$attr->race->value."\n\n";

            $faceindex++;
        }
        if(empty($resultstr))
        {
            $resultstr = "解析失败";
        }
        $this->responseTextMsg($resultstr, $fromUsername, $toUsername, "image");
    }
    function file_get_content($url) {
        if (function_exists('file_get_contents')) {
             $file_contents = @file_get_contents($url);
        }
        if (empty($file_contents)) {
        $ch = curl_init();
        $timeout = 30;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $file_contents = curl_exec($ch);
        curl_close($ch);
        }
        return $file_contents;
    }
    //获取自动聊天的内容
    private function get_response_auto($keyword)
    {
        //$result = '想我就加我吧QQ：506896791 /飞吻';
        $keyword = iconv("UTF-8","GB2312//IGNORE",$keyword);
        $keyword = urlencode($keyword);
        $result = $this->file_get_content('http://dev.skjqr.com/api/weixin.php?email=506896791@qq.com&appkey=647ffd1f550e8bbdf9af25505779f4d0&msg='.$keyword);
        $result = str_replace('[msg]', '', $result);
        $result = str_replace('[/msg]', '', $result);
        return $result;
    }
    //获取当前所在位置--暂时无用
    private function get_current_position()
    {
        $apiurl = "http://api.map.baidu.com/location/ip?ak=9647ff5f02f52f7a52d29cfc5145d659&coor=bd09ll";
        $position_json = $this->file_get_content($apiurl);
        $position = json_decode($position_json);
        $detail = $position->content->address_detail;
        $province = $detail->province;
        $city = $detail->city;
        $district = $detail->district;
        $street = $detail->street;
        $street_number = $detail->street_number;
        $resultstr = "您的位置：{$province}{$city}{$district}{$street}{$street_number}";
        return $resultstr;
    }
    //格式化年龄
    private function format_age($value,$range)
    {
        return "{$value}±{$range}";
    }
    //格式化姓名
    private function format_sex($sex)
    {
        $result = "美女";
        if(strtolower($sex) == "male")
        {
            $result = "帅哥";
        }
        return $result;
    }
    //是否是翻译指令
    private function is_translate($keyword)
    {
        if(strpos($keyword, "翻译") === 0 || strpos($keyword, "fanyi") === 0 || strpos($keyword, "fy") === 0){
            $keys = explode("-", $keyword);
            if(count($keys) > 1 && !empty($keys[1]))
            {
                return true;
            }
        }
        return false;
    }
    //是否是获取天气指令
    private function is_weather($keyWord)
    {
        if(strpos($keyWord, "天气") === 0 || strpos($keyWord, "tianqi") === 0 || strpos($keyWord, "tq") === 0)
        {
            $keys = explode("-", $keyWord);
            if(count($keys) > 1 && !empty($keys[1]))
            {
                return true;
            }
        }
        return false;
    }
    //菜单
    private function get_menu()
    {
        $menu = "您可以输入以下菜单：\n 1.【翻译/fy-关键字-en/ch(可省略)】 翻译给定的关键词\n 2.发送图片消息，进行人脸识别\n 3.【菜单/cd/?】 显示详细功能菜单\n\n 发送非上述菜单文本消息,烂笔头会陪您聊天解闷儿. \n\n赶紧选择您需要的菜单，享受烂笔头带给你的乐趣吧！/飞吻";
        return $menu;
    }

}
?>
