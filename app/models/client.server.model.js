'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Client Schema
 */
var ClientSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Client first name',
		trim: true
	},
	surname: {
		type: String,
		default: '',
		required: 'Please fill Client last name',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	phone: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

ClientSchema.index({
	name: 1,
	surname: 1
}, {
	unique: true
});

ClientSchema.virtual('fullname').get(function () {
  return this.name + ' ' + this.surname;
});

ClientSchema.set('toJSON', {virtuals: true});

mongoose.model('Client', ClientSchema);