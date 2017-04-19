<?php
/**
 * Created by PhpStorm.
 * User: Rachid
 * Date: 06/01/17
 * Time: 14:12
 */
$buildId = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_SANITIZE_STRING):'Swain';

if(!$buildId){
    die('Wrong call');
}

//Get english riot data
$riotData = json_decode(file_get_contents('data_en_US.json'), true);
$version = $riotData['item']['version'];

//Create inverted dictionnary of item names
$itemIds = [];
foreach($riotData['item']['data'] as $itemId => $item){
    $itemIds[$item['name']] = (string) $itemId;
}

$url = 'http://lolalytics.com/champion/'.$buildId.'/';
$html = file_get_contents($url);

//Convert to XML
$doc = new DOMDocument();
@$doc->loadHTML($html); //Cleans up the XML
$xml = simplexml_import_dom($doc);

//Find champion name
$championName = @(string) $xml->xpath('.//div[@class="championinfo"]//h1')[0];

//Get final champion real code value
foreach($riotData['champion']['data'] as $champ){
    if($championName == $champ['name']){
        $champion = $champ;
        break;
    }
}

$sets = [];
$errors = [];

//Block we are analyzing in lolalytics page
$analyzedBlocks = [
    'Starting Items',
    'First Item',
    'Boots',
    'Second Item',
    'Third Item',
    'Fourth Item',
    'Fifth Item',
    'Popular Items',
    'Winning Items',
];

if(isset($champion)){
    $blocks = [];
    foreach($xml->xpath('//td[@class="summarytitle"]') as $line){
        if(in_array((string) $line, $analyzedBlocks)){
            //Create block
            $block = [
                'type' => (string) $line,
                'items' => [],
            ];

            //Add items
            foreach($line->xpath('following-sibling::td[@class="summarydetails"]//h1') as $item){
                $itemName = (string) $item;
                if(isset($itemIds[$itemName])){
                    $block['items'][] = [
                        'count' => 1,
                        'id' => $itemIds[$itemName],
                    ];
                }
                else{
                    $errors[] = "Item [$itemName] does not exist in current patch.";
                }
            }

            //Add block
            $blocks[] = $block;
        }
    }

    //Add set to our list of sets
    $sets[] = [
        'title' => "LoLalytics - $version",
        'filename' => "lolalytics_{$champion['id']}.json",
        'champion' => $champion['id'],
        'blocks' => $blocks,
    ];
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