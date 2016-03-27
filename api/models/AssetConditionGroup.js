/**
 * AssetConditionGroup
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	asset_type_id: 'string',
  	name: 'string',
  	minimum_index: 'integer',
  	minimum_rating: 'string',
  	filter: 'json',
  	default: 'boolean'
    
  }

};

// Typically defined by an asset's functional use.
// Contains the minimum acceptable condition information for a group of assets.
// Learn More About Condition Groups

// Condition Groups features:
// Ability to set a default Condition Group.  If an asset does not fall into any other condition group filter, the asset will get this Condition Group.
// Minimum Rating field automatically populates
// If an asset qualifies for multiple Condition Groups, it will not be assigned to any.