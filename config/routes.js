/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // }
  '/': {
    view: 'home/index'
  },
  '/map/tiles/:layerID/:z/:x/:y.png': {
    controller: 'MapController',
    action: 'tiles'
  },
  '/map/tiles/:layerID/:z/:x/:y.pbf': {
    controller: 'MapController',
    action: 'tiles'
  },
  '/map/tiles/:layerID/:z/:x/:y.grid.json': {
    controller: 'MapController',
    action: 'tiles'
  },
  '/table/stats': {
    controller: 'TableController',
    action: 'stats'
  },
  'DELETE /table': {
    controller: 'TableController',
    action: 'destroy'
  },
  // '/table/delete': {
  //   controller: 'TableController',
  //   action: 'destroy'
  // },
  // '/table/search': {
  //   controller: 'TableController',
  //   action: 'search'
  // },
  '/table/filter': {
    controller: 'TableController',
    action: 'filter'
  },
  '/table/:id': {
    controller: 'TableController',
    action: 'show'
  }

  // TODO
  // /table/column/add,delete,rename,filter
  // /table/row/add,delete

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
