<?php
/**
 * Created by PhpStorm.
 * User: Rachid
 * Date: 06/01/17
 * Time: 14:12
 */
header('Content-Type: application/json');
$result = [
    'errors' => [],
    'sets' => [],
];

$buildId = isset($_GET['id']) ? intval($_GET['id']):null;

if(!$buildId){
    die('Wrong call');
}

//$url = 'http://www.lolking.net/guides/386351';
//$url = 'http://www.lolking.net/guides/243252';
$url = 'http://www.lolking.net/guides/' . $buildId;
$html = @file_get_contents($url);
if( ! $html){
    $result['errors'][] = 'Unable to find build';
}

if($html){
    //Fetch sections
    preg_match('/<section id="items">(.*?)<\/section>/is', $html, $matches);
    $xml = simplexml_load_string($matches[0]);

    //Create blocks
    $blocks = [];
    $sectionName = '';
    foreach($xml->xpath('/section/div')[0]->children() as $child){
        if($child->getName() == 'h4'){
            $sectionName = (string)$child;
        }
        if($child->getName() == 'ul'){
            foreach($child->xpath('li/div') as $sectionBlock){
                $block = [];
                $block['type'] = $sectionName . ' - ' . (string) $sectionBlock->xpath('span')[0];

//            print_r($sectionBlock);
                foreach($sectionBlock->xpath('ul/li/a') as $itemBlock){
//                print_r($itemBlock);
                    $block['items'][] = [
                        'count' => 1,
                        'id' => (string) str_replace('/items/','', $itemBlock['href']),
                    ];
                }

                $blocks[] = $block;
            }
        }
    }

    //Find the champion json array
    preg_match('/LOLKING.champions = (.*?);/is', $html, $matches);
    $champions = json_decode($matches[1], true);

    //Find champion name (not the code, ex: "wukong")
    preg_match('/<a href="\/guides\/champion\/(.*?)">.*?<\/a>/', $html, $matches);
    $championName = $matches[1];

    //Get champion ID (ex: 62)
    foreach($champions as $champ){
        if($championName == $champ['internal_name']){
            $championId = $champ['champion_id'];
            break;
        }
    }

    //Get final champion real code value
    foreach(json_decode(file_get_contents('data_en_US.json'), true)['champion']['data'] as $champ){
        if($championId == $champ['key']){
            $champion = $champ;
        }
    }

    //Title
    preg_match('/<div class="guide-breadcrumb">.*?<span>(.*?)<\/span>/is', $html, $matches);
    $title = trim($matches[1]);

    $result['sets'][] = [
        'title' => $title,
        'filename' => "lolking_{$champion['id']}_$buildId.json",
        'champion' => $champion['id'],
        'blocks' => $blocks,
    ];
}

echo json_encode($result);