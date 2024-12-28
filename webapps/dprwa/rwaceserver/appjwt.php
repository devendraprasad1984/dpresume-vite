<?php
require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


$key = 'rwAcEdpReSUme';
$algoName = 'HS256';

function generatePayload($data)
{
    $server = $_SERVER['HTTP_ORIGIN'];
    $name = $data['name'];
    $id = $data['id'];
    $memkey = $data['memkey'];
    $when = $data['when'];
    $pwd = $data['password'];
    $payload = [
        'iss' => $server,
        'aud' => $server,
        'iat' => 1356999524,
        'id' => $id,
        'name' => $name,
        'memkey' => $memkey,
        'when' => $when,
        'password' => $pwd
    ];
    return $payload;
}

function getJWT($data)
{
    global $key, $algoName;
    $updatedPayload = generatePayload($data);
    $jwt = JWT::encode($updatedPayload, $key, $algoName);
    return $jwt;
}

function decodeJWT($data)
{
    global $key, $algoName;
    $myjwt = $data['jwt'];
    $decoded = JWT::decode($myjwt, new Key($key, $algoName));
    return $decoded;
}
