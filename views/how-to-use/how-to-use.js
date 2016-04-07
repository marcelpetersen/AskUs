angular.module('AskUs.howToUsePage', [])

.controller('howToUseCtrl', ['$scope', '$ionicSlideBoxDelegate', '$ionicNavBarDelegate', function($scope, $ionicSlideBoxDelegate, $ionicNavBarDelegate) {
  $ionicNavBarDelegate.showBackButton(false);
}]);
