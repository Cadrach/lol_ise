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

.directive('setDropper', ['$window', function($window) {

    return {
        link: function(scope, elmt){

            /**
             * **************************************************************************************
             * SCOPE VARS
             */
            //Default files list
            scope.files = [];
            scope.interface = {show: false};
            var sets = [];
            var mustHaveKeys = ['type', 'map', 'mode', 'blocks'];

            //Watch dropping files
            scope.$watch('files', function () {
                if(scope.files.length){
                    sets = [];
                    readFiles(scope.files, 0);
                }
                else{
                    //If no files provided hide drop zone
                    interfaceHide();
                }
            });

            /**
             * **************************************************************************************
             * LOCAL METHODS
             */
            //Read the files & generate the sets
            function readFiles(files, position){
                //Clear current set
                var file = files[position];
                if(position < files.length){
                    var reader = new FileReader;
                    reader.onload = function(e){
                        try{
                            //The JSON
                            var s = JSON.parse(e.target.result);

                            //Try to findout which champion we are working on, if not provided
                            if( ! s.champion){
                                for(var i=0; i<scope.champions.length; i++){
                                    if(file.path.indexOf(scope.champions[i])>=0){
                                        s.champion = scope.champions[i];
                                        break;
                                    }
                                }
                            }
                            if(_.chain(s).keys().intersection(mustHaveKeys).value().length === mustHaveKeys.length){
                                sets.push(s);
                            }
                            else{
                                console.error("Wrong format, missing: " + _.difference(mustHaveKeys, _.keys(s)).join(','));
                            }
                        } catch(e){
                            //Probably wrong JSON format, or not a json file
                            console.error("Wrong file: " + e);
                        }
                        readFiles(files, position+1);
                    }
                    reader.readAsText(files[position]);
                }
                else{
                    //Fill new set
                    scope.sets.splice(0, scope.sets.length);
                    sets.forEach(function(s){
                        scope.sets.push(s);
                    })

                    //Hide interface
                    interfaceHide();

                    //Apply to force digest
                    scope.$apply();
                }
            }

            //Hide interface
            function interfaceShow(){
                elmt.css('visibility', '');
                elmt.css('opacity', 1);
            }

            //Show interface
            function interfaceHide(){
                elmt.css('visibility', 'hidden');
                elmt.css('opacity', 0);
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

            /**
             * **************************************************************************************
             * BOOTSTRAP
             */
            interfaceHide();

        },
        restrict: 'E',
        scope: {
            sets: '=',
            champions: '='
        },
        templateUrl: 'app/template/directive-set-dropper.html'
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

                if( ! scope.sets.length){
                    alert('Nothing to download!');
                    return;
                }

                //Add each set to the zip
                scope.sets.forEach(function(s){
                    var champ = s.champion ? s.champion:'Global';
                    var root = s.champion ? 'Config/Champions/' + champ + '/Recommended/' : 'Config/Global/Recommended/';
                    champions[champ] = typeof champions[champ] == 'undefined' ? 0:champions[champ]+1;
                    var path = root + champ + champions[champ] + '.json';
                    zip.file(path, angular.toJson(s));
                })

                //Add a small readme in the .zip
                zip.file('readme.txt', 'Downloaded from http://lol.item-set.com\nUse this folder to replace the Config/ folder in your League of Legends installation, usually located at %PROGRAMFILES%/Riot Games/League of Legends/')

                //Send the zipped file
                var filename = "Lol_Item_Set.zip";
                if(bowser.chrome){
                    //For Chrome it works nicely
                    zip.generateAsync({type:"blob"}).then(function(blob){saveAs(blob, filename);});
                }
                else{
                    //For the rest, a bit more work
                    zip.generateAsync({type:"base64"})
                        .then(function (blob) {
                            var modal = $uibModal.open({
                                templateUrl: 'app/template/modal-download.html'
                            });
                            modal.opened.then(function(){
                                console.log('DDDD');
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
            sets: '='
        },
        template: '<div intro="downloader" class="btn btn-success btn-block" ng-click="download()"><i class="fa fa-download"></i>&nbsp;Download</div>'
    }
}]);
