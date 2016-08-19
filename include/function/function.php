<?php
/**
 * 公告函数库
 * @name function.php
 */

/**
 * 自动加载
 *
 * @param str $classname
 */
function __autoload($classname)
{
	$pos = strpos($classname,"Smarty");
	if( $pos === false || $pos > 0 )
	{
		class_exists($classname) || include($classname. '.php');
	}
	else
	{
		class_exists($classname) || include($classname. '.class.php');
	}
}
/**
 * 获取GET/POST值 前端使用
 *
 * @param str $name
 * @return mix
 */
function fetchValue($name)
{
    if( !get_magic_quotes_gpc() )
    {
        if( isset($_GET["$name"]) )
		{
            return addslashes($_GET["$name"]);
		}
		
		if( isset($_POST["$name"]) )
		{
            return addslashes($_POST["$name"]);
		}  
    }
    else
    {
        if( isset($_GET["$name"]) )
		{
            return $_GET["$name"];
		}
		
		if( isset($_POST["$name"]) )
		{
            return $_POST["$name"];
		}
    } 
}
/**
 * 获取GET/POST值
 *
 * @param str $name
 * @return mix
 */
function getFormItemValue($name)
{
	$getret = false;
	if( !get_magic_quotes_gpc() )
    {
        if( isset($_GET["$name"]) )
		{
            $getret = $_GET["$name"];
		}
		if( isset($_POST["$name"]) )
		{
            $getret = $_POST["$name"];
		}  
    }
    else
    {
        if( isset($_GET["$name"]) )
		{
            if(!is_array($_GET["$name"]))
            {
				$getret = stripslashes($_GET["$name"]);
            }
            else
            {
            	$getret = $_GET["$name"];
            }
		}
		
		if( isset($_POST["$name"]) )
		{
            if(!is_array($_POST["$name"]))
            {
				$getret = stripslashes($_POST["$name"]);
            }
            else
            {
            	$getret = $_POST["$name"];
            }
		}
    }
    if($getret !== false && !is_array($getret) && strpos($getret,'$(') >= 0)
    {
		$getret = str_replace('$(','',$getret);
    }
    $input = file_get_contents("php://input");
    if($getret === false && !empty($input))
    {
    	$getret = $input;
    }
    return $getret;
}

/**
 * 分页信息
 *
 * @param int $countNum
 * @param int $pageNum
 * @param int $limitNum
 * @return array
 */
function getpageinfo($countNum,$pageNum,$limitNum)
{
		$countNum = intval($countNum);
		$limitNum = intval($limitNum);
		$pageNum = intval($pageNum);
		$pageall = ceil($countNum/$limitNum);
		if( $pageNum > $pageall ) $pageNum = $pageall;
		if( $pageNum <= 1 ) $pageNum = 1;
		
		return array('totalnum' => $countNum,
											'page' => $pageNum,
											'maxpage' => $pageall,
											'startpos' => ($pageNum - 1 ) * $limitNum,
											'limitnum' => $limitNum,
											);
}
/**
 *输出js
 *
 * @param int $countNum
 * @param int $pageNum
 * @param int $limitNum
 * @return array
 */
function display_javascript($str,$location,$istop = false)
{
		echo "<script language=\"javascript\">\n";
		if( strlen($str) > 0 )
		{
			echo "alert(\"$str\");\n";
		}
		if( $location == "history.back" )
		{
			echo "window.history.back(-1);\n";
		}
		else if( $location == "reload" )
		{
			if( $istop )
			{
				echo "parent.document.location.reload();\n";
			}
			else
			{
				echo "window.location.reload();\n";
			}
			
		}
		elseif($location == 'close')
		{

			echo "window.close();\n";
			
		}
		else
		{
			if( strstr($location,"?") === false )
			{
				$location .= "?rand=".rand();
			}
			else
			{
				$location .= "&rand=".rand();
			}
			if( $istop )
			{
				echo "parent.document.location.href=\"$location\";\n";
			}
			else
			{
				echo "window.location.href=\"$location\";\n";
			}
		}
		echo "</script>";
}

/**
 * 获取客户端IP地址
 *
 * @return string
 */
function get_client_ip(){
   if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown"))
       $ip = getenv("HTTP_CLIENT_IP");
   else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
       $ip = getenv("HTTP_X_FORWARDED_FOR");
   else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
       $ip = getenv("REMOTE_ADDR");
   else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
       $ip = $_SERVER['REMOTE_ADDR'];
   else
       $ip = "unknown";
   return($ip);
}

