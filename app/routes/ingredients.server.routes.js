'use strict';

module.exports = function(app) {
	var ingredients = require('../../app/controllers/ingredients.server.controller');

	// Ingredients Routes
	app.route('/ingredients')
		.get(ingredients.list)
		.post(ingredients.create);

	app.route('/ingredients/:ingredientId')
		.get(ingredients.read)
		.put(ingredients.update)
		.delete(ingredients.delete);

	// Finish by binding the Ingredient middleware
	app.param('ingredientId', ingredients.ingredientByID);
};
