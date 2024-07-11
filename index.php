<?php
header('Content-Type: image/svg+xml');

function get_version($str) {
    preg_match('/(\d+\.\d+\.\d+)<\/a>\s+\(latest\)/', $str, $matches);
    return $matches[1];
}

function get_name($str) {
    preg_match('/<h1>(.*?)<\/h1>/', $str, $matches);
    return $matches[1];
}

if (!isset($_GET["lib"])) {
    $lib = "No lib specified";
}else{
    $lib = $_GET["lib"];
}
$cache_file = '/tmp/arduino_lib_' . md5($lib) . '.cache';

if (file_exists($cache_file) && (time() - filemtime($cache_file) < 86000)) {
    // Use cached version if it's less than 1 day
    $data = json_decode(file_get_contents($cache_file), true);
    $name = $data['name'];
    $version = $data['version'];
} else {
    $url = "https://www.arduino.cc/reference/en/libraries/" . strtolower(str_replace(" ", "-", $lib)) . "/";
    $website = @file_get_contents($url);

    if ($website === false) {
        $badge_url = "https://img.shields.io/badge/Library%20Manager-" . urlencode($lib) . "-red?logo=arduino";
        echo file_get_contents($badge_url);
        die;
    }

    $version = get_version($website);
    $name = get_name($website);

    if ($name && $version) {
        // Cache the results
        $data = ['name' => $name, 'version' => $version];
        file_put_contents($cache_file, json_encode($data));
    }
}

if (!$name || !$version) {
    $badge_url = "https://img.shields.io/badge/Library%20Manager-" . urlencode($lib) . "-red?logo=arduino";
} else {
    $badge_url = "https://img.shields.io/badge/Library%20Manager-" . $name . "%20" . $version . "-green?logo=arduino&color=%233C1";
}
echo "hello";
echo file_get_contents($badge_url);
