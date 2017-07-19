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
$apiVersion = '3';
$url = "https://euw1.api.riotgames.com/lol/static-data/v$apiVersion/";
$ddragon = "http://ddragon.leagueoflegends.com/cdn/";

//Fetch latest version
$servers = json_decode(file_get_contents('servers.json'), true)['servers'];
$version = get($url . "versions?api_key=" . RIOT_API_KEY)[0];
$languages = get($ddragon . 'languages.json');

//Fetch once full data to get recommended item sets (it is long to fetch)
$recommended = get($url . "champions?tags=recommended&api_key=" . RIOT_API_KEY)['data'];

//Date
$today = date('Y-m-d H:i:s');

//Ddragon data, per language
foreach($languages as $k=>$language){
    set_time_limit(30); //30s max to fetch the data for a language
    $json = [];
    $json['item'] = get($ddragon . $version . "/data/$language/item.json");
    $json['champion'] = get($ddragon . $version . "/data/$language/champion.json");
    $json['language'] = get($ddragon . $version . "/data/$language/language.json");
    $json['language']['data']['native_ko'] = '한국어';
    $json['language']['data']['Jungle'] = 'Jungle';
    $json['language']['data']['Vision'] = 'Vision';

    //For each champion, fetch the recommended data from the full data
    foreach($json['champion']['data'] as $key=>&$champ){
        $champ['recommended'] = array_values(array_filter($recommended[$key]['recommended'], function($set){
            //Only keep relevant item sets
            return in_array($set['mode'], ['CLASSIC', 'ARAM']);
        }));

        //Convert ids to string
        foreach($champ['recommended'] as &$set){
            foreach($set['blocks'] as &$block){
                foreach($block['items'] as &$item){
                    $item['id'] = (string) $item['id'];
                }
            }
        }
    }

    $filename = "data_$language.json";

    if( ! count($json['champion']['data']) || ! count($json['item']['data'])){
        //If no champion or item data, do not replace the current file
        if( ! file_exists($filename)){
            //If the file does not exists prior to this, then we should even remove the language from available ones
            unset($languages[$k]);
        }
        continue;
    }

    //Add generated date
    $json['generatedOn'] = $today;

    file_put_contents($filename, json_encode($json));
    sleep(1); //ensure no bypass of rate limit
}

//Config json
file_put_contents("config.json", json_encode(['version' => $version, 'languages' => $languages, 'servers' => $servers, 'generatedOn' => $today]));

echo $version;