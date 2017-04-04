'use strict';

module.exports = {
	db: 'mongodb://tekei-web-app:tekei@tekei-test-0-shard-00-00-dilvw.mongodb.net:27017,tekei-test-0-shard-00-01-dilvw.mongodb.net:27017,tekei-test-0-shard-00-02-dilvw.mongodb.net:27017/tekei-sushi?ssl=true&replicaSet=tekei-test-0-shard-0&authSource=admin',
	port: 3001,
	app: {
		title: 'TekeiSushi - Test'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || '"Tekei Sushi [Test]" <qa.tekei-sushi@hotmail.com>',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Hotmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'qa.tekei-sushi@hotmail.com',
				pass: process.env.MAILER_PASSWORD || 'Tekei/123456'
			}
		}
	}
};
