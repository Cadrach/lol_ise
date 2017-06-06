<?php
include 'config.inc.php';

$name = isset($_GET['name']) ? $_GET['name']:'Cadrach';
$server = isset($_GET['server']) ? $_GET['server']:'euw1';

$url = "https://%s.api.riotgames.com/lol/summoner/v3/summoners/by-name/%s?api_key=" . RIOT_API_KEY;
$url = sprintf($url, $server, urlencode($name));

$data = @file_get_contents($url);
if($data){
    echo $data;
}
else{
    echo json_encode(['error' => 'Account not found']);
}