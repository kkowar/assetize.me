/**
 * AssetPredictionGroup
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	prediction_group_id: 'string',
  	name: 'string',
  	filter: 'json',
  	default: 'boolean',
  	curve: 'json',
  		// Year, OCI
  	create_at: 'datetime',
  	created_by: 'string',
  	update_at: 'datetime',
  	updated_by: 'string'
    
  }

};

// Typically defined by the type of material an asset is comprised of.
// Contains performance curve information defining how a group of assets deteriorate over time.
// Learn More (About Prediction Groups)

// Prediction Groups features:
// Ability to set a default Prediction Group.  If an asset does not fall into any other prediction group filter, the asset will get this Prediction Group.
// Ability to copy points from one condition category to another
// Ability to duplicate an entire Prediction Group
// If an asset qualifies for multiple Prediction Groups, it will not be assigned to any.