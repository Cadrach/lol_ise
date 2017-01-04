<?php
include 'config.inc.php';

//Security
if(!isset($_GET['seed']) || $_GET['seed'] != SECURITY_SEED){
    die('Invalid seed');
}

function get($url){
    return json_decode(file_get_contents($url), true);
}

//Initial vars
$apiVersion = '1.2';
$url = "https://global.api.pvp.net/api/lol/static-data/euw/v$apiVersion/";
$ddragon = "http://ddragon.leagueoflegends.com/cdn/";

//Fetch latest version
$version = get($url . "versions?api_key=" . RIOT_API_KEY)[0];
$languages = get($ddragon . 'languages.json');

//Config json
file_put_contents("config.json", json_encode(['version' => $version, 'languages' => $languages, 'generatedOn' => date('Y-m-d H:i:s')]));

//Ddragon data, per language
foreach($languages as $language){
    $json = [];
    $json['item'] = get($ddragon . $version . "/data/$language/item.json");
    $json['champion'] = get($ddragon . $version . "/data/$language/champion.json");
    $json['language'] = get($ddragon . $version . "/data/$language/language.json");
    $json['language']['data']['native_ko'] = '한국어';
    $json['language']['data']['Jungle'] = 'Jungle';
    $json['language']['data']['Vision'] = 'Vision';
    file_put_contents("data_$language.json", json_encode($json));
}
echo $version;