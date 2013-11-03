/**
 * Layer
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
      // todo: required: true
  	},
    
    name: {
      type: 'string'
    },
    
    fcID: {
      type: 'string',
      required: true
    },

    filters: {
      type: 'json'
    },
    
    styles: {
      type: 'json',
      required: true
    },
    
    sortOrder: {
      type: 'integer'
    },

    visible: {
      type: 'boolean',
      required: true
    },

    geometryType: {
      type: 'string'
    },

    totalFeatures: {
      type: 'integer'
    },

    zIndex: {
      type: 'integer'
    }
    
  }

};
