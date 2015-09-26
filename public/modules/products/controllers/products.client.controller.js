'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
	'Ingredients',
	function($scope, $stateParams, $location, Authentication, Products, Ingredients) {
		$scope.authentication = Authentication;

		$scope.ingredients = [];

		var sumIngredients = function(ingrs) {
			var ingredientsObj = {};

			// Sum quantities of the same ingredients
			_.forEach(ingrs, function(ingredient) {
				var ingredientId = ingredient.ingredient._id;

				if (ingredientsObj[ingredientId]) {
					ingredientsObj[ingredientId].quantity += ingredient.quantity;
				} else {
					ingredientsObj[ingredientId] = ingredient;
				}
			});

			return _.map(ingredientsObj, function(ingr) {
				return ingr;
			});

		};

		$scope.createEmpty = function() {
			$scope.product = new Products({
				ingredients: []
			});

			$scope.noMoreIngredients = false;
		};

		$scope.fetchIngredients = function() {
			$scope.ingredientsList = Ingredients.query();
		};

		// Create new Product
		$scope.create = function() {
			$scope.product.ingredients = sumIngredients($scope.product.ingredients);

			// Redirect after save
			$scope.product.$save(function(response) {
				$location.path('products/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Product
		$scope.remove = function(product) {
			if (product) {
				product.$remove();

				for (var i in $scope.products) {
					if ($scope.products[i] === product) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			$scope.product.ingredients = sumIngredients($scope.product.ingredients);
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({
				productId: $stateParams.productId
			});

			$scope.product.$promise.then(function() {
				if (!$scope.getFirstIngredient()) {
					$scope.noMoreIngredients = true;
				}
			});
		};

		$scope.showProduct = function(id) {
			$location.path('/products/' + id);
		};

		// Add a new ingredient to the product
		$scope.addIngredient = function() {
			$scope.product.ingredients.push({
				ingredient: this.getFirstIngredient(),
				quantity: 0
			});

			if (!this.getFirstIngredient()) {
				$scope.noMoreIngredients = true;
			}
		};

		$scope.getFirstIngredient = function() {
			return _.find(this.ingredientsList, function(ingr) {
				return !_.find($scope.product.ingredients, function(ing) {
					return ing.ingredient.name === ingr.name;
				});
			});
		};

		// Remove ingredient at a position
		$scope.removeIngredient = function(index) {
			this.product.ingredients.splice(index, 1);
			$scope.noMoreIngredients = false;
		};
	}
]);
