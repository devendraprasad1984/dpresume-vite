<?php
require_once '../include.php';
try {
    global $conn;
    $products = pullTableRows('products');
    $product_images = pullTableRows('product_images');
    $rows = ['status' => 'success'];
    $rows['products'] = $products;
    $rows['images'] = $product_images;
    if ($conn) mysqli_close($conn);
    echo json_encode($rows);
} catch (Exception $ex) {
    echo json_encode($ex);
}

