'use strict';

module.exports = function(app) {
	var clients = require('../../app/controllers/clients.server.controller');

	// Clients Routes
	app.route('/clients')
		.get(clients.list)
		.post(clients.create);

	app.route('/clients/:clientId')
		.get(clients.read)
		.put(clients.update)
		.delete(clients.delete);

	// Finish by binding the Client middleware
	app.param('clientId', clients.clientByID);
};
