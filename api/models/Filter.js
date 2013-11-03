/**
 * Filter
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,

  attributes: {

  	userID: {
  		type: 'string'
  	},

  	layerID: {
  		type: 'string',
  		required: true
  	},

  	field: {
  		type: 'string'
  	},

  	operator: {
  		type: 'string'
  	},

  	value: {
  		type: 'string'
  	},

  	count: {
  		type: 'integer'
  	}
    
  }

};

// {
// 	'userID': Meteor.userId(), 
//   'fcID': fcID,
//   'name': fc.name,
//   'field': field, 
//   'operator': operator, 
//   'value': value, 
//   'color': color,
//   'count': 0,
//   'visible': true
// }
