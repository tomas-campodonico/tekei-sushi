'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'tekeisushi';
	var applicationModuleVendorDependencies = ['ngResource', 'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('clients');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('ingredients');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('orders');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('products');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('clients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Clients', 'clients', 'dropdown', '/clients(/create)?', false, null, 2);
		Menus.addSubMenuItem('topbar', 'clients', 'List Clients', 'clients');
		Menus.addSubMenuItem('topbar', 'clients', 'New Client', 'clients/create');
	}
]);
'use strict';

//Setting up route
angular.module('clients').config(['$stateProvider',
	function($stateProvider) {
		// Clients state routing
		$stateProvider.
		state('listClients', {
			url: '/clients',
			templateUrl: 'modules/clients/views/list-clients.client.view.html'
		}).
		state('createClient', {
			url: '/clients/create',
			templateUrl: 'modules/clients/views/create-client.client.view.html'
		}).
		state('viewClient', {
			url: '/clients/:clientId',
			templateUrl: 'modules/clients/views/view-client.client.view.html'
		}).
		state('editClient', {
			url: '/clients/:clientId/edit',
			templateUrl: 'modules/clients/views/edit-client.client.view.html'
		});
	}
]);
'use strict';

// Clients controller
angular.module('clients').controller('ClientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clients',
	function($scope, $stateParams, $location, Authentication, Clients) {
		$scope.authentication = Authentication;

		// Create new Client
		$scope.create = function() {
			// Create new Client object
			var client = new Clients ({
				name: this.name,
				surname: this.surname,
				address: this.address,
				phone: this.phone
			});

			// Redirect after save
			client.$save(function(response) {
				$location.path('clients/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Client
		$scope.remove = function(client) {
			if ( client ) { 
				client.$remove();

				for (var i in $scope.clients) {
					if ($scope.clients [i] === client) {
						$scope.clients.splice(i, 1);
					}
				}
			} else {
				$scope.client.$remove(function() {
					$location.path('clients');
				});
			}
		};

		// Update existing Client
		$scope.update = function() {
			var client = $scope.client;

			client.$update(function() {
				$location.path('clients/' + client._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Clients
		$scope.find = function() {
			$scope.clients = Clients.query();
		};

		// Find existing Client
		$scope.findOne = function() {
			$scope.client = Clients.get({ 
				clientId: $stateParams.clientId
			});
		};

		// Show a new client
		$scope.showClient = function(id) {
			$location.path('/clients/' + id);
		};
	}
]);

'use strict';

//Clients service used to communicate Clients REST endpoints
angular.module('clients').factory('Clients', ['$resource',
	function($resource) {
		return $resource('clients/:clientId', { clientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/orders');
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('ingredients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Ingredients', 'ingredients', 'dropdown', '/ingredients(/create)?', false, null, 3);
		Menus.addSubMenuItem('topbar', 'ingredients', 'List Ingredients', 'ingredients');
		Menus.addSubMenuItem('topbar', 'ingredients', 'New Ingredient', 'ingredients/create');
	}
]);
'use strict';

//Setting up route
angular.module('ingredients').config(['$stateProvider',
	function($stateProvider) {
		// Ingredients state routing
		$stateProvider.
		state('listIngredients', {
			url: '/ingredients',
			templateUrl: 'modules/ingredients/views/list-ingredients.client.view.html'
		}).
		state('createIngredient', {
			url: '/ingredients/create',
			templateUrl: 'modules/ingredients/views/create-ingredient.client.view.html'
		}).
		state('viewIngredient', {
			url: '/ingredients/:ingredientId',
			templateUrl: 'modules/ingredients/views/view-ingredient.client.view.html'
		}).
		state('editIngredient', {
			url: '/ingredients/:ingredientId/edit',
			templateUrl: 'modules/ingredients/views/edit-ingredient.client.view.html'
		});
	}
]);
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

'use strict';

//Ingredients service used to communicate Ingredients REST endpoints
angular.module('ingredients').factory('Ingredients', ['$resource',
	function($resource) {
		return $resource('ingredients/:ingredientId', { ingredientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('orders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Orders', 'orders', 'dropdown', '/orders(/create)?', false, null, 0);
		Menus.addSubMenuItem('topbar', 'orders', 'List Orders', 'orders');
		Menus.addSubMenuItem('topbar', 'orders', 'New Order', 'orders/create');
	}
]);
'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/list-orders.client.view.html'
		}).
		state('createOrder', {
			url: '/orders/create',
			templateUrl: 'modules/orders/views/create-order.client.view.html'
		}).
		state('viewOrder', {
			url: '/orders/:orderId',
			templateUrl: 'modules/orders/views/view-order.client.view.html'
		}).
		state('editOrder', {
			url: '/orders/:orderId/edit',
			templateUrl: 'modules/orders/views/edit-order.client.view.html'
		});
	}
]);
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

angular.module('orders').controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "clients", function($scope, $modalInstance, clients) {
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
}]);

'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
	function($resource) {
		return $resource('orders/:orderId', { orderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('products').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Products', 'products', 'dropdown', '/products(/create)?', false, null, 1);
		Menus.addSubMenuItem('topbar', 'products', 'List Products', 'products');
		Menus.addSubMenuItem('topbar', 'products', 'New Product', 'products/create');
	}
]);
'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('listProducts', {
			url: '/products',
			templateUrl: 'modules/products/views/list-products.client.view.html'
		}).
		state('createProduct', {
			url: '/products/create',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
		state('viewProduct', {
			url: '/products/:productId',
			templateUrl: 'modules/products/views/view-product.client.view.html'
		}).
		state('editProduct', {
			url: '/products/:productId/edit',
			templateUrl: 'modules/products/views/edit-product.client.view.html'
		});
	}
]);
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

'use strict';

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('products/:productId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);