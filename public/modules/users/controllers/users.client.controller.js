'use strict';

// Orders controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Users',
	function($scope, $stateParams, $location, $modal, Authentication, Users) {
		$scope.authentication = Authentication;
		$scope.notAcceptedFilter = true;

		// Disable User
		$scope.remove = function(user) {
			user.$update(function() {
				$location.path('users/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Users
		$scope.find = function() {
			$scope.users = Users.query();
		};

		// Find existing User
		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};

		$scope.changeStatus = function(id, code, $event) {
			var user = _.findWhere($scope.users, {
				_id: id
			});

			user.accepted = !user.accepted;
			user.$update();

			$event.stopPropagation();
			$event.preventDefault();
		};
	}
]);
