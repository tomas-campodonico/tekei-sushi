'use strict';

(function() {
	// Ingredients Controller Spec
	describe('Ingredients Controller Tests', function() {
		// Initialize global variables
		var IngredientsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Ingredients controller.
			IngredientsController = $controller('IngredientsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ingredient object fetched from XHR', inject(function(Ingredients) {
			// Create sample Ingredient using the Ingredients service
			var sampleIngredient = new Ingredients({
				name: 'New Ingredient'
			});

			// Create a sample Ingredients array that includes the new Ingredient
			var sampleIngredients = [sampleIngredient];

			// Set GET response
			$httpBackend.expectGET('ingredients').respond(sampleIngredients);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ingredients).toEqualData(sampleIngredients);
		}));

		it('$scope.findOne() should create an array with one Ingredient object fetched from XHR using a ingredientId URL parameter', inject(function(Ingredients) {
			// Define a sample Ingredient object
			var sampleIngredient = new Ingredients({
				name: 'New Ingredient'
			});

			// Set the URL parameter
			$stateParams.ingredientId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ingredients\/([0-9a-fA-F]{24})$/).respond(sampleIngredient);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ingredient).toEqualData(sampleIngredient);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ingredients) {
			// Create a sample Ingredient object
			var sampleIngredientPostData = new Ingredients({
				name: 'New Ingredient'
			});

			// Create a sample Ingredient response
			var sampleIngredientResponse = new Ingredients({
				_id: '525cf20451979dea2c000001',
				name: 'New Ingredient'
			});

			// Fixture mock form input values
			scope.name = 'New Ingredient';

			// Set POST response
			$httpBackend.expectPOST('ingredients', sampleIngredientPostData).respond(sampleIngredientResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ingredient was created
			expect($location.path()).toBe('/ingredients/' + sampleIngredientResponse._id);
		}));

		it('$scope.update() should update a valid Ingredient', inject(function(Ingredients) {
			// Define a sample Ingredient put data
			var sampleIngredientPutData = new Ingredients({
				_id: '525cf20451979dea2c000001',
				name: 'New Ingredient'
			});

			// Mock Ingredient in scope
			scope.ingredient = sampleIngredientPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ingredients\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ingredients/' + sampleIngredientPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ingredientId and remove the Ingredient from the scope', inject(function(Ingredients) {
			// Create new Ingredient object
			var sampleIngredient = new Ingredients({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ingredients array and include the Ingredient
			scope.ingredients = [sampleIngredient];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ingredients\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIngredient);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ingredients.length).toBe(0);
		}));
	});
}());