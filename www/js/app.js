// Scouting App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers', 'firebase'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function($scope, $rootScope) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });

  $rootScope.uploaded = "";

})

// defining states of different views, and creating the reference to its .html file and URL

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('splash', {
            url: '/splash',
            templateUrl: 'templates/splash.html',
            controller: 'SplashCtrl'
        })

        $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'templates/list.html',
            controller: 'ListCtrl'
        })

        $stateProvider
          .state('filter', {
            url: '/filter',
            templateUrl: 'templates/filter.html',
            controller: 'FilterCtrl'
          })

        $stateProvider
          .state('search', {
            url: '/search',
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
        })



    // defaults URL/state to the splash screen (first screen)

    $urlRouterProvider.otherwise('/splash');
});
