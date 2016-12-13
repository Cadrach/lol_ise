'use strict';

angular.module('appLolIse.set.set-directive', ['ngFileUpload'])

.directive('setDropper', [function() {

    return {
        link: function(scope, elmt){
            //Default files list
            scope.files = [];

            //Watch dropping files
            scope.$watch('files', function () {
                if(scope.files.length){
                    readFiles(scope.files);
                }
            });

            //Read the files & generate the sets
            function readFiles(files){
                //Clear current set
                scope.sets.splice(0, scope.sets.length);

                files.forEach(function(file){
                    var reader = new FileReader;
                    reader.onload = function(e){
                        scope.sets.push(JSON.parse(e.target.result));
                    }
                    reader.readAsText(file);
                })
            }
        },
        restrict: 'E',
        scope: {
            sets: '='
        },
        templateUrl: 'app/template/directive-set-dropper.html'
    }
}]);
