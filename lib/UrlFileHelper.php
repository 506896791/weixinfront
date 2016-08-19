<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UrlFileHelper
 *
 * @author dickzhou
 */
class UrlFileHelper {
    //put your code here
   public static  function  file_get_content($url) {
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
}

?>
