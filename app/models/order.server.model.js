'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	client: {
		type: Schema.ObjectId,
		ref: 'Client'
	},
	address: {
		type: String,
		required: 'Please fill the address'
	},
	phone: {
		type: String,
		required: 'Please fill the phone number'
	},
	products: [{
		product: {
			type: Schema.ObjectId,
			ref: 'Product'
		},
		quantity: Number
	}],
	created: {
		type: Date,
		default: new Date()
	},
	deliveryDate: {
		type: Date,
		required: 'Select a valid date.'
	},
	delivered: {
		type: Boolean,
		default: false
	},
	cancelled: {
		type: Boolean,
		default: false
	},
	price: {
		type: Number
	},
	discount: {
		type: Number,
		default: 0
	}
});

mongoose.model('Order', OrderSchema);
