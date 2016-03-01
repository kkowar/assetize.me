/**
 * PdfController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  index: function(req,res) {
  	var wkhtmltopdf = require('wkhtmltopdf');
  	// console.log(wkhtmltopdf);
  	wkhtmltopdf("http://localhost:1337/map",{'page-height': "11in", 'page-width': "17in","enable-javascript": true,'javascript-delay': 20000}).pipe(res);
  	// res.json({message: "success"})
  // 	var page = require('webpage').create();
		// page.open('http://github.com/', function () {
		//     page.render('github.png').pipe(res);
		//     phantom.exit();
		// });

// var childProcess = require('child_process')

// var phantomjs = require('../lib/phantomjs')

		// var childProcess = require('child_process');
		// var fs = require('fs')
		// var path = require('path')
		// var phantomjs = require('phantomjs');
		// var binPath = "/node_modules/phantomjs/bin";

		// var childArgs = [
		//   path.join(__dirname, 'phantomjs-script.js'),
		//   {url: "http://www.phantomjs.org/"}
		// ]

		// childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
		// 	res.render(stdout);
		// })
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PdfController)
   */
  _config: {}

  
};
