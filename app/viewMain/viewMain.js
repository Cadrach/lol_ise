/**
 * League of Legends Item Set Editor
 * Copyright (C) 2016  Rachid Al-Owairdi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Contact: https://github.com/Cadrach
 */
'use strict';

angular.module('appLolIse.viewMain', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/editor/:language?', {
        templateUrl: 'app/viewMain/viewMain.html?v=' + codeVersion,
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

        var scrollable = element.mCustomScrollbar(angular.extend({
            theme:"dark"
        }, scope.scrollable));

        if(typeof scope.autosizeFromTop !== 'undefined'){
            angular.element($window).resize(autosize);
            $timeout(autosize);
        }

        //Update scrollable
        scope.$on('update-scrollable', function(){
            autosize();
            scrollable.mCustomScrollbar('update');
        })
    }

    return {
        restrict: 'A',
        scope: {
            scrollable: '=',
            autosizeFromTop: '@'
        },
        link: link
    }
}])
.controller('ViewMainCtrl', ['$scope', '$timeout', '$uibModal', '$location', '$window', 'localStorageService', 'ddTranslate', 'ddragon', 'source',
    function($scope, $timeout, $uibModal, $location, $window, localStorageService, ddTranslate, ddragon, source) {

    /**
     * **************************************************************************************
     * LOCAL FUNCTIONS
     */
    function addMultiSet(theSet){
        //Generate an ID
        if( ! theSet.multipleId){
            var max = _.chain($scope.sets).pluck('multipleId').max().value();
            theSet.multipleId = max>0 ? Number(max) + 1:1;
        }

        //Create linking array if necessary
        if( ! $scope.multiSets[theSet.multipleId]){
            $scope.multiSets[theSet.multipleId] = [];
        }

        //Push set in the array (if not in already)
        if($scope.multiSets[theSet.multipleId].indexOf(theSet)<0){
            $scope.multiSets[theSet.multipleId].push(theSet);
        }
    }

    function confirmationBox(message){
        var scope = $scope.$new();
        scope.content = message;
        var modal = $uibModal.open({
            size: 'xs',
            windowClass: 'ise-modal-confirm',
            templateUrl: 'app/template/modal-confirm.html?v=' + codeVersion,
            scope: scope
        });

        return modal.result;
    }

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
        type: 'custom',
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
    $scope.codeVersion = codeVersion;
    $scope.languages = _.chain(source.config.languages).map(function(lg){return lg.slice(0,2)}).uniq().value();
    $scope.language = ddragon.getLanguage().slice(0,2);
    $scope.multiSets = {};

    //Used items (we clean the unused ones)
    $scope.items = items;
    _.each($scope.items, function(item, key){
        item.id = key;
        if( ! item.gold.purchasable || (item.hideFromAll && !item.plaintext)){
            delete $scope.items[key]; //delete obsoletes
        }
        else if( ! item.gold.total && !item.tags.length && item.consumed && !item.requiredChampion){
            delete $scope.items[key]; //delete other mode items
        }

        //Try to fix some jungle items
        if( ! item.tags.length){
            //Read hierarchy to fix some missing tags
            _.each(item.from, function(fromId){
                if(items[fromId].tags.indexOf('Jungle')>=0){
                    item.tags.push('Jungle');
                }
                if(items[fromId].tags.indexOf('CooldownReduction')>=0){
                    item.tags.push('CooldownReduction');
                }
            });

            //Fix tags based on some stats
            if(item.stats.FlatMagicDamageMod){
                item.tags.push('SpellDamage');
            }
            if(item.stats.FlatPhysicalDamageMod){
                item.tags.push('Damage');
            }
            if(item.stats.FlatHPPoolMod){
                item.tags.push('Health');
            }
            if(item.stats.PercentAttackSpeedMod){
                item.tags.push('AttackSpeed');
            }
            if(item.stats.PercentMovementSpeedMod){
                item.tags.push('NonbootsMovement');
            }
        }

        //Create search properties
        item.search = [item.name].concat(item.colloq.split(';')).join('|').toLowerCase();
        item.exactSearch = item.tags.concat(item.stats).map(function(v){return v.toLowerCase ? v.toLowerCase():''});
    })

    //Searchable items array list
    $scope.itemsArray = _.chain($scope.items).sortBy(function(item){return item.name}).sortBy(function(item){return item.gold.total}).value();

    //Sets we manage (init to default set) & current set
    if(localStorageService.get('sets')){
        $scope.sets = localStorageService.get('sets');

        //Fix sets ids to string
        $scope.sets.forEach(function(s){
            if(s.multipleId){
                addMultiSet(s);
            }

            s.blocks.forEach(function(b){
                b.items.forEach(function(i){
                    i.id = i.id.toString();
                })
            })
        })
    }
    else{
        $scope.sets = [];
    }

    //Maps
    //Img: http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png
    $scope.maps = {
        //1:	"Original Summoner's Rift",
        any: {name: "Any Map", code: null, setCode: 'any'},
        SR:	{name: ddTranslate.get('Map1'), code: 11, setCode: 'SR'},
        TT:	{name: ddTranslate.get('Map10'), code: 10, setCode: 'TT'},
        HA:	{name: ddTranslate.get('Map12'), code: 12, setCode: 'HA'}
    }
    $scope.mapsArray = _.toArray($scope.maps);

    //Champions
    champions['Global'] = {
        id: 'Global',
        name: 'Global Set',
        title: 'Will be available to all champions',
        image: {sprite: 'passive0.png'}
    };
    $scope.champions = champions;
    $scope.championsArray = _.chain(champions).toArray().sortBy('name').value();

    //Tags
    $scope.tags = _.chain($scope.items).pluck('tags').flatten().uniq().map(function(tag){
        var colloq = language['colloq_' + tag] && language['colloq_' + tag].length>1 ? language['colloq_' + tag]:'';
        var translate = language[tag] ? language[tag]:'';

        //Improve readability of colloquial
        var label = colloq ? _.last(colloq.split(';')) : translate;
        if(colloq && label.length<=4){
            label = label.toUpperCase()
        }
        else if(colloq){
            label = label.charAt(0).toUpperCase() + label.slice(1);
        }

        //
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
        cursor: 'move',
        placeholder: 'ise-drag-placeholder',
        connectWith: '.ise-block-items-dropzone',
        update: function(event, ui){ui.item.sortable.cancel();}
    }

    //Sortable config (config for each block)
    $scope.sortable = {
        placeholder: 'ise-drag-placeholder',
        cursor: 'move',
        connectWith: '.ise-block-items-dropzone',
        receive: function(event, ui){
            //Get source information (where is it coming from?)
            var source = ui.item.sortable.sourceModel;
            var isFromAnotherBlock = _.pluck($scope.set.blocks, 'items').indexOf(source) >= 0;

            //We must do some specifics if we pull from the items list, if it comes from another block nothing to do!
            if( ! isFromAnotherBlock){
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
    }

    $scope.sortableBlocks = {
        placeholder: 'ise-drag-placeholder ise-drag-placeholder-block',
        cursor: 'move',
        connectWith: '.ise-block',
        handle: '.ise-drag-handle'
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
     * Remove block from current set
     * @param block
     */
    $scope.removeBlock = function(block){
        confirmationBox($scope.translate('Are you sure?')).then(function(){
            $scope.set.blocks.splice($scope.set.blocks.indexOf(block), 1);
        });
    }

    /**
     * Select a set
     * @param theSet
     */
    $scope.selectSet = function(theSet){
        $scope.set = theSet;
        $scope.champion = theSet ? theSet.champion:null;
        $timeout(function(){$scope.$broadcast('update-scrollable');}, 250)
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
        var modal = $uibModal.open({
            size: 'xl',
            windowClass: 'ise-modal-add-set',
            templateUrl: 'app/template/modal-new-set.html?v=' + codeVersion,
            scope: $scope
        });

        modal.result.then($scope.addSet);

        return modal;
    }

    /**
     * Open the modal to import recommended items
     */
    $scope.openModalImportRecommended = function(){

        var scope = $scope.$new();
        scope.selectedSet = _.findWhere($scope.champions[$scope.set.champion].recommended, {map:'SR'});

        var modal = $uibModal.open({
//            windowClass: 'ise-modal-add-set',
            templateUrl: 'app/template/modal-import-recommended.html?v=' + codeVersion,
            scope: scope
        });

        modal.result.then(function(recommendedSet){
            if(recommendedSet){
                $scope.set.blocks = angular.copy(recommendedSet.blocks);
            }
        });

        return modal;
    }

    /**
     * Add a set for a champion
     * @param champion
     */
    $scope.addSet = function(champion){
        var theSet = angular.copy(defaultSet)

        theSet.champion = champion.id;
        if(champion.recommended){
            theSet.blocks = angular.copy(_.findWhere(champion.recommended, {map: 'SR', mode: 'CLASSIC'})).blocks;
        }
        $scope.sets.push(theSet);
        $scope.selectSet(theSet);
    }

    /**
     * Remove a set
     * @param champion
     */
    $scope.removeSet = function(theSet, noMessage){
        function remove(theSet){
            var isCurrentSet = $scope.set === theSet;
            var isMultipleSet = !!theSet.multipleId;

            //Remove the set
            var position = $scope.sets.indexOf(theSet)
            $scope.sets.splice(position, 1);

            //Remove the set from the list of multiples too
            if(isMultipleSet){
                $scope.multiSets[theSet.multipleId].splice($scope.multiSets[theSet.multipleId].indexOf(theSet), 1);

                //If it is the before last multiple set, convert to classic set
                if($scope.multiSets[theSet.multipleId].length === 1){
                    delete $scope.multiSets[theSet.multipleId][0].multipleId;
                    delete $scope.multiSets[theSet.multipleId];
                }
            }

            if(isCurrentSet){
                //We removed the current set, we must select a new set
                $scope.selectSet($scope.sets[Math.min(position, $scope.sets.length - 1)]);
            }
        }

        if(noMessage){
            //If no message, remove immediately
            remove(theSet);
        }
        else{
            //Otherwise ask before removal
            confirmationBox($scope.translate('Are you sure?')).then(function(){
                remove(theSet);
            });
        }
    }

    /**
     * Remove all sets from a champion
     * @param champion
     */
    $scope.removeSets = function(champion){
        var string = 'Are you sure you? This will delete ' + $scope.setsArray[champion].length + ' sets for '+ $scope.champions[champion].name +'.';
        confirmationBox(string).then(function(){
            _.each($scope.setsArray[champion], function(s){
                $scope.removeSet(s, true);
            })
        });
    }

    /**
     * Returns TRUE if item should be shown
     * @param item
     * @returns {boolean}
     */
    $scope.isShownItem = function(item){
        var f = $scope.filters;

        //Filter on map
        if($scope.set){
            var map = $scope.maps[$scope.set.map].code;
            if(map && ! item.maps[map]){
                return false;
            }
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

        //Filter on champion
        if(item.requiredChampion && $scope.set && $scope.set.champion != 'Global' && item.requiredChampion != $scope.set.champion){
            return false;
        }

        return true;
    }

    /**
     * Returns TRUE if items list is filtered
     * @returns {boolean|*}
     */
    $scope.isFilteredItemList = function(){
        return !!$scope.filters.string || _.chain($scope.filters.tags).map(function(value, key){return value ? key:null}).filter().value().length;
    }

    /**
     * Reset items list filters
     */
    $scope.resetFilters = function(){
        $scope.filters.string = '';
        $scope.filters.tags = {};
    }

    //Pass the translation method
    $scope.translate = ddTranslate.get;

    /**
     * Direct download one json
     */
    $scope.downloadJson = function(){
        //Prepare Set
        var theSet = angular.copy($scope.set);
        delete theSet.multipleId;

        //Download JSON
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(angular.toJson(theSet));
        var dlAnchorElem = angular.element('#jsonDownloader')[0];
        var filename = $scope.set.filename ? $scope.set.filename : $scope.set.champion  + ".json";
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", filename);
        dlAnchorElem.click();
    }

    /**
     * Duplicate a set (copy) to another champion
     */
    $scope.duplicateSet = function(){
        var currentSet = angular.copy($scope.set);
        delete currentSet.champion;
        delete currentSet.multipleId;
        var modal = $scope.openModalAddSet({
            title: 'Duplicate set:' + currentSet.title
        });
        return modal.result.then(function(){
            angular.extend($scope.set, currentSet);
        })
    }

    /**
     * Multiply Set: it will be shared with other champion(s)
     */
    $scope.multiplySet = function(){
        //Track the current set as multiple, if not already
        addMultiSet($scope.set);

        var multipliedSet = $scope.set;

        //Then trigger a classic duplication of the set
        $scope.duplicateSet().then(function(){
            //Store already exists
            var alreadyExists = _.findWhere($scope.multiSets[multipliedSet.multipleId], {champion: $scope.set.champion});

            //Set the multipleId (the new set is now the selected set)
            $scope.set.multipleId = multipliedSet.multipleId;

            //Track the new set as a multiset
            addMultiSet($scope.set);

            //If this champion is already multiplied for this set, remove the new set
            if(alreadyExists){
                $scope.removeSet($scope.set, true);
            }

            //Re-select our current set
            $scope.selectSet(multipliedSet);
        })
    }

    $scope.itemsPrice = function(items){
        var price = 0;
        items.forEach(function(item){
            price+= $scope.items[item.id].gold.total * item.count;
        })
        return price;
    }

    /**
     * Open the help/welcome screen
     */
    $scope.openModalHelp = function(){
        $uibModal.open({
            scope: $scope,
            backdrop: 'static',
            windowClass: 'ise-welcome',
            templateUrl: 'app/template/modal-first-visit.html?v=' + codeVersion
        }).result.then($scope.tour, function(){
            //No visit wanted
            localStorageService.set('tourDone', true);
        });
    }

    /**
     * Open the modal to share a set
     */
    $scope.openModalSharing = function(){
        //New scope
        var scope = $scope.$new();

        //Clear a copy of the set
        var keysToKeep = ['blocks','champion','map','title','mode'];
        var copy = angular.copy($scope.set);
        _.mapObject(copy, function(v, k){
            if(keysToKeep.indexOf(k) < 0){
                delete copy[k];
            }
        })

        //Compress set
        scope.sharingId = btoa(angular.toJson(copy));

        //URL
        scope.url = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + '#!' + $location.path() + '?s=';

        //Length of the final URL
        scope.warningBigSet = (scope.sharingId + scope.url).length > 2000;

        $uibModal.open({
            scope: scope,
            windowClass: 'ise-welcome',
            templateUrl: 'app/template/modal-sharing.html?v=' + codeVersion
        });
    }

    /**
     * Save to local storage
     */
    $scope.saveSetsToLocalStorage = function(){
        localStorageService.set('sets', $scope.sets);
    }

    /**
     * Start the tour
     */
    $scope.tour = function(){
        function get(value){return angular.element('[intro="'+value+'"]')[0]}
        function onExit(){
            if(placeholderSet){
                $scope.sets = [];
                $scope.$apply();
            }
        }

        var intro = introJs();

        //If we need to open a placeholder, do it
        var placeholderSet = false;
        if( ! $scope.sets.length){
            placeholderSet = true;
            $scope.addSet($scope.championsArray[0]);
        }

        intro.addSteps([
            {
                element: get('upload'),
                intro: 'You can drag & drop your <code>.../League of Legends/Config/</code> folder in this window to load your existing sets in one go!<br/><br/>Alternatively, you can upload your sets as <b>.json</b> files by clicking the "Upload" button.<br/><br/>You can also import builds from website like mobafire, lolalytics or lolking.',
                position: 'right'
            },
            {
                element: get('downloader'),
                intro: 'When you are done, use this button to download all your sets in one click.<br/><br/>You can then extract the zip archive and use it to replace your <code>.../League of Legends/Config/</code> folder.',
                position: 'right'
            },
            {
                element: get('new-set'),
                intro: 'Add sets by clicking on this button.',
                position: 'right'
            },
            {
                element: get('champions'),
                intro: 'Navigate through your sets using this list.',
                position: 'right'
            },
            {
                element: get('set-info'),
                intro: 'The current set your are working on is displayed here.',
                position: 'left'
            },
            {
                element: get('set-new-block'),
                intro: 'Add blocks to your set using this button.',
                position: 'left'
            },
            {
                element: get('set-blocks'),
                intro: 'Your current set\'s blocks are displayed here. You can rename them and reorder items inside them.',
                position: 'left'
            },
            {
                element: get('set-advanced'),
                intro: 'This button can be used to perform advanced action on your set. You can ignore it if you want to keep it simple.',
                position: 'left'
            },
            {
                element: get('items'),
                intro: 'Look for items here. Simply drag & drop them in your blocks to add them to your set.<br/>You can use the filters at the top to reduce the list and look for specific items.',
                position: 'right'
            },
            {
                element: get('navbar'),
                intro: 'Report bugs using the <i class="fa fa-bug"></i> button.<br/>You can also switch language for champions & items here.<br/>Finally, you can launch this tour again using the Help button.',
                position: 'left'
            },
        ])

        intro.setOptions({
            showStepNumbers: false
        })

        intro.onexit(onExit);
        intro.oncomplete(function(){
            onExit();
            localStorageService.set('tourDone', true);
        });

        intro.start();
    }

    /**
     * Open changelog
     */
    $scope.openModalVersion = function(){
        $uibModal.open({
            scope: $scope,
            windowClass: 'ise-welcome',
            templateUrl: 'app/template/modal-version.html?v=' + codeVersion
        });
    }

    /**
     * **************************************************************************************
     * WATCHES
     */
    $scope.$watchCollection('sets', function(){
        $scope.setsArray = _.groupBy($scope.sets, 'champion');
        if( ! $scope.sets.length){
            $scope.selectSet(null);
        }
        else if($scope.sets.indexOf($scope.set) < 0){
            //If the current set is no longer in the list of sets
            $scope.selectSet($scope.sets[0]);
        }
        $scope.saveSetsToLocalStorage();
    });

    $scope.$watch('set', function(){
        if($scope.set){
            if($scope.set.multipleId){
                //Propagate to other multiple sets of same id
                var copy = angular.copy($scope.set);
                delete copy.champion;
                _.each($scope.multiSets[$scope.set.multipleId], function(s){
                    if($scope.set != s){
                        angular.extend(s, copy);
                    }
                })
            }
            $scope.saveSetsToLocalStorage();
        }
    }, true);

    //When adding a Set select it
    $scope.$on('added-set', function(e, s){
        $scope.selectSet(s);
    });

    /**
     * **************************************************************************************
     * BOOTSTRAP
     */
    if( ! localStorageService.get('tourDone')){
        $scope.openModalHelp();
    }
    else if (localStorageService.get('latestVersionSeen') != codeVersion){
        $scope.openModalVersion();
    }
    //In every case, store latest code version seen
    localStorageService.set('latestVersionSeen', codeVersion);

    //Shared set
    if($location.search().s){
        var theSet = angular.extend(angular.copy(defaultSet), JSON.parse(atob($location.search().s)));

        //Check that no set exists with the same champion & title
        if( ! _.findWhere($scope.sets, {title: theSet.title, champion: theSet.champion})){
            $scope.sets.push(theSet);
            $scope.selectSet(theSet);
        }
    }
}]);