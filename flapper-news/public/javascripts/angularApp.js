var app = angular.module('flapperNews', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });

        $urlRouterProvider.otherwise('home');

}]);

app.factory('posts', [ function() {

    var o = {
        posts: [
            {
                title: 'Post 1', link: 'http://google.fr', upvotes:0, comments: []
            }
        ]
    };

    return o;
}]);

app.controller('MainCtrl', [
    '$scope', 'posts',
    function($scope, posts) {
        $scope.test = 'Hello world!';

        $scope.posts = posts.posts;

        $scope.addPost = function() {

            if(!$scope.title || $scope.title === '') { return; }

            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Willy', body: 'Super !', upvotes: 0},
                    {author: 'John', body: 'Ouah je sais pas quoi dire :o', upvotes: 0}
                ]
            });

            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpvotes = function(post) {
          post.upvotes +=1;
        };

    }]);

app.controller('PostsCtrl', [
    '$scope', '$stateParams', 'posts',
    function($scope, $stateParams, posts) {

        $scope.post = posts.posts[$stateParams.id];

        $scope.addComment = function() {
            if($scope.body === '') { return; }

            console.log($scope.post);

            $scope.post.comments.push({
                author: 'user',
                body: $scope.body,
                upvotes: 0
            });

            $scope.body = '';
        };

        $scope.incrementUpvotes = function(comment) {
            comment.upvotes +=1;
        };


    }
]);