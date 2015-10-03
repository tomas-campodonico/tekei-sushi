'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Orders', 'Products', 'Clients',
	function($scope, $stateParams, $location, $modal, Authentication, Orders, Products, Clients) {
		$scope.authentication = Authentication;

		$scope.createEmpty = function() {
			$scope.order = new Orders({
				delivered: false,
				deliveryDate: moment(new Date()).format('DD/MM/YYYY hh:mm a'),
				discount: 0,
				price: 0,
				created: new Date(),
				products: []
			});

			$scope.newClientName = '';
			$scope.validName = true;
		};

		$scope.notDeliveredFilter = true;

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
			var names = $scope.newClientName.split(' ');

			$scope.validName = names.length >= 2 && !_.findWhere($scope.clients, {
				fullname: $scope.newClientName
			});
		};

		// Select client
		$scope.selectClient = function() {
			if (this.order.client) {
				//update address and phone
				$scope.order.address = $scope.order.client.address;
				$scope.order.phone = $scope.order.client.phone;
			}
		};

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = this.order;
			order.client = this.order.client || 0;
			order.clientName = this.newClientName;
			order.deliveryDate = angular.element(document.getElementById('datetimepicker')).data('DateTimePicker').date().format();

			// Redirect after save
			order.$save(function(response) {
				$location.path('orders/' + response._id);
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
			$scope.order.products.push({
				product: this.productList[0],
				quantity: 0
			});
		};

		// Remove product from the order
		$scope.removeProduct = function(index) {
			this.order.products.splice(index, 1);
			this.updatePrice();
		};

		// Update total price based on products and discount
		$scope.updatePrice = function() {
			var price = this.order.products.reduce(function(prev, product) {
				return prev + product.product.price * product.quantity;
			}, 0);

			$scope.order.price = price - (price * $scope.order.discount / 100);
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
				$scope.order.client = selectedItem;
				$scope.selectClient();
			});
		};

		$scope.showOrder = function(id) {
			$location.path('/orders/' + id);
		};

		$scope.changeStatus = function(id, code, $event) {
			var order = _.findWhere($scope.orders, {
				_id: id
			});
			var clientObj = order.client;

			if (code === 1) {
				order.delivered = !order.delivered;
			} else {
				order.cancelled = !order.cancelled;
				order.delivered = false;
			}

			order.client = order.client._id;
			order.$update(function() {
				order.client = clientObj;
			});

			$event.stopPropagation();
			$event.preventDefault();
		};

		$scope.closeAlert = function() {
			$scope.error = null;
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
