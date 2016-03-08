angular.module('starter.controllers', ['ionic'])

.controller('SplashCtrl', ['$scope', '$state', '$rootScope', '$http', '$interval', function($scope, $state, $rootScope, $http, $interval) {

  $rootScope.pull = [];

  $scope.showButton = true;

  $scope.pulling = "Pulling data from scouting server";

  $rootScope.pullInterval = $interval(function(){

    if ($scope.pulling == "Pulling data from scouting server...")
    {
      $scope.pulling = "Pulling data from scouting server";
    }
    else
    {
      $scope.pulling += ".";
    }

  },500,0);

  $scope.next = function() {

    $scope.showButton = false;

    console.log("Processing - Received Action");
    console.log("Processing - Pulling Data");

    $http.get("http://scoutingserver.herokuapp.com/api/matches")

      .success(function(data) {

          console.log("Processing - Data Pulled");
          console.log("Processing - Processing Data");

          $rootScope.pull = data;

          for (i = 0; i < $rootScope.pull.length; i++) {

            if ($rootScope.pull[i].teleop)
            {
              $rootScope.pull[i].teleop = JSON.parse($rootScope.pull[i].teleop);
            }
            if ($rootScope.pull[i].auto)
            {
              $rootScope.pull[i].auto = JSON.parse($rootScope.pull[i].auto);
            }

            $rootScope.pull[i].teleop.cycleTime /= 100;

          }

          console.log("Process Complete!");

          $scope.showButton = true;

          $state.go('menu');

        });

      //

  }

}])

.controller('MenuCtrl', ['$scope', '$state', '$rootScope', '$http', '$interval', function($scope, $state, $rootScope, $http, $interval) {

  $scope.list = function(){
    $state.go('list');
  }

  $scope.ranks = function(){
    $state.go('rankings');
  }

  $scope.stats = function(){
    $state.go('statistics');
  }

  $scope.table = function(){
    $state.go('table');
  }

  $scope.reload = function(){
    $state.go('splash');
  }

}])

.controller('ListCtrl', ['$scope', '$state', '$http', '$rootScope', '$filter', function($scope, $state, $http, $rootScope, $filter) {

    $scope.filterType = "View All";
    $scope.orderType = "Match Number";
    $scope.matches = [];
    $scope.refreshed = false;
    $rootScope.filter = "";
    $rootScope.filterType = "";
    $rootScope.orderType = "";
    $rootScope.reverse = false;
    $scope.reverseOrder = false;


    $scope.viewRobotStart = true;
    $scope.viewScouter = true;

    $scope.viewAuto = true;
    $scope.viewAutoBalls = true;
    $scope.viewAutoDefenses = true;
    $scope.viewAutoNotes = true;

    $scope.viewTeleop = true;
    $scope.viewTeleopBalls = true;
    $scope.viewTeleopDefenses = true;
    $scope.viewTeleopNotes = true;

    $scope.viewTeleopTotalDamage = true;
    $scope.viewTeleopCycleTime = true;
    $scope.viewTeleopTowerAttack = true;

    $scope.viewTotalScore = true;

    $scope.menu = function() {
      $state.go('menu');
    }

    $scope.newFilter = function(filterVar,filterSelection,orderSelection,reverseOrder){

      $rootScope.filter = filterVar;
      $rootScope.filterType = filterSelection;

      $rootScope.orderType = orderSelection;

      console.log("Filtering By: " + $rootScope.filterType);
      console.log("Filter: " + $rootScope.filter);

      console.log("Ordering By: " + $rootScope.orderType);
      console.log("Reverse: " + reverseOrder);

          $scope.matches = [];
          $scope.orderedMatches = [];

          console.log("Number of Entries: " + $rootScope.pull.length);

          for (i = 0; i < $rootScope.pull.length; i++) {

            if ($rootScope.filterType == "Team Number")
            {
              if ($rootScope.pull[i].team == $rootScope.filter)
              {
                $scope.matches.push($rootScope.pull[i]);
              }
            }
            else if ($rootScope.filterType == "Scouter")
            {
              if ($rootScope.pull[i].scouter == $rootScope.filter)
              {
                $scope.matches.push($rootScope.pull[i]);
              }
            }
            else if ($rootScope.filterType == "Match Number")
            {
              if ($rootScope.pull[i].number == $rootScope.filter)
              {
                $scope.matches.push($rootScope.pull[i]);
              }
            }
            else if ($rootScope.filterType == "Robot Start")
            {
              if ($rootScope.pull[i].botType == $rootScope.filter)
              {
                $scope.matches.push($rootScope.pull[i]);
              }
            }
            else {
              $scope.matches.push($rootScope.pull[i]);
            }

          }

          if ($rootScope.orderType == "Match Number")
          {
            $rootScope.reverse = reverseOrder;

            $scope.orderedMatches = $scope.matches;
            $scope.orderedMatches = $filter('orderBy')($scope.orderedMatches, "number", $rootScope.reverse);

            console.log("Ordered Matches:")
            for (asd = 0; asd<$scope.orderedMatches.length; asd++)
            {
                console.log(JSON.stringify($scope.orderedMatches[asd].number));
            }
          }
          else if ($rootScope.orderType == "Score Contribution")
          {
            if (reverseOrder){$rootScope.reverse = false;}
            else {$rootScope.reverse = true;}

            $scope.orderedMatches = $scope.matches;
            $scope.orderedMatches = $filter('orderBy')($scope.orderedMatches, "totalscore", $rootScope.reverse);

            console.log("Ordered Matches:")
            for (asd = 0; asd<$scope.orderedMatches.length; asd++)
            {
                console.log(JSON.stringify($scope.orderedMatches[asd].totalscore));
            }
          }

          $scope.refreshed = true;

    }

}])

