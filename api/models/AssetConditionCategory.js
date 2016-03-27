/**
 * AssetConditionCategory
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	asset_type_id: 'string',
  	name: 'string',
  	weight: 'integer'
    
  }

};

// Typically defined by observed characteristics of an asset.
// Contains the weight of the impact this condition category has on the asset's Overall Condition Index (OCI).
// Allows the selection of Condition Details.
// Allows editing of Index Mappings and Impacts.

// Condition Categories features:
// Ability to select a Condition Category Type for each condition category.
// Ability to set up Index Mapping records.Ability to set the order the condition categories appear in Inspections.
// Ability to add Condition Detail fields to appear in Inspections.
// Ability to copy Index Mappings from one condition category to another.
// Ability to copy Impacts from one condition category to another.