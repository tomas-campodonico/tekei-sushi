'use strict';

// Ingredients controller
angular.module('ingredients').controller('IngredientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ingredients',
	function($scope, $stateParams, $location, Authentication, Ingredients) {
		$scope.authentication = Authentication;

		// Create new Ingredient
		$scope.create = function() {
			// Create new Ingredient object
			var ingredient = new Ingredients ({
				name: this.name,
				quantity: this.quantity,
				unit: this.unit
			});

			// Redirect after save
			ingredient.$save(function(response) {
				$location.path('ingredients/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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