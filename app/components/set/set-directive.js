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

            //Watch dropping files
            scope.$watch('files', function () {
                if(scope.files.length){
                    readFiles(scope.files);
                }
            });

            /**
             * **************************************************************************************
             * LOCAL METHODS
             */
            //Read the files & generate the sets
            function readFiles(files){
                //Clear current set
                scope.sets.splice(0, scope.sets.length);
                interfaceHide();

                files.forEach(function(file){
                    var reader = new FileReader;
                    reader.onload = function(e){
                        var theSet = JSON.parse(e.target.result);
                        theSet.filepath = file.path;
                        scope.sets.push(theSet);
                    }
                    reader.readAsText(file);
                })
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
}]);
