import angular from 'angular';

import fileUploadModule from 'ng-file-upload';
import uibModule from 'angular-bootstrap';

export default 'appLolIse.set';
angular.module('appLolIse.set', [fileUploadModule, uibModule])

.directive('setDropper', ['$window', '$timeout', '$uibModal', '$q', function($window, $timeout, $uibModal, $q) {

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
            scope.interface = {show: false};
            var sets = [];
            var mustHaveKeys = ['type', 'map', 'mode', 'blocks', 'champion'];
            var modal;

            //Watch dropping files
            scope.$watch('uploaded.files', function (files) {
                if(files.length){
                    sets = [];
                    if(files.length == 1 && files[0].name.slice(-4) == '.zip'){
                        readZip(files[0]);
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
                    size: 'xl',
                    windowClass: 'ise-modal-upload',
                    templateUrl: 'app/set/modal-upload.html'
                });
            };

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
                    if( ! s.champion){
                        for(var i=0; i<scope.champions.length; i++){
                            if(
                                file.name.indexOf(scope.champions[i])>=0
                                    || file.path && file.path.indexOf(scope.champions[i])>=0
                                ){
                                s.champion = scope.champions[i];
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
                sets.forEach(function(s){
                    scope.sets.push(s);
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

            /**
             * **************************************************************************************
             * BOOTSTRAP
             */
            $timeout(interfaceHide);

        },
        restrict: 'E',
        scope: {
            sets: '=',
            champions: '='
        },
        templateUrl: 'app/set/set-dropper.html'
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
                var pathes = [];
                scope.sets.forEach(function(s){
                    var champ = s.champion ? s.champion:'Global';
                    var root = s.champion && s.champion!='Global' ? 'Config/Champions/' + champ + '/Recommended/' : 'Config/Global/Recommended/';

                    //Count files per champs
                    champions[champ] = typeof champions[champ] == 'undefined' ? 0:champions[champ]+1;

                    //Define filename
                    var filename = s.filename ? s.filename : champ + champions[champ] + '.json';
                    var path = root + filename;

                    //Rename if filename already present
                    if(pathes.indexOf(path)>=0){
                        path = root + champ + 'duplicate_' + filename;
                    }
                    zip.file(path, angular.toJson(s));
                    pathes.push(path);
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
                                templateUrl: 'app/set/modal-download.html'
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
            sets: '='
        },
        template: '<div intro="downloader" class="btn btn-success btn-block" ng-click="download()"><i class="fa fa-download"></i>&nbsp;Download</div>'
    }
}]);
