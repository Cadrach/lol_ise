'use strict';

angular.module('appLolIse.viewMain', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/editor/:language?', {
        templateUrl: 'app/viewMain/viewMain.html',
        controller: 'ViewMainCtrl',
        resolve: {
            source: function(ddragon, $route){
                return ddragon.getData($route.current.params.language);
            }
        }
    });
}])
.directive('scrollable', ['$window', '$timeout', function ($window, $timeout) {
    function link(scope, element) {
        function autosize(){
            var e = angular.element(element);
            e.css('height', 'calc(100vh - ' + (e.offset().top+10) + 'px)');
        }

        element.mCustomScrollbar({
            theme:"dark"
        });
        console.log('???', scope)
        if(typeof scope.autosizeFromTop !== 'undefined'){
            angular.element($window).resize(autosize);
            $timeout(autosize);
        }
    }

    return {
        restrict: 'A',
        scope: {
            autosizeFromTop: '@'
        },
        link: link
    }
}])
.controller('ViewMainCtrl', ['$scope', '$uibModal', 'ddTranslate', 'ddragon', 'source', function($scope, $uibModal, ddTranslate, ddragon, source) {
    /**
     * **************************************************************************************
     * LOCAL VARS
     */
    var items = source.data.item.data;
    var champions = source.data.champion.data;
    var language = source.data.language.data;
    var defaultSet = {
        title: 'Custom Item Set',
        map: 'any',
        mode: 'any',
        priority: false,
        sortrank: null,
        champion: _.toArray(champions)[70].id,
        blocks: [
            {
                type: "A block with just boots",
                showIfSummonerSpell: "",
                hideIfSummonerSpell: "",
                items: [
                    {id: "1001", count: 1}
                ]
            }
        ]
    }

    /**
     * **************************************************************************************
     * SCOPE VARS
     */
    //Version & languages
    $scope.version = source.data.champion.version;
    $scope.languages = _.chain(source.config.languages).map(function(lg){return lg.slice(0,2)}).uniq().value();
    $scope.language = ddragon.getLanguage().slice(0,2);

    //Used items (we clean the unused ones)
    $scope.items = items;
    _.each($scope.items, function(item, key){
        item.id = key;
        if( ! item.gold.purchasable || (item.hideFromAll && !item.plaintext)){
            delete $scope.items[key]; //delete obsoletes
        }
        else if( ! item.gold.total && !item.tags.length && item.consumed){
            delete $scope.items[key]; //delete other mode items
        }
        else if( ! item.gold.global && item.requiredChampion){
            delete $scope.items[key]; //delete default item (like Kalista's)
        }

        //Create search properties
        item.search = [item.name].concat(item.colloq.split(';')).join('|').toLowerCase();
        item.exactSearch = item.tags.concat(item.stats).map(function(v){return v.toLowerCase ? v.toLowerCase():''});
    })

    //Searchable items array list
    $scope.itemsArray = _.chain($scope.items).sortBy(function(item){return item.name}).sortBy(function(item){return item.gold.total}).value();

    //Sets we manage (init to default set) & current set
    $scope.sets = [
        angular.copy(defaultSet)
    ];
    $scope.set = $scope.sets[0];

    //Maps
    //Img: http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png
    $scope.maps = {
        //1:	"Original Summoner's Rift",
        any: {name: "Any Map", code: null},
        SR:	{name: ddTranslate.get('Map1'), code: 11},
        TT:	{name: ddTranslate.get('Map10'), code: 10},
        HA:	{name: ddTranslate.get('Map12'), code: 12}
    }

    //Champions
    $scope.champions = champions;
    $scope.championsArray = _.chain(champions).toArray().sortBy('name').value();

    //Tags
    $scope.tags = _.chain($scope.items).pluck('tags').flatten().uniq().map(function(tag){
        var colloq = language['colloq_' + tag] && language['colloq_' + tag].length>1 ? language['colloq_' + tag]:'';
        var translate = language[tag] ? language[tag]:'';

        var label = colloq ? _.last(colloq.split(';')).toUpperCase() : translate;

        if(label){
            return {
                code: tag,
                label: label,
                sort: colloq ? 0:1
            }
        }
    }).filter().value().sort();

    //Filters for items
    $scope.filters = {
        string: '',
        tags: {}
    }

    //Draggable config (list of all items)
    $scope.draggable = {
        helper: 'clone',
        appendTo: 'body',
        placeholder: 'ise-item-placeholder',
        connectWith: '.ise-block-items-dropzone',
        update: function(event, ui){ui.item.sortable.cancel();}
    }

    //Sortable config (config for each block)
    $scope.sortable = {
        placeholder: 'ise-item-placeholder',
        receive: function(event, ui){
            ui.item.sortable.cancel();
            var model = ui.item.sortable.model;
            var id = model.id.toString();
            var blockItems = ui.item.sortable.droptargetModel;
            var position = ui.item.sortable.dropindex;

            //If the item stacks, check if we should stack
            if(model.stacks){
                //Find item in current array
                var found = _.findWhere(blockItems, {id: id});
                if(found){
                    if(model.stacks > found.count){
                        found.count++;
                        return; //we do nothing else
                    }
                    else{
                        throw "Maximum reached";
                    }
                }
            }

            //Create item in block
            blockItems.splice(position, 0, {
                id: id,
                count: 1
            })
        }
    }

    /**
     * **************************************************************************************
     * SCOPE METHODS
     */

    /**
     * Clicking on an item
     * @param item
     */
    $scope.selectItem = function(item){
        console.log(item);
    }

    /**
     * Remove an item from a block
     * @param block
     * @param item
     * @param $event
     */
    $scope.removeItemFromBlock = function(block, item, $event){
        $event.stopPropagation();
        if(item.count>1){
            //If more than one item, simply reduce the counter
            item.count--;
        }
        else{
            //Otherwise completely remove item
            block.items.splice(block.items.indexOf(item), 1);
        }
    }

    /**
     * Select a set
     * @param theSet
     */
    $scope.selectSet = function(theSet){
        $scope.set = theSet;
    }

    /**
     * Add a block to the current set
     */
    $scope.addBlock = function(){
        $scope.set.blocks.push({
            type: "New Block",
            items: []
        })
    }

    /**
     * Open the modal to add a set
     */
    $scope.openModalAddSet = function(){
        $uibModal.open({
            size: 'xl',
            templateUrl: 'app/template/modal-new-set.html?' + new Date,
            scope: $scope
        })
    }

    /**
     * Add a set for a champion
     * @param champion
     */
    $scope.addSet = function(champion){
        var theSet = angular.copy(defaultSet);
        theSet.champion = champion.id;
        $scope.sets.push(theSet);
        $scope.set = theSet;
    }

    /**
     * Returns TRUE if item should be shown
     * @param item
     * @returns {boolean}
     */
    $scope.isShownItem = function(item){
        var f = $scope.filters;

        //Filter on map
        var map = $scope.maps[$scope.set.map].code;
        if(map && ! item.maps[map]){
            return false;
        }

        //Filter on tags
        var tags = _.chain(f.tags).map(function(value, key){return value ? key:null}).filter().value();
        if(tags.length && _.intersection(item.tags, tags).length !== tags.length){
            return false;
        }

        //Filter on string
        var s = f.string.toLowerCase();
        if(item.exactSearch.indexOf(s) >= 0){
            return true;
        } else if(f.string && item.search.toLowerCase().indexOf(s) < 0){
            return false;
        }

        return true;
    }

    //Pass the translation method
    $scope.translate = ddTranslate.get;

    /**
     * **************************************************************************************
     * WATCHES
     */
    $scope.$watchCollection('sets', function(){
        $scope.setsArray = _.groupBy($scope.sets, 'champion');
        //console.log('Array update, champs:', _.toArray($scope.setsArray).length, 'sets:', _.toArray($scope.sets).length);
    });
}]);