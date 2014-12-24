<?php
/**
 * 房间
 * @date 2014-11-30
 * @author zhengyin <zhengyin.name@gmail.com>
 */
ini_set('session.cookie_domain','.izhengyin.local');
session_start();
$roomId = isset($_GET['roomId'])?(int)$_GET['roomId']:0;
if(!in_array($roomId, array(1,2,3))){
	header('Location:index.html');
}
if(!isset($_SESSION['userId'])){
	header('Location:login.php?returnUrl='.urlencode('room.php?roomId='.$roomId));
}
if(substr($_SERVER['SERVER_NAME'],strpos($_SERVER['SERVER_NAME'],'.')+1) == 'local'){
	define('SITE_EVN', 'local');
}else{
	define('SITE_EVN', 'online');
}
$_SESSION['userRoom'] = $roomId;

include __DIR__.'/room.phtml';