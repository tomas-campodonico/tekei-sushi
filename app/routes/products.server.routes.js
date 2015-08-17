'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var products = require('../../app/controllers/products.server.controller');

	// Products Routes
	app.route('/products')
		.get(users.requiresLogin, products.list)
		.post(users.requiresLogin, products.create);

	app.route('/products/:productId')
		.get(users.requiresLogin, products.read)
		.put(users.requiresLogin, products.update)
		.delete(users.requiresLogin, products.delete);

	// Finish by binding the Product middleware
	app.param('productId', products.productByID);
};
