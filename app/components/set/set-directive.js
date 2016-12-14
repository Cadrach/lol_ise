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

            //Watch dropping files
            scope.$watch('files', function () {
                if(scope.files.length){
                    sets = [];
                    readFiles(scope.files, 0);
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
                        sets.push(JSON.parse(e.target.result));
                        readFiles(files, position+1);
                    }
                    console.log('read files');
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