<?php
/**
 * 
 * 登陆
 * @date 2014-11-30
 * @author zhengyin <zhengyin.name@gmail.com>
 * 
 */
$conf = include 'conf.php';
ini_set('session.cookie_domain',$conf['session']['domain']);
session_start();
if(isset($_SESSION['userId']) && $_SESSION['userId']>0){
	header('Location:index.html');	
}
if($_SERVER['REQUEST_METHOD'] == 'POST'){
	if(!empty($_POST['userName'])){
		$_SESSION['userId'] = time()-mt_rand(100000,110000);
		$_SESSION['userName'] = $_POST['userName'];
		session_write_close();
		$returnUrl = isset($_GET['returnUrl'])?$_GET['returnUrl']:'index.html';
		header('Location:'.$returnUrl);
	}
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<meta charset='utf-8'>
<head>
<title>登陆</title>
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<style type="text/css">
	#window{width:360px;margin:30px auto;}
</style>
</head>

<body>
	
	<div id="window">
		<form role="form" method="post" action="">
			  <div class="form-group">
			    <label >你的名字？</label>
			    <input type="text" name="userName" class="form-control" placeholder="填写一个测试的名称 ..">
			  </div>
			  <button type="submit" class="btn btn-default">Submit</button>
		</form>
	</div>
</body>
</html>