'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Product name',
		trim: true
	},
	price: {
		type: Number,
		default: 0,
		required: 'Please fill the product\'s price'
	},
	ingredients: [{
		ingredient: String,
		quantity: Number
	}]
});

ProductSchema.index({name: 1}, {unique: true});

mongoose.model('Product', ProductSchema);