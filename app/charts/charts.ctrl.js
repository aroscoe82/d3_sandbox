'use strict';

angular
  .module('charts', ['d3'])
  .controller('chartsCtrl', function($scope){
    $scope.d3Label = "Bar Chart";
    $scope.d3Data = [
      {name: "Greg", score:98},
      {name: "Ari", score:96},
      {name: "Loser", score: 48},
      {name: "Test", score: 92 },
      {name: "Test2", score: 52 }
    ];

    $scope.d3OnClick = function(item){
      console.log('clicked: ', item )
    };

    $scope.d3ArcData = 75;
  });