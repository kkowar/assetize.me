/**
 * Style
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,

  attributes: {

  	layerID: {
  		type: 'string',
  		required: true
  	},

  	type: {
  		type: 'string'
  	},

  	attributes: {
  		type: 'json'
  	}
    
  }

};

// Attributes JSON Sub Models

// Simple View

//// Point

//// Line

//// Polygon

	// {
	// 	fill: { color: [color], opacity: [opacity]},
	// 	stroke: { color: [color], opacity: [opacity], width: [width]},
	// 	operation: TODO,
	// 	label: [field_name]
	// }

// Category View

//// Polygon

	// {
	//  field: [field_name],
	// 	fill: {opacity: [opacity]},
	// 	stroke: { color: [color], opacity: [opacity], width: [width]},
	// 	operation: TODO,
	// 	categories: [{value: [field_value], color: [color]}]
	// }