/**
 * 产生随机字串，可用来自动生成密码 默认长度6位 字母和数字混合
 * @param string $len 长度 
 * @param string $type 字串类型 
 * 		0 字母 
 * 		1 数字 
 * 		2 大写字母 
 * 		3 小写字母 
 * 		4 中文 
 * 		默认 混合
 * @param string $addChars 额外字符 
 * @return string
 */
function rand_string($len=6,$type='',$addChars='') { 
	$str ='';
	switch($type) { 
		case 0:
			$chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.$addChars; 
			break;
		case 1:
			$chars= str_repeat('0123456789',3); 
			break;
		case 2:
			$chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.$addChars; 
			break;
		case 3:
			$chars='abcdefghijklmnopqrstuvwxyz'.$addChars; 
			break;
		case 4:
			$chars = "们以我到他会作时要动国产的一是工就年阶义发成部民可出能方进在了不和有大这主中人上为来分生对于学下级地个用同行面说种过命度革而多子后自社加小机也经力线本电高量长党得实家定深法表着水理化争现所二起政三好十战无农使性前等反体合斗路图把结第里正新开论之物从当两些还天资事队批点育重其思与间内去因件日利相由压员气业代全组数果期导平各基或月毛然如应形想制心样干都向变关问比展那它最及外没看治提五解系林者米群头意只明四道马认次文通但条较克又公孔领军流入接席位情运器并飞原油放立题质指建区验活众很教决特此常石强极土少已根共直团统式转别造切九你取西持总料连任志观调七么山程百报更见必真保热委手改管处己将修支识病象几先老光专什六型具示复安带每东增则完风回南广劳轮科北打积车计给节做务被整联步类集号列温装即毫知轴研单色坚据速防史拉世设达尔场织历花受求传口断况采精金界品判参层止边清至万确究书术状厂须离再目海交权且儿青才证低越际八试规斯近注办布门铁需走议县兵固除般引齿千胜细影济白格效置推空配刀叶率述今选养德话查差半敌始片施响收华觉备名红续均药标记难存测士身紧液派准斤角降维板许破述技消底床田势端感往神便贺村构照容非搞亚磨族火段算适讲按值美态黄易彪服早班麦削信排台声该击素张密害侯草何树肥继右属市严径螺检左页抗苏显苦英快称坏移约巴材省黑武培著河帝仅针怎植京助升王眼她抓含苗副杂普谈围食射源例致酸旧却充足短划剂宣环落首尺波承粉践府鱼随考刻靠够满夫失包住促枝局菌杆周护岩师举曲春元超负砂封换太模贫减阳扬江析亩木言球朝医校古呢稻宋听唯输滑站另卫字鼓刚写刘微略范供阿块某功套友限项余倒卷创律雨让骨远帮初皮播优占死毒圈伟季训控激找叫云互跟裂粮粒母练塞钢顶策双留误础吸阻故寸盾晚丝女散焊功株亲院冷彻弹错散商视艺灭版烈零室轻血倍缺厘泵察绝富城冲喷壤简否柱李望盘磁雄似困巩益洲脱投送奴侧润盖挥距触星松送获兴独官混纪依未突架宽冬章湿偏纹吃执阀矿寨责熟稳夺硬价努翻奇甲预职评读背协损棉侵灰虽矛厚罗泥辟告卵箱掌氧恩爱停曾溶营终纲孟钱待尽俄缩沙退陈讨奋械载胞幼哪剥迫旋征槽倒握担仍呀鲜吧卡粗介钻逐弱脚怕盐末阴丰雾冠丙街莱贝辐肠付吉渗瑞惊顿挤秒悬姆烂森糖圣凹陶词迟蚕亿矩康遵牧遭幅园腔订香肉弟屋敏恢忘编印蜂急拿扩伤飞露核缘游振操央伍域甚迅辉异序免纸夜乡久隶缸夹念兰映沟乙吗儒杀汽磷艰晶插埃燃欢铁补咱芽永瓦倾阵碳演威附牙芽永瓦斜灌欧献顺猪洋腐请透司危括脉宜笑若尾束壮暴企菜穗楚汉愈绿拖牛份染既秋遍锻玉夏疗尖殖井费州访吹荣铜沿替滚客召旱悟刺脑措贯藏敢令隙炉壳硫煤迎铸粘探临薄旬善福纵择礼愿伏残雷延烟句纯渐耕跑泽慢栽鲁赤繁境潮横掉锥希池败船假亮谓托伙哲怀割摆贡呈劲财仪沉炼麻罪祖息车穿货销齐鼠抽画饲龙库守筑房歌寒喜哥洗蚀废纳腹乎录镜妇恶脂庄擦险赞钟摇典柄辩竹谷卖乱虚桥奥伯赶垂途额壁网截野遗静谋弄挂课镇妄盛耐援扎虑键归符庆聚绕摩忙舞遇索顾胶羊湖钉仁音迹碎伸灯避泛亡答勇频皇柳哈揭甘诺概宪浓岛袭谁洪谢炮浇斑讯懂灵蛋闭孩释乳巨徒私银伊景坦累匀霉杜乐勒隔弯绩招绍胡呼痛峰零柴簧午跳居尚丁秦稍追梁折耗碱殊岗挖氏刃剧堆赫荷胸衡勤膜篇登驻案刊秧缓凸役剪川雪链渔啦脸户洛孢勃盟买杨宗焦赛旗滤硅炭股坐蒸凝竟陷枪黎救冒暗洞犯筒您宋弧爆谬涂味津臂障褐陆啊健尊豆拔莫抵桑坡缝警挑污冰柬嘴啥饭塑寄赵喊垫丹渡耳刨虎笔稀昆浪萨茶滴浅拥穴覆伦娘吨浸袖珠雌妈紫戏塔锤震岁貌洁剖牢锋疑霸闪埔猛诉刷狠忽灾闹乔唐漏闻沈熔氯荒茎男凡抢像浆旁玻亦忠唱蒙予纷捕锁尤乘乌智淡允叛畜俘摸锈扫毕璃宝芯爷鉴秘净蒋钙肩腾枯抛轨堂拌爸循诱祝励肯酒绳穷塘燥泡袋朗喂铝软渠颗惯贸粪综墙趋彼届墨碍启逆卸航衣孙龄岭骗休借".$addChars;
			break;
		default :
			// 默认去掉了容易混淆的字符oOLl和数字01，要添加请使用addChars参数
			$chars='ABCDEFGHIJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'.$addChars; 
			break;
	}
	if($len>10 ) {//位数过长重复字符串一定次数
		$chars= $type==1? str_repeat($chars,$len) : str_repeat($chars,5); 
	}
	if($type!=4) {
		$chars = str_shuffle($chars);
		$str = substr($chars,0,$len);
	}
	else{
		// 中文随机字
		for($i=0;$i<$len;$i++){
			$str .= mb_substr($chars,floor(mt_rand(0,mb_strlen($chars,'UTF-8')-1)),1,'UTF-8');
		} 
	}
	return $str;
}





