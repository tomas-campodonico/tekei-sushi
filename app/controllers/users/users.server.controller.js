'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors.server.controller'),
	  _ = require('lodash'),
	  mongoose = require('mongoose'),
	  User = mongoose.model('User');

exports.list = function(req, res) {
	User.find({}, 'firstName lastName email username accepted roles created').sort('displayName').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};
