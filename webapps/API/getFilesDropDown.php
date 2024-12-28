<?php
header("Access-Control-Allow-Origin: *");
try {
    $req = $_REQUEST;
    $basePath = './'.$req['dir'].'/';
    $files = glob($basePath.'*.*');
    $filesArr=array();
    foreach ($files as $f) {
//        echo "$f<br/>";
        $onlyFn=str_replace($basePath,'', $f);
        $onlyFn=str_replace('.js', '',$onlyFn);
        $onlyFn=str_replace('.py', '',$onlyFn);
        $onlyFn=str_replace('.sql', '',$onlyFn);
        array_push($filesArr,$onlyFn);
    }
//    print_r($filesArr);
//    print_r((object)$filesArr);
    $output=(object)$filesArr;
    echo json_encode($output, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    $output->error = $e->getMessage();
    echo json_encode($output, JSON_PRETTY_PRINT);
}

?>