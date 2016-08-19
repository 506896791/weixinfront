<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
# ddd 
include 'UrlFileHelper.php';
/**
 * Description of WeatherHelper
 *
 * @author dickzhou
 */
class WeatherHelper {
    //put your code here
    public  function get_city_weather($city_name)
    {
        $str_result = "未检索到你输入的城市";
        //是否存在城市代码
        $dbname = 'OdTidEUNiTtHpJhzHDBq';
 
        $host = getenv('HTTP_BAE_ENV_ADDR_SQL_IP');
        $port = getenv('HTTP_BAE_ENV_ADDR_SQL_PORT');
        $user = getenv('HTTP_BAE_ENV_AK');
        $pwd = getenv('HTTP_BAE_ENV_SK');

        $link = @new mysqli($host, $user, $pwd, $dbname, $port);
        $sql = "select Code from Data_CityCode where R_Name = '{$city_name}' and EnableFlag = 1";
        $result = mysqli_query($link, $sql);
        $row_count = mysqli_num_rows($result);
        if($row_count > 0)
        {
            $row = mysqli_fetch_row($result);
            $code = $row[0];
            
            $urlapi = "http://m.weather.com.cn/data/{$code}.html";
            $json = UrlFileHelper::file_get_content($urlapi);
            $obj = json_decode($json);
            $weatherinfo = $obj->weatherinfo;
            $str_result = "{$city_name}天气\n{$weatherinfo->date_y}   {$weatherinfo->week}\n";
            $str_result .= "今天  {$weatherinfo->temp1}  {$weatherinfo->weather1}\n";
            $str_result .= "明天  {$weatherinfo->temp2}  {$weatherinfo->weather2}\n";
            $str_result .= "后天  {$weatherinfo->temp3}  {$weatherinfo->weather3}";
        }
        return $str_result;
        
    }
}

?>
