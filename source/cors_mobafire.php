<?php
/**
 * Created by PhpStorm.
 * User: Rachid
 * Date: 06/01/17
 * Time: 14:12
 */
$buildId = isset($_GET['id']) ? intval($_GET['id']):'434093';

if(!$buildId){
    die('Wrong call');
}

//Get english riot data
$riotData = json_decode(file_get_contents('data_en_US.json'), true);

//Create inverted dictionnary of item names
$itemIds = [];
foreach($riotData['item']['data'] as $itemId => $item){
    $itemIds[$item['name']] = (string) $itemId;
}

//$url = 'http://www.lolking.net/guides/386351';
//$url = 'http://www.lolking.net/guides/243252';
$url = 'http://www.mobafire.com/league-of-legends/build/' . $buildId;
$html = file_get_contents($url);

//Convert to XML
$doc = new DOMDocument();
@$doc->loadHTML($html); //Cleans up the XML
$xml = simplexml_import_dom($doc);

//Find champion name
$championName = (string) $xml->xpath('.//div[@id="scroll-follower-container"]//h3')[0];

//Get final champion real code value
foreach($riotData['champion']['data'] as $champ){
    if($championName == $champ['name']){
        $champion = $champ;
    }
}

$sets = [];
$errors = [];

if(isset($champion)){
    foreach($xml->xpath('//div[@class="build-wrap"]') as $buildNumber=>$build){
        //Get build title
        $title = (string) $build->xpath('.//div[@class="build-title"]//h2')[0];
        $blocks = [];
        foreach($build->xpath('.//div[@class="item-wrap self-clear float-left"]') as $sectionBlock){

            //Create block
            $block = [
                'type' => trim($sectionBlock->xpath('h2')[0]),
                'items' => [],
            ];

            //Read all items
            foreach($sectionBlock->xpath('.//div[@class="item-title"]/span') as $itemBlock){
                $itemName = (string) $itemBlock;
                if(isset($itemIds[$itemName])){
                    $block['items'][] = [
                        'count' => 1,
                        'id' => $itemIds[$itemName],
                    ];
                }
                else{
                    $errors[] = "In Set [$title] for block [{$block['type']}], item [$itemName] does not exist in current patch.";
                }
            }
            $blocks[] = $block;
        }

        //Add set to our list of sets
        $sets[] = [
            'title' => $title,
            'filename' => "mobafire_{$champion['id']}_{$buildId}_Build_{$buildNumber}.json",
            'champion' => $champion['id'],
            'blocks' => $blocks,
        ];
    }
}
else{
    $errors[] = 'Unable to find build';
}

//Render the JSON
header('Content-Type: application/json');
echo json_encode([
    'errors' => $errors,
    'sets' => $sets,
]);