//截取字符串
function mysubstr($str, $start, $len)
{
	$tmpstr = "";
	$strlen = $start + $len;
	for($i = 0; $i < $strlen; $i++) {
		if(ord(substr($str, $i, 1)) > 0xa0) 
		{
			$tmpstr .= substr($str, $i, 2);
			$i++;
		} 
		else
		{
			$tmpstr .= substr($str, $i, 1);
		}
	}
	return $tmpstr;
}

/**
把 SimpleXMLElement 对象转换成数组的函数，支持把 utf-8 编码转成别的编码。若不用 $charset 参数，则保持原有的 UTF-8 编码
参数:
$xmlString	符合xml格式的字符串
$attribsAsElements	属性是否作为数组元素输出，默认为 0，不输出
$charset	字符集
返回: PHP 数组
*/
function simplexml2Array($xml, $attribsAsElements=0, $charset='')
{
	if (get_class($xml) == 'SimpleXMLElement')
	{
		$attributes = $xml->attributes();
		foreach($attributes as $k=>$v)
		{
			if ($v) $a[$k] = (string) $v;
		}
		$x = $xml;
		$xml = get_object_vars($xml);
	}
	if (is_array($xml))
	{
		if (count($xml) == 0) return (string) $x; // for CDATA
		foreach($xml as $key=>$value)
		{
			//这里递归调用，所以要把 $charset 再传递一下。
			$r[$key] = simplexml2Array($value, $attribsAsElements, $charset);
			if (!is_array($r[$key]) && ('' != $charset))
			{
				$r[$key] = iconv ('utf-8', $charset,$r[$key]);
			}
		}
		if (isset($a))
		{
			if($attribsAsElements)
			{
				$r = array_merge($a,$r);
			} else
			{
				$r['@'] = $a; // Attributes
			}
		}
		return $r;
	}
	return (string) $xml;
}

