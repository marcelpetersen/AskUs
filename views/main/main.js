angular.module('myApp.mainController', [])

.controller('MainCtrl', ['$scope', 'Categories', function($scope, Categories) {
  $scope.categoriesList = Categories.getCategoriesList();
}]);