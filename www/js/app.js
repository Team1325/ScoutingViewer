// Scouting App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers'])

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
      .state('menu', {
        url: '/menu',
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
      })

    $stateProvider
      .state('list', {
        url: '/list',
        templateUrl: 'templates/list.html',
        controller: 'ListCtrl'
      })

    $stateProvider
      .state('statistics', {
        url: '/statistics',
        templateUrl: 'templates/statistics.html',
        controller: 'StatisticsCtrl'
      })

    $stateProvider
      .state('rankings', {
        url: '/rankings',
        templateUrl: 'templates/rankings.html',
        controller: 'RankingsCtrl'
      })

    $stateProvider
      .state('table', {
        url: '/table',
        templateUrl: 'templates/table.html',
        controller: 'TableCtrl'
      })

    $stateProvider
      .state('alliance', {
        url: '/alliance',
        templateUrl: 'templates/alliance.html',
        controller: 'AllianceCtrl'
      })



    // defaults URL/state to the splash screen (first screen)

    $urlRouterProvider.otherwise('/splash');
})
