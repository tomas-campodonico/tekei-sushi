'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Orders', 'Products', 'Clients',
	function($scope, $stateParams, $location, $modal, Authentication, Orders, Products, Clients) {
		$scope.authentication = Authentication;

		$scope.products = [];
		$scope.discount = 0;
		$scope.price = 0;
		$scope.clientSelected = false;

		// Fetch client's and product's info
		$scope.fetchClientsAndProducts = function() {
			$scope.clients = Clients.query();
			$scope.productList = Products.query();
		};

		// Select client in dropdown
		$scope.selectClient = function() {
			if (typeof this.client !== 'string') {
				this.client = JSON.stringify(this.client);
			}
			this.clientSelected = this.client;
			if (this.client) {
				this.phone = JSON.parse(this.client).phone;
				this.address = JSON.parse(this.client).address;
			} else {
				this.phone = '';
				this.address = '';
			}
		};

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders({
				client: JSON.parse(this.client)._id || 0,
				address: this.address,
				phone: this.phone,
				delivered: false,
				deliveryDate: this.date,
				products: this.cleanUpProducts()
			});

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if (order) {
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders[i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({
				orderId: $stateParams.orderId
			});
		};

		// Add a new empty product to the order
		$scope.addProduct = function() {
			this.products.push({
				product: this.productList[0],
				quantity: 0
			});
		};

		// Remove product from the order
		$scope.removeProduct = function(index) {
			this.products.splice(index, 1);
			this.updatePrice();
		};

		// Update total price based on products and discount
		$scope.updatePrice = function() {
			var price = 0;

			for (var i = 0; i < this.products.length; i++) {
				price += (this.products[i].product.price * this.products[i].quantity);
			}

			$scope.price = price - (price * $scope.discount / 100);
		};

		// Return the array of products ready to be saved
		$scope.cleanUpProducts = function() {
			for (var i = 0; i < this.products.length; i++) {
				this.products[i].product = this.products[i].product._id;
			}

			return this.products;
		};

		// Open the modal to search a client
		$scope.openModal = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: 'lg',
				resolve: {
					clients: function() {
						return $scope.clients;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				$scope.client = selectedItem;
				$scope.selectClient();
			});
		};
	}
]);

angular.module('orders').controller('ModalInstanceCtrl', function ($scope, $modalInstance, clients) {

  $scope.clients = clients;
  $scope.phoneFilter = '';
  $scope.selected = {
    client: $scope.clients[0]
  };

  $scope.selectClientInModal = function () {
    $modalInstance.close($scope.selected.client);
  };

  $scope.dismissModal = function () {
    $modalInstance.dismiss('cancel');
  };
});