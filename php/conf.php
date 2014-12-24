<?php
/**
 * @date 2014-12-24
 * @author zhengyin <zhengyin.name@gmail.com>
 * 
 */
if(substr($_SERVER['SERVER_NAME'],strpos($_SERVER['SERVER_NAME'],'.')+1) == 'local'){
	define('SITE_EVN', 'local');
}else{
	define('SITE_EVN', 'com');
}
return array(
	'imServer'=>'im.izhengyin.'.SITE_EVN,	
	'session'=>array(
		'domain'=>'.izhengyin.'.SITE_EVN
	)	
		
);