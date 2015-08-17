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