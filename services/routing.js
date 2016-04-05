angular.module('myApp.routingService', [])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Splash Screen & Login
  .state('splash', {
    authRequired: false,
    templateUrl: 'templates/splash.html',
    url: '/splash',
    controller: 'splashCtrl'
  })

  // How to use the app and welcome
  .state('how-to-use', {
    authRequired: true,
    templateUrl: 'templates/how-to-use.html',
    url: '/how-to-use',
    controller: 'howToUseCtrl'
  })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    cache:true,
    authRequired: true,
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.dash-filter', {
    cache:true,
    authRequired: true,
    url: '/dash/filter/:filter',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash-filter.html',
        controller: 'DashFilterCtrl'
      }
    }
  })

  .state('tab.add', {
    cache: false,
    authRequired: false,
    url: '/add',
    views: {
      'tab-add': {
        templateUrl: 'templates/tab-add.html',
        controller: 'addCtrl'
      }
    }
  })

    .state('tab.friends', {
      cache: true,
      authRequired: true,
      url: '/friends',
      views:{
        'tab-friends' : {
          templateUrl: 'templates/friends.html',
          controller: 'friendsCtrl'
        }
      }
    })


  .state('tab.friend-page', {
      cache: true,
      authRequired: true,
      url: '/friends/user/:userId/:parentCat',
      views: {
        'tab-friends': {
          templateUrl: 'templates/user-page.html',
          controller: 'userPageCtrl'
        }
      }
    })

    .state('tab.user-page', {
      cache: true,
      authRequired: true,
      url: '/dash/user/:userId/:parentCat',
      views: {
        'tab-dash': {
          templateUrl: 'templates/user-page.html',
          controller: 'userPageCtrl'
        }
      }
    })

    .state('tab.user-account-page', {
      cache: true,
      authRequired: true,
      url: '/account/user/:userId/:parentCat',
      views: {
        'tab-account': {
          templateUrl: 'templates/user-page.html',
          controller: 'userPageCtrl'
        }
      }
    })

    .state('tab.account-post-page', {
      cache: false,
      authRequired: true,
      url: '/account/post/:postId/:parentCat',
      views: {
        'tab-account': {
          templateUrl: 'templates/post-page.html',
          controller: 'postCtrl'
        }
      }
    })

    .state('tab.dash-post-page', {
      cache: false,
      authRequired: true,
      url: '/dash/post/:postId/:parentCat',
      views: {
        'tab-dash': {
          templateUrl: 'templates/post-page.html',
          controller: 'postCtrl'
        }
      }
    })

    .state('tab.friend-post-page', {
      cache: false,
      authRequired: true,
      url: '/friends/post/:postId/:parentCat',
      views: {
        'tab-friends': {
          templateUrl: 'templates/post-page.html',
          controller: 'postCtrl'
        }
      }
    })

  .state('tab.account', {
    cache:true,
    authRequired: true,
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.my-votes', {
    cache:true,
    authRequired: true,
    url: '/account/my-votes/:userId/:parentCat',
    views: {
      'tab-account': {
        templateUrl: 'templates/my-votes.html',
        controller: 'myVotesCtrl'
      }
    }
  })

  .state('tab.preferences', {
    authRequired: true,
    url: '/preferences',
    views: {
      'tab-account': {
        templateUrl: 'templates/preferences.html',
        controller: 'preferencesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

}]);
