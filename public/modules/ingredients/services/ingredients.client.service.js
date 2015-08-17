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