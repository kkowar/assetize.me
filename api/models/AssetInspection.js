/**
 * AssetInspection
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
    created_at: 'datetime',
    created_by: 'string',
    updated_at: 'datetime',
    updated_by: 'string',
  	pavement_segment_id: 'string',
  	inspection_date: 'date',
  	condition_category_index: 'string',
  	average_iri: 'integer',
  	overall_condition_index: 'integer',
  	surface_distress_index: 'integer',
  	smoothness_index: 'integer',
    status: 'string'
    
  }

};

// Check LUcity Severity Density Grid
// Extent vs Severity
// Extent
//None, Few, Intermittent, Frequent, Extensive, Throughout
// Severity
//Low, Moderate, Severe