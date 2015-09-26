'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Order = mongoose.model('Order'),
	Client = mongoose.model('Client'),
	Product = mongoose.model('Product'),
	Ingredient = mongoose.model('Ingredient'),
	_ = require('lodash');

/*
 * Updates the stock of each ingredient of the order
 */
var updateStock = function(order, increase) {
	_.forEach(order.products, function(product) {
		Product.findById(product.product).exec(function(err, prod) {
			if (err) throw err;

			_.forEach(prod.ingredients, function(ingredient) {
				Ingredient.findById(ingredient.ingredient).exec(function(err, ingred) {
					if (err) throw err;

					if (increase) {
						ingred.quantity = ingred.quantity + (ingredient.quantity * product.quantity);
					} else {
						ingred.quantity = ingred.quantity - (ingredient.quantity * product.quantity);
						if (ingred.quantity < 0) ingred.quantity = 0;
					}

					ingred.save();
				});
			});
		});
	});
};

/**
 * Create a Order
 */
exports.create = function(req, res) {
	//Keep only products id
	for (var i = 0; i < req.body.products.length; i++) {
		req.body.products[i].product = req.body.products[i].product._id;
	}

	if (req.body.client === 0 && req.body.clientName) {
		// Create new client
		var names = req.body.clientName.split(' ');
		var name = names[0];
		names.shift();

		var client = new Client({
			name: name,
			surname:  names.join(' '),
			address: req.body.address,
			phone: req.body.phone
		});

		client.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.body.client = client.id;
				var order = new Order(req.body);

				order.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(order);
					}
				});
			}
		});
	} else {
		var order = new Order(req.body);

		order.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(order);
			}
		});
	}
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
	var order = req.order;

	if (!req.order.delivered && req.body.delivered) {
		updateStock(req.body);
	} else if (req.order.delivered && !req.body.delivered) {
		updateStock(req.body, true);
	}

	order = _.extend(order, req.body);

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
	var order = req.order;

	order.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
	Order.find().sort('-created').populate('user', 'displayName').exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
	Order.findById(id).populate('products.product').populate('client').exec(function(err, order) {
		if (err) return next(err);
		if (!order) return next(new Error('Failed to load Order ' + id));
		req.order = order;
		next();
	});
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
