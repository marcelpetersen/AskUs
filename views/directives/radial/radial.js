angular.module('myApp.radialDirective', [])

.directive('radial', function () {
  return {
    restrict: 'E',
    // replace: 'true',
    scope: {
      percentage: '='
    },
    templateUrl:'templates/radial.html'
    // template:'<div>{{percentage}}</div>'
    // link: function(scope, element, attrs){
    //   console.log('test', scope.myindex)
    // }
  };
})