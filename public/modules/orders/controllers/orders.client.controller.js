'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Orders', 'Products', 'Clients',
	function($scope, $stateParams, $location, $modal, Authentication, Orders, Products, Clients) {
		$scope.authentication = Authentication;

		$scope.order = new Orders({
			delivered: false,
			date: new Date(),
			deliveryDate: moment(new Date()).format('DD/MM/YYYY hh:mm a'),
			discount: 0,
			price: 0
		});
		$scope.products = [];
		$scope.newClientName = '';
		$scope.validName = true;
		$scope.clientSelected = null;

		// Fetch client's and product's info
		$scope.fetchClientsAndProducts = function() {
			$scope.clients = Clients.query();
			$scope.productList = Products.query();

			var date = angular.element(document.getElementById('datetimepicker'));
			date.datetimepicker({
				format: 'DD/MM/YYYY hh:mm a',
				minDate: new Date(),
				defaultDate: new Date()
			});
		};

		// Check if there is a client with the given name and surname
		$scope.validateClientName = function() {
			$scope.validName = !_.findWhere($scope.clients, {
				fullname: $scope.newClientName
			});
		};

		// Select client
		$scope.selectClient = function() {
			if (this.client) {
				this.clientSelected = Clients.get({
					clientId: this.client
				}, function() {
					//update address and phone
					$scope.order.address = $scope.clientSelected.address;
					$scope.order.phone = $scope.clientSelected.phone;
				});


			}
		};

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = this.order;
			order.client = this.client || 0;
			order.clientName = this.newClientName;
			order.products = this.cleanUpProducts();
			order.deliveryDate = angular.element(document.getElementById('datetimepicker')).data('DateTimePicker').date().format();

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
			$scope.clients = Clients.query();
			$scope.orders = Orders.query(function() {
				_.forEach($scope.orders, function(order) {
					order.client = _.findWhere($scope.clients, {id: order.client});
				});
			});
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

			$scope.order.price = price - (price * $scope.order.discount / 100);
		};

		// Return the array of products ready to be saved
		$scope.cleanUpProducts = function() {
			for (var i = 0; i < this.products.length; i++) {
				this.products[i].product = this.products[i].product._id;
			}

			return this.products;
		};

		// Open the modal to search a client
		$scope.openModal = function() {
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
				$scope.client = selectedItem.id;
				$scope.selectClient();
			});
		};

		$scope.showOrder = function(id) {
			$location.path('/orders/' + id);
		};
	}
]);

angular.module('orders').controller('ModalInstanceCtrl', function($scope, $modalInstance, clients) {

	$scope.clients = clients;
	$scope.phoneFilter = '';
	$scope.selected = {
		client: $scope.clients[0]
	};

	$scope.selectClientInModal = function() {
		$modalInstance.close($scope.selected.client);
	};

	$scope.dismissModal = function() {
		$modalInstance.dismiss('cancel');
	};
});