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

angular.module('appLolIse.set.set-directive', ['ngFileUpload'])
.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}])
.directive('setDropper', ['$window', '$timeout', '$uibModal', '$q', '$http', function($window, $timeout, $uibModal, $q, $http) {

    return {
        link: function(scope, elmt){

            /**
             * **************************************************************************************
             * SCOPE VARS
             */
            //Default files list
            scope.uploaded = {
                files: []
            };
            scope.interface = {
                show: false,
                method: 1,
                websiteUrl: ''
            };
            var sets = [];
            var mustHaveKeys = ['type', 'map', 'mode', 'blocks', 'champion'];
            var modal;
            var championsNames = _.keys(scope.champions);
            
            //Watch dropping files
            scope.$watch('uploaded.files', function (files) {
                if(files.length){
                    sets = [];
                    if(files.length == 1 && files[0].name.slice(-4) == '.zip'){
                        readZip(files[0]);
                    }
                    else if(files.length > 2000){
                        var modalScope = scope.$new();
                        modalScope.content = "You are about to upload " + files.length + " files. Are you sure you want to proceed?";
                        var modal = $uibModal.open({
                            size: 'xs',
                            windowClass: 'ise-modal-confirm',
                            templateUrl: 'app/template/modal-confirm.html?v=' + codeVersion,
                            scope: modalScope
                        });

                        modal.result.then(function(){
                            //If OK
                            readFiles(files, 0);
                        }, function(){
                            //If not OK
                            interfaceHide();
                        });
                    }
                    else{
                        readFiles(files, 0);
                    }
                }
                else{
                    //If no files provided hide drop zone
                    interfaceHide();
                }
            });

            //Open modal on button click
            scope.openModal = function(){
                modal = $uibModal.open({
                    scope: scope,
                    size: 'lg',
                    windowClass: 'ise-modal-upload',
                    templateUrl: 'app/template/modal-upload.html?v=' + codeVersion
                });
            };

            /**
             * Import found Sets
             */
            scope.importWebSets = function(){

                var defaultSet = {
                    map: 'any',
                    mode: 'any',
                    type: 'custom',
                    priority: false,
                    sortrank: null
                };

                scope.websiteImport.sets.forEach(function(s){
                    //We remove the previous set of the same name, if any
                    var existing = _.findWhere(scope.sets, {filename: s.filename});
                    if(existing){
                        scope.sets.splice(scope.sets.indexOf(existing), 1);
                    }
                    var newSet = angular.extend(angular.copy(defaultSet), s);
                    scope.sets.push(newSet);
                    scope.$emit('added-set', newSet);
                });

                //Hide interface
                $timeout(interfaceHide)
            }

            /**
             * **************************************************************************************
             * LOCAL METHODS
             */
            /**
             * Read a zip file
             * @param file
             */
            function readZip(file){
                var zip = new JSZip();

                //Load the zip file
                zip.loadAsync(file)
                    .then(function(zipContent) {
                        //Now we have the list of content, extract only files
                        var files = _.chain(zipContent.files).filter(function(f){return !f.dir}).value();

                        //Read each file, and aggregate the promise for each
                        var promises = files.map(function(zippedFile){
                            return zip.file(zippedFile.name).async("string").then(function(content){
                                integrateFile(content, {name: zippedFile.name, path: zippedFile.name});
                            });
                        })

                        //Once all promises are done, apply the parsed set to our external scope
                        $q.all(promises).then(applySets);
                    });
            }

            /**
             * Read the files & generate the sets
             * @param files
             * @param position
             */
            function readFiles(files, position){
                //Clear current set
                var file = files[position];

                //If we still have file to read, read them
                if(position < files.length){
                    var reader = new FileReader;
                    reader.onload = function(e){
                        integrateFile(e.target.result, file);
                        readFiles(files, position+1);
                    }
                    reader.readAsText(files[position]);
                }
                else{
                    //All files read, fill the sets object with all our new sets
                    applySets();
                }
            }

            /**
             * Integrate a file into the tool
             * @param jsonString
             * @param file
             */
            function integrateFile(jsonString, file){
                try{
                    //The JSON
                    var s = JSON.parse(jsonString);

                    //Try to findout which champion we are working on, if not provided
                    if( ! s.champion && s.type == 'global'){
                        s.champion = 'Global';
                    }
                    if( ! s.champion){
                        for(var i=0; i<championsNames.length; i++){
                            if(
                                file.name.indexOf(championsNames[i])>=0
                                    || file.path && file.path.indexOf(championsNames[i])>=0
                                ){
                                s.champion = championsNames[i];
                                break;
                            }
                        }
                    }
                    if(_.chain(s).keys().intersection(mustHaveKeys).value().length === mustHaveKeys.length){
                        s.filename = file.name;
                        sets.push(s);
                    }
                    else{
                        //We are missing a required key to use the provided file
                        console.error("Wrong format, missing: " + _.difference(mustHaveKeys, _.keys(s)).join(','));
                    }
                } catch(e){
                    //Probably wrong JSON format, or not a json file
                    console.error("Wrong file: " + file.name);
                }
            }

            /**
             * Apply our directive sets to the external scope
             */
            function applySets(){
                scope.sets.splice(0, scope.sets.length);
                scope.multiSets = {};

                sets.forEach(function(s){
                    scope.sets.push(s);

                    //If tagged as multi set, create the multiplicity
                    if(s.multipleId){
                        if( ! scope.multiSets[s.multipleId]){
                            scope.multiSets[s.multipleId] = [];
                        }
                        scope.multiSets[s.multipleId].push(s);
                    }
                })

                //Hide interface
                $timeout(interfaceHide)

                //Apply to force digest
//                try{scope.$apply()}catch(e){};
            }

            //Hide interface
            function interfaceShow(){
                elmt.find('[ngf-drop]').css('visibility', '');
                elmt.find('[ngf-drop]').css('opacity', 1);
            }

            //Show interface
            function interfaceHide(){
                elmt.find('[ngf-drop]').css('visibility', 'hidden');
                elmt.find('[ngf-drop]').css('opacity', 0);

                if(modal){
                    modal.close();
                    modal = null;
                }
            }

            /**
             * **************************************************************************************
             * WATCHES & EVENTS
             */
            //Show/hide dropzone when dragging inside window
            var lastTarget = null;
            $window.addEventListener("dragenter", function(e)
            {
                lastTarget = e.target;
                interfaceShow();
            });
            $window.addEventListener("dragleave", function(e)
            {
                if(e.target === lastTarget)
                {
                    interfaceHide();
                }
            });

            //Perform search when modifying the URL
            scope.$watch('interface.websiteUrl', function(buildUrl){
                var buildId = null;
                var loadUrl = null;
                scope.interface.websiteUrlError = false;
                scope.websiteImport = {};

                if(buildUrl){
                    //Find out which website
                    if(buildUrl.indexOf('mobafire')>=0){
                        buildId = buildUrl.split('-').pop();
                        loadUrl = 'source/cors_mobafire.php?id=' + buildId;
                    }
                    else if(buildUrl.indexOf('lolking')>=0){
                        buildId = buildUrl.split('/').pop();
                        loadUrl = 'source/cors_lolking.php?id=' + buildId;
                    }
                    else if(buildUrl.indexOf('lolalytics')>=0){
                        buildId = buildUrl.split('/').filter(function(a){return !!a;}).pop();
                        loadUrl = 'source/cors_lolalytics.php?id=' + buildId;
                    }
                    else{
                        scope.interface.websiteUrlError = true;
                    }
                }

                //Load URL, if any
                if(loadUrl){
                    $http.get(loadUrl).success(function(result){
                        scope.websiteImport = result;
                        if( ! result.sets || ! result.sets.length){
                            scope.interface.websiteUrlError = true;
                        }
                    })
                }
            })

            /**
             * **************************************************************************************
             * BOOTSTRAP
             */
            $timeout(interfaceHide);

        },
        restrict: 'E',
        scope: {
            sets: '=',
            multiSets: '=',
            champions: '='
        },
        templateUrl: 'app/template/directive-set-dropper.html?v=' + codeVersion
    }
}])
.directive('setDownloader', ['$window', '$uibModal', '$timeout', function($window, $uibModal, $timeout) {
    return {
        link: function(scope, elmt){
            /**
             * **************************************************************************************
             * SCOPE VARS
             */
            scope.download = function(){
                var zip = new JSZip;
                var champions = {};

                //Request account if none provided
                if( ! scope.account || ! scope.account.accountId){
                    scope.onNoAccount();
                    return;
                }

                //Must have at least one set to download
                if( ! scope.sets.length){
                    alert('Nothing to download!');
                    return;
                }

                //Add each set to the zip
                var multipleIdsTreated = [];
                var fullfile = {itemSets: []};
                var pathes = [];
                scope.sets.forEach(function(s){
                    var champ = s.champion ? s.champion:'Global';
                    var root = s.champion && s.champion!='Global' ? 'Config/Champions/' + champ + '/Recommended/' : 'Config/Global/Recommended/';

                    //Count files per champs
                    champions[champ] = typeof champions[champ] == 'undefined' ? 0:champions[champ]+1;

                    //Define filename
                    var filename = s.filename ? s.filename : champ + champions[champ] + '.json';
                    var path = root + filename.split('/').pop(); //always remove all folder parts from the filename

                    //Rename if filename already present
                    if(pathes.indexOf(path)>=0){
                        path = root + champ + 'duplicate_' + filename;
                    }
                    zip.file(path, angular.toJson(s));
                    pathes.push(path);

                    /**
                     * ***********************************
                     * Now work on the FULL file
                     */
                    //Keys
                    var champKeys = [];
                    if(scope.champions[champ] && scope.champions[champ].key){
                        champKeys.push(Number(scope.champions[champ].key));
                    }
                    var setForFullFile = angular.extend(angular.copy(s), {
                        associatedChampions: champKeys
                    });
                    fullfile.itemSets.push(setForFullFile);
                })

                //Add a small readme in the .zip
                zip.file('readme.txt', 'Downloaded from http://lol.item-set.com\nUse this folder to replace the Config/ folder in your League of Legends installation, usually located at %PROGRAMFILES%/Riot Games/League of Legends/')
                //Add ItemSets.json file
                zip.file('ItemSets.json', JSON.stringify(fullfile));

                //Send the zipped file
                var filename = "Lol_Item_Set.zip";
                console.log(bowser);
                if(bowser.chrome || bowser.opera || bowser.firefox || bowser.vivaldi){
                    //For Chrome it works nicely
                    zip.generateAsync({type:"blob"}).then(function(blob){saveAs(blob, filename);});
                }
                else{
                    //For the rest, a bit more work
                    zip.generateAsync({type:"base64"})
                        .then(function (blob) {
                            var modal = $uibModal.open({
                                templateUrl: 'app/template/modal-download.html?v=' + codeVersion
                            });
                            modal.opened.then(function(){
                                $timeout(function(){
                                    angular.element('#downloadify').downloadify({
                                        swf: 'bower/downloadify/media/downloadify.swf',
                                        downloadImage: 'bower/downloadify/images/download.png',
                                        width: 175,
                                        height: 30,
                                        filename: filename,
                                        data: function(){
                                            return blob
                                        },
                                        dataType: 'base64'
                                    });

                                })
                            })
                        });
                }

            }

        },
        restrict: 'E',
        scope: {
            sets: '=',
            multiSets: '=',
            champions: '=',
            account: '=',
            onNoAccount: '&'
        },
        template: '<div intro="downloader" class="btn btn-success btn-block" ng-click="download()"><i class="fa fa-download"></i>&nbsp;Download</div>'
    }
}]);
