<?php
include 'config.inc.php';

//List of servers
$servers = array_map(function($v){return $v['code'];}, json_decode(file_get_contents('servers.json'), true)['servers']);

$name = isset($_GET['name']) ? $_GET['name']:null;
$server = isset($_GET['server']) && in_array($_GET['server'], $servers)? strtolower($_GET['server']):null;

if(!$name || !$server){
    die(json_encode(['error' => 'Missing parameters']));
}

$url = "https://%s.api.riotgames.com/lol/summoner/v3/summoners/by-name/%s?api_key=" . RIOT_API_KEY;
$url = sprintf($url, $server, urlencode($name));

$data = @file_get_contents($url);
if($data){
    die($data);
}
else{
    die(json_encode(['error' => 'Account not found']));
}