.controller('StatisticsCtrl', ['$scope', '$state', '$http', '$rootScope', function($scope, $state, $http, $rootScope) {

  $scope.refreshed = false;
  $scope.notAvailable = " ";

  $scope.menu = function() {
    $state.go('menu');
  }

  $scope.newTeam = function(filterTeam) {

    $scope.notAvailable = " ";

    $scope.teams =    {team: 0,
                          autoLowBallTotal: 0, autoHighBallTotal: 0, // Convert to Averages
                          autoLowBallAverage: 0, autoHighBallAverage: 0,
                          autoLowShotTotal: 0, autoHighShotTotal: 0,
                          autoLowShotAverage: 0, autoHighShotAverage: 0,

                          autoLowBarAch: "N/A", autoLowBarCrossCount: 0, autoLowBarAppearCount: 0,
                          autoPortcullisAch: "N/A", autoPortcullisCrossCount: 0, autoPortcullisAppearCount: 0,
                          autoChevalDeFriseAch: "N/A", autoChevalDeFriseCrossCount: 0, autoChevalDeFriseAppearCount: 0,
                          autoMoatAch: "N/A", autoMoatCrossCount: 0, autoMoatAppearCount: 0,
                          autoRampartsAch: "N/A", autoRampartsCrossCount: 0, autoRampartsAppearCount: 0,
                          autoDrawbridgeAch: "N/A", autoDrawbridgeCrossCount: 0, autoDrawbridgeAppearCount: 0,
                          autoSallyPortAch: "N/A", autoSallyPortCrossCount: 0, autoSallyPortAppearCount: 0,
                          autoRockWallAch: "N/A", autoRockWallCrossCount: 0, autoRockWallAppearCount: 0,
                          autoRoughTerrainAch: "N/A", autoRoughTerrainCrossCount: 0, autoRoughTerrainAppearCount: 0,

                          teleopLowBallTotal: 0, teleopHighBallTotal: 0, // Convert to Averages
                          teleopLowBallAverage: 0, teleopHighBallAverage: 0,
                          teleopLowShotTotal: 0, teleopHighShotTotal: 0,
                          teleopLowShotAverage: 0, teleopHighShotAverage: 0,

                          teleopLowBarAch: "N/A", teleopLowBarCrossCount: 0, teleopLowBarAppearCount: 0,
                          teleopPortcullisAch: "N/A", teleopPortcullisCrossCount: 0, teleopPortcullisAppearCount: 0,
                          teleopChevalDeFriseAch: "N/A", teleopChevalDeFriseCrossCount: 0, teleopChevalDeFriseAppearCount: 0,
                          teleopMoatAch: "N/A", teleopMoatCrossCount: 0, teleopMoatAppearCount: 0,
                          teleopRampartsAch: "N/A", teleopRampartsCrossCount: 0, teleopRampartsAppearCount: 0,
                          teleopDrawbridgeAch: "N/A", teleopDrawbridgeCrossCount: 0, teleopDrawbridgeAppearCount: 0,
                          teleopSallyPortAch: "N/A", teleopSallyPortCrossCount: 0, teleopSallyPortAppearCount: 0,
                          teleopRockWallAch: "N/A", teleopRockWallCrossCount: 0, teleopRockWallAppearCount: 0,
                          teleopRoughTerrainAch: "N/A", teleopRoughTerrainCrossCount: 0, teleopRoughTerrainAppearCount: 0,

                          teleopTotalDamageTotal: 0, // Convert to Averages
                          teleopTotalDamageAverage: 0,

                          teleopCycleTimeTotal: 0, // Convert to Averages
                          teleopCycleTimeAverage: 0,

                          teleopTowerAttackFailCount: 0,
                          teleopTowerAttackChallengeCount: 0,
                          teleopTowerAttackScaleCount: 0,

                          overallAccuracy: 0,

                          totalTotalScore: 0, // Convert to Averages
                          averageTotalScore: 0,



                          timesStartCourtyard: 0,
                          timesStartAutoZone: 0,
                          timesStartSpyStart: 0,

                          totalGameCount: 0,

                          autoNotesCollection: [],
                          teleopNotesCollection: []}

        $scope.matches = [];

        if (filterTeam)
        {
          $rootScope.filter = filterTeam;
        }

        var theUltimateCycleCount = 0;

        console.log("Number of Available Entries: " + $rootScope.pull.length);

        for (i = 0; i < $rootScope.pull.length; i++) {

          if ($rootScope.pull[i].team == $rootScope.filter)
          {

            for (time = 1; time<=5; time++)
                        {
                          var theDefense = "";
                          var theLabel = "";

                          if (time == 1){theDefense = $rootScope.pull[i].defenseOne;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.firstDefenseLabel;}
                          if (time == 2){theDefense = $rootScope.pull[i].defenseTwo;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.secondDefenseLabel;}
                          if (time == 3){theDefense = $rootScope.pull[i].defenseThree;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.thirdDefenseLabel;}
                          if (time == 4){theDefense = $rootScope.pull[i].defenseFour;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.fourthDefenseLabel;}
                          if (time == 5){theDefense = $rootScope.pull[i].defenseFive;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.fifthDefenseLabel;}

                          if (theLabel == "Crossed") {

                            if (theDefense == "Low Bar") {$scope.teams.autoLowBarAch="Crossed";$scope.teams.autoLowBarCrossCount++;}
                            if (theDefense == "Portcullis (A)") {$scope.teams.autoPortcullisAch="Crossed";$scope.teams.autoPortcullisCrossCount++;}
                            if (theDefense == "Cheval de Frise (A)") {$scope.teams.autoChevalDeFriseAch="Crossed";$scope.teams.autoChevalDeFriseCrossCount++;}
                            if (theDefense == "Moat (B)") {$scope.teams.autoMoatAch="Crossed";$scope.teams.autoMoatCrossCount++;}
                            if (theDefense == "Ramparts (B)") {$scope.teams.autoRampartsAch="Crossed";$scope.teams.autoRampartsCrossCount++;}
                            if (theDefense == "Drawbridge (C)") {$scope.teams.autoDrawbridgeAch="Crossed";$scope.teams.autoDrawbridgeCrossCount++;}
                            if (theDefense == "Sally Port (C)") {$scope.teams.autoSallyPortAch="Crossed";$scope.teams.autoSallyPortCrossCount++;}
                            if (theDefense == "Rock Wall (D)") {$scope.teams.autoRockWallAch="Crossed";$scope.teams.autoRockWallCrossCount++;}
                            if (theDefense == "Rough Terrain (D)") {$scope.teams.autoRoughTerrainAch="Crossed";$scope.teams.autoRoughTerrainCrossCount++;}

                          }
                          else if (theLabel == "Reached") {

                            if (theDefense == "Low Bar" && $scope.teams.autoLowBarAch != "Crossed") {$scope.teams.autoLowBarAch="Reached";}
                            if (theDefense == "Portcullis (A)" && $scope.teams.autoPortcullisAch != "Crossed") {$scope.teams.autoPortcullisAch="Reached";}
                            if (theDefense == "Cheval de Frise (A)" && $scope.teams.autoChevalDeFriseAch != "Crossed") {$scope.teams.autoChevalDeFriseAch="Reached";}
                            if (theDefense == "Moat (B)" && $scope.teams.autoMoatAch != "Crossed") {$scope.teams.autoMoatAch="Reached";}
                            if (theDefense == "Ramparts (B)" && $scope.teams.autoRampartsAch != "Crossed") {$scope.teams.autoRampartsAch="Reached";}
                            if (theDefense == "Drawbridge (C)" && $scope.teams.autoDrawbridgeAch != "Crossed") {$scope.teams.autoDrawbridgeAch="Reached";}
                            if (theDefense == "Sally Port (C)" && $scope.teams.autoSallyPortAch != "Crossed") {$scope.teams.autoSallyPortAch="Reached";}
                            if (theDefense == "Rock Wall (D)" && $scope.teams.autoRockWallAch != "Crossed") {$scope.teams.autoRockWallAch="Reached";}
                            if (theDefense == "Rough Terrain (D)" && $scope.teams.autoRoughTerrainAch != "Crossed") {$scope.teams.autoRoughTerrainAch="Reached";}

                          }
                          else {

                            if (theDefense == "Low Bar" && ($scope.teams.autoLowBarAch != "Crossed" && $scope.teams.autoLowBarAch != "Reached")) {$scope.teams.autoLowBarAch="Failed";}
                            if (theDefense == "Portcullis (A)" && ($scope.teams.autoPortcullisAch != "Crossed" && $scope.teams.autoPortcullisAch != "Reached")) {$scope.teams.autoPortcullisAch="Failed";}
                            if (theDefense == "Cheval de Frise (A)" && ($scope.teams.autoChevalDeFriseAch != "Crossed" && $scope.teams.autoChevalDeFriseAch != "Reached")) {$scope.teams.autoChevalDeFriseAch="Failed";}
                            if (theDefense == "Moat (B)" && ($scope.teams.autoMoatAch != "Crossed" && $scope.teams.autoMoatAch != "Reached")) {$scope.teams.autoMoatAch="Failed";}
                            if (theDefense == "Ramparts (B)" && ($scope.teams.autoRampartsAch != "Crossed" && $scope.teams.autoRampartsAch != "Reached")) {$scope.teams.autoRampartsAch="Failed";}
                            if (theDefense == "Drawbridge (C)" && ($scope.teams.autoDrawbridgeAch != "Crossed" && $scope.teams.autoDrawbridgeAch != "Reached")) {$scope.teams.autoDrawbridgeAch="Failed";}
                            if (theDefense == "Sally Port (C)" && ($scope.teams.autoSallyPortAch != "Crossed" && $scope.teams.autoSallyPortAch != "Reached")) {$scope.teams.autoSallyPortAch="Failed";}
                            if (theDefense == "Rock Wall (D)" && ($scope.teams.autoRockWallAch != "Crossed" && $scope.teams.autoRockWallAch != "Reached")) {$scope.teams.autoRockWallAch="Failed";}
                            if (theDefense == "Rough Terrain (D)" && ($scope.teams.autoRoughTerrainAch != "Crossed" && $scope.teams.autoRoughTerrainAch != "Reached")) {$scope.teams.autoRoughTerrainAch="Failed";}

                          }

                          if (theDefense == "Low Bar") {$scope.teams.autoLowBarAppearCount++;}
                          if (theDefense == "Portcullis (A)") {$scope.teams.autoPortcullisAppearCount++;}
                          if (theDefense == "Cheval de Frise (A)") {$scope.teams.autoChevalDeFriseAppearCount++;}
                          if (theDefense == "Moat (B)") {$scope.teams.autoMoatAppearCount++;}
                          if (theDefense == "Ramparts (B)") {$scope.teams.autoRampartsAppearCount++;}
                          if (theDefense == "Drawbridge (C)") {$scope.teams.autoDrawbridgeAppearCount++;}
                          if (theDefense == "Sally Port (C)") {$scope.teams.autoSallyPortAppearCount++;}
                          if (theDefense == "Rock Wall (D)") {$scope.teams.autoRockWallAppearCount++;}
                          if (theDefense == "Rough Terrain (D)") {$scope.teams.autoRoughTerrainAppearCount++;}

                        }

            for (time2 = 1; time2<=5; time2++)
                        {
                          var theDefense = "";
                          var theLabel = "";

                          if (time2 == 1){theDefense = $rootScope.pull[i].defenseOne;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.firstDefenseLabel;}
                          if (time2 == 2){theDefense = $rootScope.pull[i].defenseTwo;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.secondDefenseLabel;}
                          if (time2 == 3){theDefense = $rootScope.pull[i].defenseThree;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.thirdDefenseLabel;}
                          if (time2 == 4){theDefense = $rootScope.pull[i].defenseFour;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.fourthDefenseLabel;}
                          if (time2 == 5){theDefense = $rootScope.pull[i].defenseFive;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.fifthDefenseLabel;}

                          if (theLabel == "Crossed") {

                            if (theDefense == "Low Bar") {$scope.teams.teleopLowBarAch="Crossed";$scope.teams.teleopLowBarCrossCount++;}
                            if (theDefense == "Portcullis (A)") {$scope.teams.teleopPortcullisAch="Crossed";$scope.teams.teleopPortcullisCrossCount++;}
                            if (theDefense == "Cheval de Frise (A)") {$scope.teams.teleopChevalDeFriseAch="Crossed";$scope.teams.teleopChevalDeFriseCrossCount++;}
                            if (theDefense == "Moat (B)") {$scope.teams.teleopMoatAch="Crossed";$scope.teams.teleopMoatCrossCount++;}
                            if (theDefense == "Ramparts (B)") {$scope.teams.teleopRampartsAch="Crossed";$scope.teams.teleopRampartsCrossCount++;}
                            if (theDefense == "Drawbridge (C)") {$scope.teams.teleopDrawbridgeAch="Crossed";$scope.teams.teleopDrawbridgeCrossCount++;}
                            if (theDefense == "Sally Port (C)") {$scope.teams.teleopSallyPortAch="Crossed";$scope.teams.teleopSallyPortCrossCount++;}
                            if (theDefense == "Rock Wall (D)") {$scope.teams.teleopRockWallAch="Crossed";$scope.teams.teleopRockWallCrossCount++;}
                            if (theDefense == "Rough Terrain (D)") {$scope.teams.teleopRoughTerrainAch="Crossed";$scope.teams.teleopRoughTerrainCrossCount++;}

                          }
                          else {

                            if (theDefense == "Low Bar" && ($scope.teams.teleopLowBarAch != "Crossed" && $scope.teams.teleopLowBarAch != "Reached")) {$scope.teams.teleopLowBarAch="Failed";}
                            if (theDefense == "Portcullis (A)" && ($scope.teams.teleopPortcullisAch != "Crossed" && $scope.teams.teleopPortcullisAch != "Reached")) {$scope.teams.teleopPortcullisAch="Failed";}
                            if (theDefense == "Cheval de Frise (A)" && ($scope.teams.teleopChevalDeFriseAch != "Crossed" && $scope.teams.teleopChevalDeFriseAch != "Reached")) {$scope.teams.teleopChevalDeFriseAch="Failed";}
                            if (theDefense == "Moat (B)" && ($scope.teams.teleopMoatAch != "Crossed" && $scope.teams.teleopMoatAch != "Reached")) {$scope.teams.teleopMoatAch="Failed";}
                            if (theDefense == "Ramparts (B)" && ($scope.teams.teleopRampartsAch != "Crossed" && $scope.teams.teleopRampartsAch != "Reached")) {$scope.teams.teleopRampartsAch="Failed";}
                            if (theDefense == "Drawbridge (C)" && ($scope.teams.teleopDrawbridgeAch != "Crossed" && $scope.teams.teleopDrawbridgeAch != "Reached")) {$scope.teams.teleopDrawbridgeAch="Failed";}
                            if (theDefense == "Sally Port (C)" && ($scope.teams.teleopSallyPortAch != "Crossed" && $scope.teams.teleopSallyPortAch != "Reached")) {$scope.teams.teleopSallyPortAch="Failed";}
                            if (theDefense == "Rock Wall (D)" && ($scope.teams.teleopRockWallAch != "Crossed" && $scope.teams.teleopRockWallAch != "Reached")) {$scope.teams.teleopRockWallAch="Failed";}
                            if (theDefense == "Rough Terrain (D)" && ($scope.teams.teleopRoughTerrainAch != "Crossed" && $scope.teams.teleopRoughTerrainAch != "Reached")) {$scope.teams.teleopRoughTerrainAch="Failed";}

                          }

                          if (theDefense == "Low Bar") {$scope.teams.teleopLowBarAppearCount++;}
                          if (theDefense == "Portcullis (A)") {$scope.teams.teleopPortcullisAppearCount++;}
                          if (theDefense == "Cheval de Frise (A)") {$scope.teams.teleopChevalDeFriseAppearCount++;}
                          if (theDefense == "Moat (B)") {$scope.teams.teleopMoatAppearCount++;}
                          if (theDefense == "Ramparts (B)") {$scope.teams.teleopRampartsAppearCount++;}
                          if (theDefense == "Drawbridge (C)") {$scope.teams.teleopDrawbridgeAppearCount++;}
                          if (theDefense == "Sally Port (C)") {$scope.teams.teleopSallyPortAppearCount++;}
                          if (theDefense == "Rock Wall (D)") {$scope.teams.teleopRockWallAppearCount++;}
                          if (theDefense == "Rough Terrain (D)") {$scope.teams.teleopRoughTerrainAppearCount++;}

                        }

            $scope.teams.team = $rootScope.filter,
            $scope.teams.autoLowBallTotal +=$rootScope.pull[i].auto.lowBall;
            $scope.teams.autoHighBallTotal +=$rootScope.pull[i].auto.highBall; // Convert to Averages
            $scope.teams.autoLowShotTotal +=$rootScope.pull[i].auto.lowShots;
            $scope.teams.autoHighShotTotal +=$rootScope.pull[i].auto.highShots;

            $scope.teams.teleopLowBallTotal +=$rootScope.pull[i].teleop.lowBall;
            $scope.teams.teleopHighBallTotal +=$rootScope.pull[i].teleop.highBall; // Convert to Averages
            $scope.teams.teleopLowShotTotal +=$rootScope.pull[i].teleop.lowShots;
            $scope.teams.teleopHighShotTotal +=$rootScope.pull[i].teleop.highShots;

            $scope.teams.teleopTotalDamageTotal +=$rootScope.pull[i].teleop.totalDamage; // Convert to Averages

            if ($rootScope.pull[i].teleop.cycleTime != 0)
            {
              $scope.teams.teleopCycleTimeTotal +=$rootScope.pull[i].teleop.cycleTime; // Convert to Averages
              theUltimateCycleCount++;
            }

            if ($rootScope.pull[i].teleop.towerAttack.towerLabel == "Defended")
            {
              $scope.teams.teleopTowerAttackFailCount++;
            }
            else if ($rootScope.pull[i].teleop.towerAttack.towerLabel == "Challenged")
            {
              $scope.teams.teleopTowerAttackChallengeCount++;
            }
            else if ($rootScope.pull[i].teleop.towerAttack.towerLabel == "Scaled")
            {
              $scope.teams.teleopTowerAttackScaleCount++;
            }

            $scope.teams.totalTotalScore += $rootScope.pull[i].totalscore;

            if ($rootScope.pull[i].botType == "Courtyard")
            {
              $scope.teams.timesStartCourtyard++;
            }
            else if ($rootScope.pull[i].botType == "Auto Zone")
            {
              $scope.teams.timesStartAutoZone++;
            }
            else if ($rootScope.pull[i].botType == "Spy Start")
            {
              $scope.teams.timesStartSpyStart++;
            }

            $scope.teams.totalGameCount++;

            $scope.teams.autoNotesCollection.push({notes: $rootScope.pull[i].autonotes, number: $rootScope.pull[i].number});
            $scope.teams.teleopNotesCollection.push({notes: $rootScope.pull[i].teleopnotes, number: $rootScope.pull[i].number});
          }

          $scope.refreshed = true;

        }

        $scope.teams.autoLowBallAverage = $scope.teams.autoLowBallTotal/$scope.teams.totalGameCount;
        $scope.teams.autoHighBallAverage = $scope.teams.autoHighBallTotal/$scope.teams.totalGameCount;

        $scope.teams.teleopLowBallAverage = $scope.teams.teleopLowBallTotal/$scope.teams.totalGameCount;
        $scope.teams.teleopHighBallAverage = $scope.teams.teleopHighBallTotal/$scope.teams.totalGameCount;

        $scope.teams.autoLowShotAverage = $scope.teams.autoLowShotTotal/$scope.teams.totalGameCount;
        $scope.teams.autoHighShotAverage = $scope.teams.autoHighShotTotal/$scope.teams.totalGameCount;

        $scope.teams.teleopLowShotAverage = $scope.teams.teleopLowShotTotal/$scope.teams.totalGameCount;
        $scope.teams.teleopHighShotAverage = $scope.teams.teleopHighShotTotal/$scope.teams.totalGameCount;

        $scope.teams.teleopTotalDamageAverage = $scope.teams.teleopTotalDamageTotal/$scope.teams.totalGameCount;
        $scope.teams.teleopCycleTimeAverage = $scope.teams.teleopCycleTimeTotal/theUltimateCycleCount/100;

        $scope.teams.overallAccuracy = ($scope.teams.autoLowBallTotal +
                                            $scope.teams.autoHighBallTotal +
                                            $scope.teams.teleopLowBallTotal +
                                            $scope.teams.teleopHighBallTotal)/
                                           ($scope.teams.teleopHighShotTotal +
                                            $scope.teams.teleopLowShotTotal +
                                            $scope.teams.autoHighShotTotal +
                                            $scope.teams.autoLowShotTotal)*100;

        $scope.teams.averageTotalScore = $scope.teams.totalTotalScore/$scope.teams.totalGameCount;

        console.log("Success!");

        if ($scope.teams.totalGameCount <= 0)
        {
          $scope.notAvailable = "Team not available! You can use these teams: ";
          $scope.listTeams = [];

          $scope.listTeams.push($rootScope.pull[0].team);
          $scope.notAvailable += $rootScope.pull[0].team;

          console.log ("Not available!");
          for (check = 1; check < $rootScope.pull.length; check++) {
            var add = true;
            if ($scope.listTeams.length>0)
            {
              for (doubleCheck = 0; doubleCheck < $scope.listTeams.length; doubleCheck++) {
                if ($rootScope.pull[check].team == $scope.listTeams[doubleCheck] || !$rootScope.pull[check].team)
                {
                  add = false;
                }
              }
            }
            if (add == true){
              $scope.listTeams.push($rootScope.pull[check].team);
              $scope.notAvailable += ", " + $rootScope.pull[check].team;
            }
          }
          console.log ($scope.notAvailable);
        }

  }

}])

