'use strict';

module.exports = {
	app: {
		title: 'TekeiSushi',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'tekei_sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
				'public/lib/toggle/dist/toggle.css',
				'public/lib/angular-material/angular-material.min.css'
			],
			js: [
				'public/lib/moment/moment.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-animate/angular-animate.min.js',
  				'public/lib/angular-aria/angular-aria.min.js',
  				'public/lib/angular-messages/angular-messages.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/underscore/underscore-min.js',
				'public/lib/angular-moment/angular-moment.js',
				'public/lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
				'public/lib/angular-material/angular-material.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
