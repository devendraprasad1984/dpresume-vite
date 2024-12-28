<?php
header("Access-Control-Allow-Origin: *");
//read the set of code files & return json object for ace editor on webPage
//echo('http://localhost:8000/API/getCode.php');
//echo('hello i will help get it done');
$br = "<br/>";
$output = new stdClass();
try {
    $req = $_REQUEST;
    if (array_key_exists('files', $req)) {
        $basePath = './codes/';
        $ext='.js';
        $files = explode(',', $req['files']);
    } elseif (array_key_exists('nodes', $req)) {
        $basePath = './Node/';
        $files = explode(',', $req['nodes']);
        $ext='.js';
    } elseif (array_key_exists('python', $req)) {
        $basePath = './Python/';
        $files = explode(',', $req['python']);
        $ext='.py';
    } elseif (array_key_exists('sql', $req)) {
        $basePath = './Sql/';
        $files = explode(',', $req['sql']);
        $ext='.sql';
    }
    foreach ($files as $f) {
        $fn = "$basePath$f$ext";
        $myfile = fopen($fn, "r") or die("Unable to open file!-$fn");
        $contents = fread($myfile, filesize($fn));
        $output->{$f} = $f . '====>' . $contents;
        fclose($myfile);
    }
    echo json_encode($output, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    $output->error = $e->getMessage();
    echo json_encode($output, JSON_PRETTY_PRINT);
}

?>