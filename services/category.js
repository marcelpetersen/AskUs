angular.module('myApp.categoriesService', [])

.factory('Categories', ['$rootScope', 'FirebaseUrl', function($rootScope, FirebaseUrl) {

  return {
    getCategoriesList: function() {
      return [
        {
          name: "animals",
          icon: "ion-ios-paw"
        },
        {
          name: "art",
          icon: "ion-paintbrush"
        },
        {
          name: "fashion",
          icon: "ion-tshirt"
        },
        {
          name: "food",
          icon: "ion-icecream"
        },
        {
          name: "nature",
          icon: "ion-ios-flower"
        },
        {
          name: "people",
          icon: "ion-person"
        },
        {
          name: "sport",
          icon: "ion-ios-basketball"
        },
        {
          name: "travel",
          icon: "ion-android-plane"
        },
        {
          name: "vehicule",
          icon: "ion-model-s"
        }
      ]}
    }

  }]);