.controller('RankingsCtrl', ['$scope', '$state', '$http', '$rootScope', '$filter', function($scope, $state, $http, $rootScope, $filter) {

  $scope.refreshed = false;
  $scope.filterStat = "Avg Score Contribution";
  $scope.filterDisplayStat = "Average Score: ";
  $scope.filterDisplayUnit = "";
  $scope.reverseOrder = false;
  $scope.listTeams = [];

  $scope.menu = function() {
    $state.go('menu');
  }

  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };


  $scope.rankList = function(filterStat, reverseOrder) {

        console.log("Filter: " + filterStat);
        console.log("Reverse: " + reverseOrder);

        $scope.matches = [];

        $scope.listTeams = [];

        for (check = 0; check < $rootScope.pull.length; check++) {
          var add = true;
          if ($scope.listTeams.length>0)
          {
            for (doubleCheck = 0; doubleCheck < $scope.listTeams.length; doubleCheck++) {
              if ($rootScope.pull[check].team == $scope.listTeams[doubleCheck] || !$rootScope.pull[check].team)
              {
                add = false;
              }
            }
          }
          if (add == true){
            $scope.listTeams.push($rootScope.pull[check].team);
            console.log("Added Team: " + $rootScope.pull[check].team + " at: " + check);
          }
        }

        console.log("Teams List: " + JSON.stringify($scope.listTeams));

        $scope.allStats = [];

        for (teamLoc = 0; teamLoc < $scope.listTeams.length; teamLoc++)
        {

        var theTeam = $scope.listTeams[teamLoc];

        console.log("Team: " + theTeam);

        $scope.teams =    {team: 0,
                              autoLowBallTotal: 0, autoHighBallTotal: 0, // Convert to Averages
                              autoLowBallAverage: 0, autoHighBallAverage: 0,
                              autoLowShotTotal: 0, autoHighShotTotal: 0,
                              autoLowShotAverage: 0, autoHighShotAverage: 0,

                              autoLowBarAch: "N/A", autoLowBarCrossCount: 0, autoLowBarAppearCount: 0,
                              autoPortcullisAch: "N/A", autoPortcullisCrossCount: 0, autoPortcullisAppearCount: 0,
                              autoChevalDeFriseAch: "N/A", autoChevalDeFriseCrossCount: 0, autoChevalDeFriseAppearCount: 0,
                              autoMoatAch: "N/A", autoMoatCrossCount: 0, autoMoatAppearCount: 0,
                              autoRampartsAch: "N/A", autoRampartsCrossCount: 0, autoRampartsAppearCount: 0,
                              autoDrawbridgeAch: "N/A", autoDrawbridgeCrossCount: 0, autoDrawbridgeAppearCount: 0,
                              autoSallyPortAch: "N/A", autoSallyPortCrossCount: 0, autoSallyPortAppearCount: 0,
                              autoRockWallAch: "N/A", autoRockWallCrossCount: 0, autoRockWallAppearCount: 0,
                              autoRoughTerrainAch: "N/A", autoRoughTerrainCrossCount: 0, autoRoughTerrainAppearCount: 0,

                              teleopLowBallTotal: 0, teleopHighBallTotal: 0, // Convert to Averages
                              teleopLowBallAverage: 0, teleopHighBallAverage: 0,
                              teleopLowShotTotal: 0, teleopHighShotTotal: 0,
                              teleopLowShotAverage: 0, teleopHighShotAverage: 0,

                              teleopLowBarAch: "N/A", teleopLowBarCrossCount: 0, teleopLowBarAppearCount: 0,
                              teleopPortcullisAch: "N/A", teleopPortcullisCrossCount: 0, teleopPortcullisAppearCount: 0,
                              teleopChevalDeFriseAch: "N/A", teleopChevalDeFriseCrossCount: 0, teleopChevalDeFriseAppearCount: 0,
                              teleopMoatAch: "N/A", teleopMoatCrossCount: 0, teleopMoatAppearCount: 0,
                              teleopRampartsAch: "N/A", teleopRampartsCrossCount: 0, teleopRampartsAppearCount: 0,
                              teleopDrawbridgeAch: "N/A", teleopDrawbridgeCrossCount: 0, teleopDrawbridgeAppearCount: 0,
                              teleopSallyPortAch: "N/A", teleopSallyPortCrossCount: 0, teleopSallyPortAppearCount: 0,
                              teleopRockWallAch: "N/A", teleopRockWallCrossCount: 0, teleopRockWallAppearCount: 0,
                              teleopRoughTerrainAch: "N/A", teleopRoughTerrainCrossCount: 0, teleopRoughTerrainAppearCount: 0,

                              teleopTotalDamageTotal: 0, // Convert to Averages
                              teleopTotalDamageAverage: 0,

                              teleopCycleTimeTotal: 0, // Convert to Averages
                              teleopCycleTimeAverage: 0,

                              teleopTowerAttackFailCount: 0,
                              teleopTowerAttackChallengeCount: 0,
                              teleopTowerAttackScaleCount: 0,

                              overallAccuracy: 0,

                              totalTotalScore: 0, // Convert to Averages
                              averageTotalScore: 0,



                              timesStartCourtyard: 0,
                              timesStartAutoZone: 0,
                              timesStartSpyStart: 0,

                              totalGameCount: 0,

                              autoNotesCollection: [],
                              teleopNotesCollection: [],

                              filterVarStat: 0}

        if (theTeam)
        {
          $rootScope.filter = theTeam;
        }

        console.log("Number of Available Entries: " + $rootScope.pull.length);

        var theCycleCount = 0;

        for (i = 0; i < $rootScope.pull.length; i++) {



          if ($rootScope.pull[i].team == $rootScope.filter)
          {
            console.log("+++ New Entry! " + ($scope.teams.totalGameCount +1) + " +++")


            for (time = 1; time<=5; time++)
                        {
                          var theDefense = "";
                          var theLabel = "";

                          if (time == 1){theDefense = $rootScope.pull[i].defenseOne;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.firstDefenseLabel;}
                          if (time == 2){theDefense = $rootScope.pull[i].defenseTwo;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.secondDefenseLabel;}
                          if (time == 3){theDefense = $rootScope.pull[i].defenseThree;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.thirdDefenseLabel;}
                          if (time == 4){theDefense = $rootScope.pull[i].defenseFour;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.fourthDefenseLabel;}
                          if (time == 5){theDefense = $rootScope.pull[i].defenseFive;theLabel = $rootScope.pull[i].auto.definedDefensesAuto.fifthDefenseLabel;}

                          if (theLabel == "Crossed") {

                            if (theDefense == "Low Bar") {$scope.teams.autoLowBarAch="Crossed";$scope.teams.autoLowBarCrossCount++;}
                            if (theDefense == "Portcullis (A)") {$scope.teams.autoPortcullisAch="Crossed";$scope.teams.autoPortcullisCrossCount++;}
                            if (theDefense == "Cheval de Frise (A)") {$scope.teams.autoChevalDeFriseAch="Crossed";$scope.teams.autoChevalDeFriseCrossCount++;}
                            if (theDefense == "Moat (B)") {$scope.teams.autoMoatAch="Crossed";$scope.teams.autoMoatCrossCount++;}
                            if (theDefense == "Ramparts (B)") {$scope.teams.autoRampartsAch="Crossed";$scope.teams.autoRampartsCrossCount++;}
                            if (theDefense == "Drawbridge (C)") {$scope.teams.autoDrawbridgeAch="Crossed";$scope.teams.autoDrawbridgeCrossCount++;}
                            if (theDefense == "Sally Port (C)") {$scope.teams.autoSallyPortAch="Crossed";$scope.teams.autoSallyPortCrossCount++;}
                            if (theDefense == "Rock Wall (D)") {$scope.teams.autoRockWallAch="Crossed";$scope.teams.autoRockWallCrossCount++;}
                            if (theDefense == "Rough Terrain (D)") {$scope.teams.autoRoughTerrainAch="Crossed";$scope.teams.autoRoughTerrainCrossCount++;}

                          }
                          else if (theLabel == "Reached") {

                            if (theDefense == "Low Bar" && $scope.teams.autoLowBarAch != "Crossed") {$scope.teams.autoLowBarAch="Reached";}
                            if (theDefense == "Portcullis (A)" && $scope.teams.autoPortcullisAch != "Crossed") {$scope.teams.autoPortcullisAch="Reached";}
                            if (theDefense == "Cheval de Frise (A)" && $scope.teams.autoChevalDeFriseAch != "Crossed") {$scope.teams.autoChevalDeFriseAch="Reached";}
                            if (theDefense == "Moat (B)" && $scope.teams.autoMoatAch != "Crossed") {$scope.teams.autoMoatAch="Reached";}
                            if (theDefense == "Ramparts (B)" && $scope.teams.autoRampartsAch != "Crossed") {$scope.teams.autoRampartsAch="Reached";}
                            if (theDefense == "Drawbridge (C)" && $scope.teams.autoDrawbridgeAch != "Crossed") {$scope.teams.autoDrawbridgeAch="Reached";}
                            if (theDefense == "Sally Port (C)" && $scope.teams.autoSallyPortAch != "Crossed") {$scope.teams.autoSallyPortAch="Reached";}
                            if (theDefense == "Rock Wall (D)" && $scope.teams.autoRockWallAch != "Crossed") {$scope.teams.autoRockWallAch="Reached";}
                            if (theDefense == "Rough Terrain (D)" && $scope.teams.autoRoughTerrainAch != "Crossed") {$scope.teams.autoRoughTerrainAch="Reached";}

                          }
                          else {

                            if (theDefense == "Low Bar" && ($scope.teams.autoLowBarAch != "Crossed" && $scope.teams.autoLowBarAch != "Reached")) {$scope.teams.autoLowBarAch="Failed";}
                            if (theDefense == "Portcullis (A)" && ($scope.teams.autoPortcullisAch != "Crossed" && $scope.teams.autoPortcullisAch != "Reached")) {$scope.teams.autoPortcullisAch="Failed";}
                            if (theDefense == "Cheval de Frise (A)" && ($scope.teams.autoChevalDeFriseAch != "Crossed" && $scope.teams.autoChevalDeFriseAch != "Reached")) {$scope.teams.autoChevalDeFriseAch="Failed";}
                            if (theDefense == "Moat (B)" && ($scope.teams.autoMoatAch != "Crossed" && $scope.teams.autoMoatAch != "Reached")) {$scope.teams.autoMoatAch="Failed";}
                            if (theDefense == "Ramparts (B)" && ($scope.teams.autoRampartsAch != "Crossed" && $scope.teams.autoRampartsAch != "Reached")) {$scope.teams.autoRampartsAch="Failed";}
                            if (theDefense == "Drawbridge (C)" && ($scope.teams.autoDrawbridgeAch != "Crossed" && $scope.teams.autoDrawbridgeAch != "Reached")) {$scope.teams.autoDrawbridgeAch="Failed";}
                            if (theDefense == "Sally Port (C)" && ($scope.teams.autoSallyPortAch != "Crossed" && $scope.teams.autoSallyPortAch != "Reached")) {$scope.teams.autoSallyPortAch="Failed";}
                            if (theDefense == "Rock Wall (D)" && ($scope.teams.autoRockWallAch != "Crossed" && $scope.teams.autoRockWallAch != "Reached")) {$scope.teams.autoRockWallAch="Failed";}
                            if (theDefense == "Rough Terrain (D)" && ($scope.teams.autoRoughTerrainAch != "Crossed" && $scope.teams.autoRoughTerrainAch != "Reached")) {$scope.teams.autoRoughTerrainAch="Failed";}

                          }

                          if (theDefense == "Low Bar") {$scope.teams.autoLowBarAppearCount++;}
                          if (theDefense == "Portcullis (A)") {$scope.teams.autoPortcullisAppearCount++;}
                          if (theDefense == "Cheval de Frise (A)") {$scope.teams.autoChevalDeFriseAppearCount++;}
                          if (theDefense == "Moat (B)") {$scope.teams.autoMoatAppearCount++;}
                          if (theDefense == "Ramparts (B)") {$scope.teams.autoRampartsAppearCount++;}
                          if (theDefense == "Drawbridge (C)") {$scope.teams.autoDrawbridgeAppearCount++;}
                          if (theDefense == "Sally Port (C)") {$scope.teams.autoSallyPortAppearCount++;}
                          if (theDefense == "Rock Wall (D)") {$scope.teams.autoRockWallAppearCount++;}
                          if (theDefense == "Rough Terrain (D)") {$scope.teams.autoRoughTerrainAppearCount++;}

                        }

            for (time2 = 1; time2<=5; time2++)
                        {
                          var theDefense = "";
                          var theLabel = "";

                          if (time2 == 1){theDefense = $rootScope.pull[i].defenseOne;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.firstDefenseLabel;}
                          if (time2 == 2){theDefense = $rootScope.pull[i].defenseTwo;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.secondDefenseLabel;}
                          if (time2 == 3){theDefense = $rootScope.pull[i].defenseThree;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.thirdDefenseLabel;}
                          if (time2 == 4){theDefense = $rootScope.pull[i].defenseFour;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.fourthDefenseLabel;}
                          if (time2 == 5){theDefense = $rootScope.pull[i].defenseFive;theLabel = $rootScope.pull[i].teleop.definedDefensesTeleop.fifthDefenseLabel;}

                          if (theLabel == "Crossed") {

                            if (theDefense == "Low Bar") {$scope.teams.teleopLowBarAch="Crossed";$scope.teams.teleopLowBarCrossCount++;}
                            if (theDefense == "Portcullis (A)") {$scope.teams.teleopPortcullisAch="Crossed";$scope.teams.teleopPortcullisCrossCount++;}
                            if (theDefense == "Cheval de Frise (A)") {$scope.teams.teleopChevalDeFriseAch="Crossed";$scope.teams.teleopChevalDeFriseCrossCount++;}
                            if (theDefense == "Moat (B)") {$scope.teams.teleopMoatAch="Crossed";$scope.teams.teleopMoatCrossCount++;}
                            if (theDefense == "Ramparts (B)") {$scope.teams.teleopRampartsAch="Crossed";$scope.teams.teleopRampartsCrossCount++;}
                            if (theDefense == "Drawbridge (C)") {$scope.teams.teleopDrawbridgeAch="Crossed";$scope.teams.teleopDrawbridgeCrossCount++;}
                            if (theDefense == "Sally Port (C)") {$scope.teams.teleopSallyPortAch="Crossed";$scope.teams.teleopSallyPortCrossCount++;}
                            if (theDefense == "Rock Wall (D)") {$scope.teams.teleopRockWallAch="Crossed";$scope.teams.teleopRockWallCrossCount++;}
                            if (theDefense == "Rough Terrain (D)") {$scope.teams.teleopRoughTerrainAch="Crossed";$scope.teams.teleopRoughTerrainCrossCount++;}

                          }
                          else {

                            if (theDefense == "Low Bar" && ($scope.teams.teleopLowBarAch != "Crossed" && $scope.teams.teleopLowBarAch != "Reached")) {$scope.teams.teleopLowBarAch="Failed";}
                            if (theDefense == "Portcullis (A)" && ($scope.teams.teleopPortcullisAch != "Crossed" && $scope.teams.teleopPortcullisAch != "Reached")) {$scope.teams.teleopPortcullisAch="Failed";}
                            if (theDefense == "Cheval de Frise (A)" && ($scope.teams.teleopChevalDeFriseAch != "Crossed" && $scope.teams.teleopChevalDeFriseAch != "Reached")) {$scope.teams.teleopChevalDeFriseAch="Failed";}
                            if (theDefense == "Moat (B)" && ($scope.teams.teleopMoatAch != "Crossed" && $scope.teams.teleopMoatAch != "Reached")) {$scope.teams.teleopMoatAch="Failed";}
                            if (theDefense == "Ramparts (B)" && ($scope.teams.teleopRampartsAch != "Crossed" && $scope.teams.teleopRampartsAch != "Reached")) {$scope.teams.teleopRampartsAch="Failed";}
                            if (theDefense == "Drawbridge (C)" && ($scope.teams.teleopDrawbridgeAch != "Crossed" && $scope.teams.teleopDrawbridgeAch != "Reached")) {$scope.teams.teleopDrawbridgeAch="Failed";}
                            if (theDefense == "Sally Port (C)" && ($scope.teams.teleopSallyPortAch != "Crossed" && $scope.teams.teleopSallyPortAch != "Reached")) {$scope.teams.teleopSallyPortAch="Failed";}
                            if (theDefense == "Rock Wall (D)" && ($scope.teams.teleopRockWallAch != "Crossed" && $scope.teams.teleopRockWallAch != "Reached")) {$scope.teams.teleopRockWallAch="Failed";}
                            if (theDefense == "Rough Terrain (D)" && ($scope.teams.teleopRoughTerrainAch != "Crossed" && $scope.teams.teleopRoughTerrainAch != "Reached")) {$scope.teams.teleopRoughTerrainAch="Failed";}

                          }

                          if (theDefense == "Low Bar") {$scope.teams.teleopLowBarAppearCount++;}
                          if (theDefense == "Portcullis (A)") {$scope.teams.teleopPortcullisAppearCount++;}
                          if (theDefense == "Cheval de Frise (A)") {$scope.teams.teleopChevalDeFriseAppearCount++;}
                          if (theDefense == "Moat (B)") {$scope.teams.teleopMoatAppearCount++;}
                          if (theDefense == "Ramparts (B)") {$scope.teams.teleopRampartsAppearCount++;}
                          if (theDefense == "Drawbridge (C)") {$scope.teams.teleopDrawbridgeAppearCount++;}
                          if (theDefense == "Sally Port (C)") {$scope.teams.teleopSallyPortAppearCount++;}
                          if (theDefense == "Rock Wall (D)") {$scope.teams.teleopRockWallAppearCount++;}
                          if (theDefense == "Rough Terrain (D)") {$scope.teams.teleopRoughTerrainAppearCount++;}

                        }

            $scope.teams.team = $rootScope.filter,
            $scope.teams.autoLowBallTotal +=$rootScope.pull[i].auto.lowBall;
            $scope.teams.autoHighBallTotal +=$rootScope.pull[i].auto.highBall; // Convert to Averages
            $scope.teams.autoLowShotTotal +=$rootScope.pull[i].auto.lowShots;
            $scope.teams.autoHighShotTotal +=$rootScope.pull[i].auto.highShots;

            $scope.teams.teleopLowBallTotal +=$rootScope.pull[i].teleop.lowBall;
            $scope.teams.teleopHighBallTotal +=$rootScope.pull[i].teleop.highBall; // Convert to Averages
            $scope.teams.teleopLowShotTotal +=$rootScope.pull[i].teleop.lowShots;
            $scope.teams.teleopHighShotTotal +=$rootScope.pull[i].teleop.highShots;

            $scope.teams.teleopTotalDamageTotal +=$rootScope.pull[i].teleop.totalDamage; // Convert to Averages

            if ($rootScope.pull[i].teleop.cycleTime != 0)
            {
              $scope.teams.teleopCycleTimeTotal +=$rootScope.pull[i].teleop.cycleTime; // Convert to Averages
              theCycleCount++;
            }

            if ($rootScope.pull[i].teleop.towerAttack.towerLabel == "Defended")
            {
              $scope.teams.teleopTowerAttackFailCount++;
            }
            else if ($rootScope.pull[i].teleop.towerAttack.towerLabel == "Challenged")
            {
              $scope.teams.teleopTowerAttackChallengeCount++;
            }
            else if ($rootScope.pull[i].teleop.towerAttack.towerLabel == "Scaled")
            {
              $scope.teams.teleopTowerAttackScaleCount++;
            }

            $scope.teams.totalTotalScore += $rootScope.pull[i].totalscore;

            if ($rootScope.pull[i].botType == "Courtyard")
            {
              $scope.teams.timesStartCourtyard++;
            }
            else if ($rootScope.pull[i].botType == "Auto Zone")
            {
              $scope.teams.timesStartAutoZone++;
            }
            else if ($rootScope.pull[i].botType == "Spy Start")
            {
              $scope.teams.timesStartSpyStart++;
            }

            $scope.teams.totalGameCount++;

            $scope.teams.autoNotesCollection.push({notes: $rootScope.pull[i].autonotes, number: $rootScope.pull[i].number});
            $scope.teams.teleopNotesCollection.push({notes: $rootScope.pull[i].teleopnotes, number: $rootScope.pull[i].number});
          }

          $scope.refreshed = true;

        }

        $scope.teams.autoLowBallAverage = $scope.teams.autoLowBallTotal/$scope.teams.totalGameCount;
        $scope.teams.autoHighBallAverage = $scope.teams.autoHighBallTotal/$scope.teams.totalGameCount;

        $scope.teams.teleopLowBallAverage = $scope.teams.teleopLowBallTotal/$scope.teams.totalGameCount;
        $scope.teams.teleopHighBallAverage = $scope.teams.teleopHighBallTotal/$scope.teams.totalGameCount;

        $scope.teams.autoLowShotAverage = $scope.teams.autoLowShotTotal/$scope.teams.totalGameCount;
        $scope.teams.autoHighShotAverage = $scope.teams.autoHighShotTotal/$scope.teams.totalGameCount;

        $scope.teams.teleopLowShotAverage = $scope.teams.teleopLowShotTotal/$scope.teams.totalGameCount;
        $scope.teams.teleopHighShotAverage = $scope.teams.teleopHighShotTotal/$scope.teams.totalGameCount;

        $scope.teams.teleopTotalDamageAverage = $scope.teams.teleopTotalDamageTotal/$scope.teams.totalGameCount;
        $scope.teams.teleopCycleTimeAverage = $scope.teams.teleopCycleTimeTotal/theCycleCount/100;

        $scope.teams.overallAccuracy = ($scope.teams.autoLowBallTotal +
                                            $scope.teams.autoHighBallTotal +
                                            $scope.teams.teleopLowBallTotal +
                                            $scope.teams.teleopHighBallTotal)/
                                           ($scope.teams.teleopHighShotTotal +
                                            $scope.teams.teleopLowShotTotal +
                                            $scope.teams.autoHighShotTotal +
                                            $scope.teams.autoLowShotTotal)*100;

        $scope.teams.averageTotalScore = $scope.teams.totalTotalScore/$scope.teams.totalGameCount;

        console.log("Success!");

        if (filterStat == "Avg Score Contribution")
        {
          $scope.teams.filterVarStat = $scope.teams.averageTotalScore;
        }
        else if (filterStat == "Avg Cycle Time")
        {
          $scope.teams.filterVarStat = $scope.teams.teleopCycleTimeAverage;
        }
        else if (filterStat == "Overall Accuracy")
        {
          $scope.teams.filterVarStat = $scope.teams.overallAccuracy;
        }

        $scope.allStats.push($scope.teams);

        }

        if (filterStat == "Avg Score Contribution")
        {
          $scope.allStats = $filter('orderBy')($scope.allStats, "averageTotalScore", (!reverseOrder));
          $scope.filterDisplayStat = "Average Score: ";
          $scope.filterDisplayUnit = "";
          console.log("Ranking...  Reversed: " + (!reverseOrder));
          console.log("Ordered Teams:")
          for (dsa = 0; dsa<$scope.allStats.length; dsa++)
          {
              console.log(JSON.stringify($scope.allStats[dsa].averageTotalScore));
          }
        }
        else if (filterStat == "Avg Cycle Time")
        {
          $scope.allStats = $filter('orderBy')($scope.allStats, "teleopCycleTimeAverage", (reverseOrder));
          $scope.filterDisplayStat = "Average Time: ";
          $scope.filterDisplayUnit = "";
          console.log("Ranking...  Reversed: " + (reverseOrder));
          console.log("Ordered Teams:")
          for (dsa = 0; dsa<$scope.allStats.length; dsa++)
          {
              console.log(JSON.stringify($scope.allStats[dsa].teleopCycleTimeAverage));
          }
        }
        else if (filterStat == "Overall Accuracy")
        {
          $scope.allStats = $filter('orderBy')($scope.allStats, "overallAccuracy", (!reverseOrder));
          $scope.filterDisplayStat = "Overall Accuracy: ";
          $scope.filterDisplayUnit = "%";
          console.log("Ranking...  Reversed: " + (reverseOrder));
          console.log("Ordered Teams:")
          for (dsa = 0; dsa<$scope.allStats.length; dsa++)
          {
              console.log(JSON.stringify($scope.allStats[dsa].overallAccuracy));
          }
        }



    }

}])

