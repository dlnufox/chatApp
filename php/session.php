<?php
/**
 * 
 * @date 2014-11-30
 * @author zhengyin <zhengyin.name@gmail.com>
 */
$result = array();
$sessId = isset($_GET['sessId'])?$_GET['sessId']:'';
if(!empty($sessId)){
	session_id($sessId);
	session_start();
	$result = $_SESSION;
}
echo json_encode($result);