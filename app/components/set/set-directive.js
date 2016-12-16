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
            var mustHaveKeys = ['champion', 'type', 'map', 'mode', 'blocks'];

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
                if(position < files.length){
                    var reader = new FileReader;
                    reader.onload = function(e){
                        try{
                            var s = JSON.parse(e.target.result);
                            if(_.chain(s).keys().intersection(mustHaveKeys).value().length === mustHaveKeys.length){
                                sets.push(s);
                            }
                        } catch(e){
                            //Probably wrong JSON format, or not a json file
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
            sets: '='
        },
        templateUrl: 'app/template/directive-set-dropper.html'
    }
}])
.directive('setDownloader', ['$window', function($window) {
    return {
        link: function(scope, elmt){
            /**
             * **************************************************************************************
             * SCOPE VARS
             */
            scope.download = function(){
                var zip = new JSZip;
                var champions = {};

                //Add each set to the zip
                scope.sets.forEach(function(s){
                    var champ = s.champion ? s.champion:'Global';
                    var root = s.champion ? 'Config/Champions/' + champ + '/Recommended/' : 'Config/Global/Recommended/';
                    champions[champ] = typeof champions[champ] == 'undefined' ? 0:champions[champ]+1;
                    var path = root + champ + champions[champ] + '.json';
                    zip.file(path, angular.toJson(s));
                })

                //Add a small readme in the .zip
                zip.file('readme.txt', 'Use this folder to replace the Config/ folder in your League of Legends installation, usually located at %PROGRAMFILES%/Riot Games/League of Legends/')

                //Send the zipped file
                zip.generateAsync({type:"blob"})
                    .then(function (blob) {
                        saveAs(blob, "Lol_Item_Set.zip");
                });
            }

        },
        restrict: 'E',
        scope: {
            sets: '='
        },
        template: '<div class="btn btn-success btn-block" ng-click="download()">Download</div>'
    }
}]);