// 生成对应xml数组
function get_xml_data($data, $count = '0', $status = '100', $desc = 'OK',$encoding='gb2312')
{
	$output = '<?xml version="1.0" encoding="'.$encoding.'"?>';
	$output .= '<root c_datetime="'. date('Y-m-d H:i:s') .'">';
	$output .= '<status>'. filter_xml_data($status) . '</status>';
	$output .= '<count>'. filter_xml_data($count) . '</count>';
	$output .= '<desc>'. filter_xml_data($desc) . '</desc>';
	$output .= '<items>';
	if (is_array($data))
	{
		foreach ( $data as $row )
		{
			$output .= array_to_xml('item', $row);
		}
	}
	else
	{
		$output .= filter_xml_data($data);
	}
	$output .= '</items>';
	$output .= '</root>';
	return $output;
}

// 数组转换成XML
function array_to_xml($name, $value)
{
	$str = '';
	$name = strtolower($name);
	if ($name = filter_xml_data($name))
	{
		$str  .= '<' .  $name . '>';
		if (is_array($value))
		{
			foreach($value as $k => $v)
			{
				if (is_numeric($k))
				{
					$k = $name . '_' . $k;
				}
				$str .= array_to_xml($k, $v);
			}
		}
		else
		{
			$str .= filter_xml_data($value);
		}
		$str  .= '</' .  $name . '>';
	}
	return $str;
}

// 过滤xml数据
function filter_xml_data($source)
{
	$source_chr = array('&', '<', '>', "'", '"', chr(10), chr(13));
	$target_chr = array('&amp;', '&lt;', '&gt;', '&apos;', '&quot;', '', '');
	return str_replace($source_chr, $target_chr, $source);
}
// 过滤sql service 字符
function mssql_escape_string_fun($str)
{
	$from = array("\'");
	$to = array("''");
	$str = str_replace($from,$to,$str);
	return $str;
}

function write_msg_json($status = 0,$errmsg = '',$datalist=array(),$checkauth='')
{
	$jsondata = array();
	//if(is_array($datalist))
	//{
		//$datalist = gbk2utf8($datalist);
	//}
	//$errmsg  = gbk2utf8($errmsg);
	$jsondata["resultcode"] = $status;
	$jsondata["checkauth"] = $checkauth;
	$jsondata["resultinfo"] = array();
	$jsondata["resultinfo"]["errmsg"] = $errmsg;
	$jsondata["resultinfo"]["list"] = $datalist;
	$jsondata["obj"] = array();
	return json_encode($jsondata);
}
function imc_write_msg_json($status = 0,$errmsg = '',$keylist=array(),$datalist=array())
{
	$jsondata = array();
	if(is_array($datalist))
	{
		//$datalist = gbk2utf8($datalist);
	}
	//$errmsg  = gbk2utf8($errmsg);
	$jsondata["retcode"] = $status;
	$jsondata["retmsg"] = $errmsg;
	if(!empty($keylist))
	{
		foreach($keylist as $key=>$value)
		{
			$jsondata[$key] = $value;
		}
	}
	if(!empty($datalist))
	{
		$jsondata["items"] = array();
		$jsondata["items"] = $datalist;
	}
	
	return json_encode($jsondata);
}
function show_json_str($datalist,$setheader = 0)
{
	$show = json_encode($datalist);
	//echo json_encode($res);
	if($setheader == 1)
	{
		//header("content-length: ".strlen($show));
	}
	echo $show;
}
function gbk2utf8($data)
{
  if(is_array($data))
  {
    return array_map('gbk2utf8', $data);
  }
	return iconv('gbk','utf-8//IGNORE',$data);
}


// json解析方法，处理json_decode返回null的数据
function custom_json_decode($json,$assoc = false)
{
	$ret = json_decode($json,$assoc);
  if($ret == NULL)
  {
  	$json = str_replace(array("\n","\r"),"",$json); 
  	$json=iconv("UTF-8","GBK//IGNORE",$json);
  	$json=iconv("GBK","UTF-8//IGNORE",$json);
  	$json = json_encode($json);
		$json = str_replace('\"','"',$json);
		$json = str_replace('\\\/','\/',$json);
		$json = str_replace('\\\\','\\',$json);
		$json = substr($json, 1, strlen($json) - 2);
		$ret = json_decode($json,$assoc);
  }
  return $ret;
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



