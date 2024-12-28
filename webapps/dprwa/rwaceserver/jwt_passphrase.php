<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Your passphrase
$passphrase = 'heya whasssup buddy';

// Your private key file with passphrase
// Can be generated with "ssh-keygen -t rsa -m pem"
$privateKeyFile = '/path/to/key-with-passphrase.pem';

// Create a private key of type "resource"
$privateKey = openssl_pkey_get_private(
    file_get_contents($privateKeyFile),
    $passphrase
);

$payload = [
    'iss' => 'example.org',
    'aud' => 'example.com',
    'iat' => 1356999524,
    'nbf' => 1357000000
];

$jwt = JWT::encode($payload, $privateKey, 'RS256');
echo "Encode:\n" . print_r($jwt, true) . "\n";

// Get public key from the private key, or pull from from a file.
$publicKey = openssl_pkey_get_details($privateKey)['key'];

$decoded = JWT::decode($jwt, new Key($publicKey, 'RS256'));
echo "Decode:\n" . print_r((array) $decoded, true) . "\n";

