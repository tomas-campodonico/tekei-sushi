'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
	'Ingredients',
	function($scope, $stateParams, $location, Authentication, Products, Ingredients) {
		$scope.authentication = Authentication;

		$scope.ingredients = [];

		var sumIngredients = function(ingrs) {
			var ingredients = {};
			var result = [];
			for (var i = 0; i < ingrs.length; i++) {
				if (ingredients[ingrs[i].ingredient._id]) {
					ingredients[ingrs[i].ingredient._id].quantity += ingrs[i].quantity;
				} else {
					ingredients[ingrs[i].ingredient._id] = {
						quantity: ingrs[i].quantity,
						ingredient: ingrs[i].ingredient._id
					};
				}
			}

			for (var ing in ingredients) {
				result.push(ingredients[ing]);
			}

			return result;
		};

		$scope.fetchIngredients = function() {
			$scope.ingredientsList = Ingredients.query();
		};

		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = new Products({
				name: this.name,
				price: this.price,
				ingredients: sumIngredients(this.ingredients)
			});

			// Redirect after save
			product.$save(function(response) {
				$location.path('products/' + response._id);

				// Clear form fields
				$scope.name = '';
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
		};

		$scope.showProduct = function(id) {
			$location.path('/products/' + id);
		};

		// Add a new ingredient to the product
		$scope.addIngredient = function() {
			this.product.ingredients.push({
				ingredient: this.ingredientsList[0],
				quantity: 0
			});
		};

		// Remove ingredient at a position
		$scope.removeIngredient = function(index) {
			this.product.ingredients.splice(index, 1);
		};
	}
]);
