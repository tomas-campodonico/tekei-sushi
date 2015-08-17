'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ingredient = mongoose.model('Ingredient'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ingredient;

/**
 * Ingredient routes tests
 */
describe('Ingredient CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Ingredient
		user.save(function() {
			ingredient = {
				name: 'Ingredient Name'
			};

			done();
		});
	});

	it('should be able to save Ingredient instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingredient
				agent.post('/ingredients')
					.send(ingredient)
					.expect(200)
					.end(function(ingredientSaveErr, ingredientSaveRes) {
						// Handle Ingredient save error
						if (ingredientSaveErr) done(ingredientSaveErr);

						// Get a list of Ingredients
						agent.get('/ingredients')
							.end(function(ingredientsGetErr, ingredientsGetRes) {
								// Handle Ingredient save error
								if (ingredientsGetErr) done(ingredientsGetErr);

								// Get Ingredients list
								var ingredients = ingredientsGetRes.body;

								// Set assertions
								(ingredients[0].user._id).should.equal(userId);
								(ingredients[0].name).should.match('Ingredient Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ingredient instance if not logged in', function(done) {
		agent.post('/ingredients')
			.send(ingredient)
			.expect(401)
			.end(function(ingredientSaveErr, ingredientSaveRes) {
				// Call the assertion callback
				done(ingredientSaveErr);
			});
	});

	it('should not be able to save Ingredient instance if no name is provided', function(done) {
		// Invalidate name field
		ingredient.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingredient
				agent.post('/ingredients')
					.send(ingredient)
					.expect(400)
					.end(function(ingredientSaveErr, ingredientSaveRes) {
						// Set message assertion
						(ingredientSaveRes.body.message).should.match('Please fill Ingredient name');
						
						// Handle Ingredient save error
						done(ingredientSaveErr);
					});
			});
	});

	it('should be able to update Ingredient instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingredient
				agent.post('/ingredients')
					.send(ingredient)
					.expect(200)
					.end(function(ingredientSaveErr, ingredientSaveRes) {
						// Handle Ingredient save error
						if (ingredientSaveErr) done(ingredientSaveErr);

						// Update Ingredient name
						ingredient.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ingredient
						agent.put('/ingredients/' + ingredientSaveRes.body._id)
							.send(ingredient)
							.expect(200)
							.end(function(ingredientUpdateErr, ingredientUpdateRes) {
								// Handle Ingredient update error
								if (ingredientUpdateErr) done(ingredientUpdateErr);

								// Set assertions
								(ingredientUpdateRes.body._id).should.equal(ingredientSaveRes.body._id);
								(ingredientUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ingredients if not signed in', function(done) {
		// Create new Ingredient model instance
		var ingredientObj = new Ingredient(ingredient);

		// Save the Ingredient
		ingredientObj.save(function() {
			// Request Ingredients
			request(app).get('/ingredients')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ingredient if not signed in', function(done) {
		// Create new Ingredient model instance
		var ingredientObj = new Ingredient(ingredient);

		// Save the Ingredient
		ingredientObj.save(function() {
			request(app).get('/ingredients/' + ingredientObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ingredient.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ingredient instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingredient
				agent.post('/ingredients')
					.send(ingredient)
					.expect(200)
					.end(function(ingredientSaveErr, ingredientSaveRes) {
						// Handle Ingredient save error
						if (ingredientSaveErr) done(ingredientSaveErr);

						// Delete existing Ingredient
						agent.delete('/ingredients/' + ingredientSaveRes.body._id)
							.send(ingredient)
							.expect(200)
							.end(function(ingredientDeleteErr, ingredientDeleteRes) {
								// Handle Ingredient error error
								if (ingredientDeleteErr) done(ingredientDeleteErr);

								// Set assertions
								(ingredientDeleteRes.body._id).should.equal(ingredientSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ingredient instance if not signed in', function(done) {
		// Set Ingredient user 
		ingredient.user = user;

		// Create new Ingredient model instance
		var ingredientObj = new Ingredient(ingredient);

		// Save the Ingredient
		ingredientObj.save(function() {
			// Try deleting Ingredient
			request(app).delete('/ingredients/' + ingredientObj._id)
			.expect(401)
			.end(function(ingredientDeleteErr, ingredientDeleteRes) {
				// Set message assertion
				(ingredientDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ingredient error error
				done(ingredientDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ingredient.remove().exec();
		done();
	});
});