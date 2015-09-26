'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ingredient Schema
 */
var IngredientSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ingredient name',
		trim: true
	},
	quantity: {
		type: Number,
		default: 0
	},
	unit: {
		value: {
			type: String,
			default: 'gr'
		},
		title: {
			type: String,
			default: 'Gr.'
		}
		
	}
});

IngredientSchema.index({name: 1}, {unique: true});

IngredientSchema.virtual('amount').get(function () {
  return this.quantity + this.unit.title;
});

IngredientSchema.set('toJSON', {virtuals: true});

mongoose.model('Ingredient', IngredientSchema);
