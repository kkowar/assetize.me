/**
 * Feature
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	fcID: {
      type: 'string',  
      required: true
  	},
    fID: {
      type: 'string',
    },
    properties: {
      type: 'json'
    },
    geometry: {
      type: 'json'
    },
    xml: {
      type: 'string'
    }
    
  }

};
