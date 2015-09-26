'use strict';

// Ingredients controller
angular.module('ingredients').controller('IngredientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ingredients',
	function($scope, $stateParams, $location, Authentication, Ingredients) {
		$scope.authentication = Authentication;

		$scope.units = [{
			value: 'gr',
			title: 'Gr.'
		}, {
			value: 'kg',
			title: 'Kg.'
		}, {
			value: 'units',
			title: 'Units'
		}, {
			value: 'lts',
			title: 'Lts'
		}];

		// Create new Ingredient
		$scope.create = function() {
			var ingredient = $scope.ingredient;

			// Redirect after save
			ingredient.$save(function(response) {
				$location.path('ingredients/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Ingredient object
		$scope.initCreate = function() {
			$scope.ingredient = new Ingredients ({
				name: '',
				quantity: 0,
				unit: $scope.units[0]
			});
		};

		// Remove existing Ingredient
		$scope.remove = function(ingredient) {
			if ( ingredient ) { 
				ingredient.$remove();

				for (var i in $scope.ingredients) {
					if ($scope.ingredients [i] === ingredient) {
						$scope.ingredients.splice(i, 1);
					}
				}
			} else {
				$scope.ingredient.$remove(function() {
					$location.path('ingredients');
				});
			}
		};

		// Update existing Ingredient
		$scope.update = function() {
			var ingredient = $scope.ingredient;

			ingredient.$update(function() {
				$location.path('ingredients/' + ingredient._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ingredients
		$scope.find = function() {
			$scope.ingredients = Ingredients.query();
		};

		// Find existing Ingredient
		$scope.findOne = function() {
			$scope.ingredient = Ingredients.get({ 
				ingredientId: $stateParams.ingredientId
			});
		};

		// Show an ingredient
		$scope.showIngredient = function(id) {
			$location.path('/ingredients/' + id);
		};
	}
]);
