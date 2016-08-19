<?php

include("../init.php");

$c = getFormItemValue("c");
$m = getFormItemValue("m");

if (!$c || !$m) {
    echo write_msg_json(-1, '缺少类或方法参数!');
    exit;
}

$class = new ReflectionClass($c);
$instance = $class->newInstanceArgs();

$method = $class->getmethod($m);
$ret = $method->invoke($instance);

$isOk = $class->getmethod('isOk')->invoke($instance);
$errMsg = $class->getmethod('errors')->invoke($instance);

if (!$isOk) {
    $result = write_msg_json(-1, $errMsg);
} else {
    $result = write_msg_json(0, 'ok', $ret, "{$c}/{$m}");
}
$callback = getFormItemValue('callback');
echo "{$callback}({$result})";