.controller('TableCtrl', ['$scope', '$state', '$http', '$rootScope', '$filter', function($scope, $state, $http, $rootScope, $filter) {

  $scope.matches = [];
  $scope.orderedMatches = [];

  $scope.filter = "";
  $scope.reverse = false;

  $scope.tableSize = "140px"
  $scope.tableSizeInt = 140;

  $scope.reverseOrder = false;

  $scope.viewRobotStart = false;
  $scope.viewScouter = false;

  $scope.viewAutoBalls = false;
  $scope.viewAutoNotes = false;

  $scope.viewTeleopBalls = false;
  $scope.viewTeleopNotes = false;

  $scope.viewTeleopTotalDamage = false;
  $scope.viewTeleopCycleTime = false;
  $scope.viewTeleopTowerAttack = false;

  $scope.viewTotalScore = false;

  $scope.viewLowBar = false;
  $scope.viewPortcullis = false;
  $scope.viewChevalDeFrise = false;
  $scope.viewMoat = false;
  $scope.viewRamparts = false;
  $scope.viewDrawbridge = false;
  $scope.viewSallyPort = false;
  $scope.viewRockWall = false;
  $scope.viewRoughTerrain = false;


  $scope.menu = function() {
    $state.go('menu');
  }

  $scope.newWidth = function(increase) {

    if (increase)
    {
      $scope.tableSizeInt+=140;
      $scope.tableSize = $scope.tableSizeInt + "px";
    }
    else
    {
      $scope.tableSizeInt-=140;
      $scope.tableSize = $scope.tableSizeInt + "px";
    }

  }

  // $scope.switchAllDefenses = function(theValue) {
  //
  //   $scope.viewLowBar = theValue;
  //   $scope.newWidth($scope.viewLowBar);
  //   $scope.viewPortcullis = theValue;
  //   $scope.newWidth($scope.viewPortcullis);
  //   $scope.viewChevalDeFrise = theValue;
  //   $scope.newWidth($scope.viewChevalDeFrise);
  //   $scope.viewMoat = theValue;
  //   $scope.newWidth($scope.viewMoat);
  //   $scope.viewRamparts = theValue;
  //   $scope.newWidth($scope.viewRamparts);
  //   $scope.viewDrawbridge = theValue;
  //   $scope.newWidth($scope.viewDrawbridge);
  //   $scope.viewSallyPort = theValue;
  //   $scope.newWidth($scope.viewSallyPort);
  //   $scope.viewRockWall = theValue;
  //   $scope.newWidth($scope.viewRockWall);
  //   $scope.viewRoughTerrain = theValue;
  //   $scope.newWidth($scope.viewRoughTerrain);
  //
  // }

  $scope.newFilter = function(team,reverse){

    $scope.filter = team;
    $scope.reverse = reverse;

    console.log("Team: " + $scope.filter);

    console.log("Reverse: " + $scope.reverse);

    $scope.matches = [];
    $scope.orderedMatches = [];

    console.log("Number of Entries: " + $rootScope.pull.length);

    for (i = 0; i < $rootScope.pull.length; i++) {

      if ($rootScope.pull[i].team == $scope.filter)
      {
        $scope.matches.push($rootScope.pull[i]);
      }

    }

    for (pos=0; pos< $scope.matches.length; pos++) {
            $scope.matches[pos].defenseLabel = {

              lowBar: false,
              lowBarAuto: "N/A",
              lowBarTeleop: "",

              portcullis: false,
              portcullisAuto: "N/A",
              portcullisTeleop: "",

              chevalDeFrise: false,
              chevalDeFriseAuto: "N/A",
              chevalDeFriseTeleop: "",

              moat: false,
              moatAuto: "N/A",
              moatTeleop: "",

              ramparts: false,
              rampartsAuto: "N/A",
              rampartsTeleop: "",

              drawbridge: false,
              drawbridgeAuto: "N/A",
              drawbridgeTeleop: "",

              sallyPort: false,
              sallyPortAuto: "N/A",
              sallyPortTeleop: "",

              rockWall: false,
              rockWallAuto: "N/A",
              rockWallTeleop: "",

              roughTerrain: false,
              roughTerrainAuto: "N/A",
              roughTerrainTeleop: ""

            }

            for (time = 1; time<=5; time++)
            {

              var theDefense = "";
              var theAutoLabel = "";

              if (time == 1){theDefense = $scope.matches[pos].defenseOne;theAutoLabel = $scope.matches[pos].auto.definedDefensesAuto.firstDefenseLabel;theTeleopLabel = $scope.matches[pos].teleop.definedDefensesTeleop.firstDefenseLabel;}
              if (time == 2){theDefense = $scope.matches[pos].defenseTwo;theAutoLabel = $scope.matches[pos].auto.definedDefensesAuto.secondDefenseLabel;theTeleopLabel = $scope.matches[pos].teleop.definedDefensesTeleop.secondDefenseLabel;}
              if (time == 3){theDefense = $scope.matches[pos].defenseThree;theAutoLabel = $scope.matches[pos].auto.definedDefensesAuto.thirdDefenseLabel;theTeleopLabel = $scope.matches[pos].teleop.definedDefensesTeleop.thirdDefenseLabel;}
              if (time == 4){theDefense = $scope.matches[pos].defenseFour;theAutoLabel = $scope.matches[pos].auto.definedDefensesAuto.fourthDefenseLabel;theTeleopLabel = $scope.matches[pos].teleop.definedDefensesTeleop.fourthDefenseLabel;}
              if (time == 5){theDefense = $scope.matches[pos].defenseFive;theAutoLabel = $scope.matches[pos].auto.definedDefensesAuto.fifthDefenseLabel;theTeleopLabel = $scope.matches[pos].teleop.definedDefensesTeleop.fifthDefenseLabel;}


              if (theDefense == "Low Bar") {

                $scope.matches[pos].defenseLabel.lowBar = true;
                $scope.matches[pos].defenseLabel.lowBarAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.lowBarTeleop = theTeleopLabel;

              }
              if (theDefense == "Portcullis (A)") {

                $scope.matches[pos].defenseLabel.portcullis = true;
                $scope.matches[pos].defenseLabel.portcullisAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.portcullisTeleop = theTeleopLabel;

              }
              if (theDefense == "Cheval de Frise (A)") {

                $scope.matches[pos].defenseLabel.chevalDeFrise = true;
                $scope.matches[pos].defenseLabel.chevalDeFriseAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.chevalDeFriseTeleop = theTeleopLabel;

              }
              if (theDefense == "Moat (B)") {

                $scope.matches[pos].defenseLabel.moat = true;
                $scope.matches[pos].defenseLabel.moatAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.moatTeleop = theTeleopLabel;

              }
              if (theDefense == "Ramparts (B)") {

                $scope.matches[pos].defenseLabel.ramparts = true;
                $scope.matches[pos].defenseLabel.rampartsAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.rampartsTeleop = theTeleopLabel;

              }
              if (theDefense == "Drawbridge (C)") {

                $scope.matches[pos].defenseLabel.drawbridge = true;
                $scope.matches[pos].defenseLabel.drawbridgeAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.drawbridgeTeleop = theTeleopLabel;

              }
              if (theDefense == "Sally Port (C)") {

                $scope.matches[pos].defenseLabel.sallyPort = true;
                $scope.matches[pos].defenseLabel.sallyPortAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.sallyPortTeleop = theTeleopLabel;

              }
              if (theDefense == "Rock Wall (D)") {

                $scope.matches[pos].defenseLabel.rockWall = true;
                $scope.matches[pos].defenseLabel.rockWallAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.rockWallTeleop = theTeleopLabel;

              }
              if (theDefense == "Rough Terrain (D)") {

                $scope.matches[pos].defenseLabel.roughTerrain = true;
                $scope.matches[pos].defenseLabel.roughTerrainAuto = theAutoLabel;
                $scope.matches[pos].defenseLabel.roughTerrainTeleop = theTeleopLabel;

              }
            }
    }

    $scope.orderedMatches = $scope.matches;
    $scope.orderedMatches = $filter('orderBy')($scope.orderedMatches, "number", $scope.reverse);

    console.log("Ordered Matches:")
    for (asd = 0; asd<$scope.orderedMatches.length; asd++)
    {
      console.log(JSON.stringify($scope.orderedMatches[asd].number));
    }

  }

}])
