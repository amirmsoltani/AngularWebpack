import angular from 'angular';
import {Test,TestS} from '../../Components';
console.log(Test,TestS);
const Search = angular.module('Search', [Test,TestS]);

Search.controller('SearchController', ['$scope',function ($scope) {
    $scope.text = "hello world";
}]);

export default Search;