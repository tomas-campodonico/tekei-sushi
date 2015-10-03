'use strict';

module.exports = function(app) {
	var orders = require('../../app/controllers/orders.server.controller');

	// Orders Routes
	app.route('/orders')
		.get(orders.list)
		.post(orders.create);

	app.route('/orders/:orderId')
		.get(orders.read)
		.put(orders.hasAuthorization, orders.update)
		.delete(orders.hasAuthorization, orders.delete);

	// Finish by binding the Order middleware
	app.param('orderId', orders.orderByID);
};
