'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ingredient = mongoose.model('Ingredient'),
	_ = require('lodash');

/**
 * Create an Ingredient
 */
exports.create = function(req, res) {
	var ingredient = new Ingredient(req.body);

	Ingredient.findOne({
		name: ingredient.name
	}, function(err, existingIngredient) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

		if (existingIngredient) {
			return res.status(400).send({
				message: 'There is already an ingredient with that name'
			});
		}

		// Then save the ingredient
		ingredient.user = req.user;
		ingredient.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(ingredient);
			}
		});
	});
};

/**
 * Show the current Ingredient
 */
exports.read = function(req, res) {
	res.jsonp(req.ingredient);
};

/**
 * Update an Ingredient
 */
exports.update = function(req, res) {
	var ingredient = req.ingredient ;

	ingredient = _.extend(ingredient , req.body);

	Ingredient.findOne({
		name: ingredient.name
	}, function(err, existingIngredient) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

		if (existingIngredient && !existingIngredient._id.equals(ingredient._id)) {
			return res.status(400).send({
				message: 'There is already an ingredient with that name'
			});
		}

		// Then save the ingredient
		ingredient.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(ingredient);
			}
		});
	});
};

/**
 * Delete an Ingredient
 */
exports.delete = function(req, res) {
	var ingredient = req.ingredient ;

	ingredient.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ingredient);
		}
	});
};

/**
 * List of Ingredients
 */
exports.list = function(req, res) { 
	Ingredient.find().sort('-created').populate('user', 'displayName').exec(function(err, ingredients) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ingredients);
		}
	});
};

/**
 * Ingredient middleware
 */
exports.ingredientByID = function(req, res, next, id) { 
	Ingredient.findById(id).populate('user', 'displayName').exec(function(err, ingredient) {
		if (err) return next(err);
		if (! ingredient) return next(new Error('Failed to load Ingredient ' + id));
		req.ingredient = ingredient ;
		next();
	});
};

/**
 * Ingredient authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ingredient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
