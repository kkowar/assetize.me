/**
 * PavementSegment
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

  	geometry: {
  		type: 'json'
  	},

  	node_1: {
  		type: 'string'
  	},

  	node_2: {
  		type: 'string'
  	},

  	segment_id: {
  		type: 'string',
      required: true
  	},

  	street_name: {
  		type: 'string'
  	},

  	from_street: {
  		type: 'string'
  	},

  	to_street: {
  		type: 'string'
  	},

  	// Prediction Group
  	pavement_classification: {
  		type: 'string'
  	},

  	last_surface_type: {

  	},

  	// Condition Group
  	functional_classification: {
  		type: 'string'
  	},

  	last_pavement_strength: {
  		type: 'string'
  	},

  	street_notes: {
  		type: 'string'
  	},

  	owner: {
  		type: 'string'
  	},

  	district_name: {
  		type: 'string'
  	},

  	section_name: {
  		type: 'string'
  	},

  	city: {
  		type: 'string'
  	},

  	subdivision_name: {
  		type: 'string'
  	},

  	subdivision_name_2: {
  		type: 'string'
  	},

  	subdivision_filing: {
  		type: 'string'
  	},

  	travel_direction: {
  		type: 'string'
  	},

  	number_of_lanes: {
  		type: 'integer'
  	},

  	centerline_length: {
  		type: 'float'
  	},

  	manual_centerline_length: {
  		type: 'float'
  	},

  	lane_length: {
  		type: 'float'
  	},

  	manual_lane_length: {
  		type: 'float'
  	},

  	width: {
  		type: 'float'
  	},

  	row_width: {
  		type: 'float'
  	},

  	area: {
  		type: 'float'
  	},

  	manual_area: {
  		type: 'float'
  	},

  	speed_limit: {
  		type: 'float'
  	},

  	adt_volume: {
  		type: 'float'
  	},

  	user_properties: {
  		type: 'json'
  	},

  	original_construction_date: {
  		type: 'date'
  	},

  	last_inspection_date: {
  		type: 'date'
  	},

  	last_inspection_oci: {
  		type: 'integer'
  	},

  	current_estimated_oci: {
  		type: 'integer'
  	},

  	l_from_address: {
  		type: 'integer'
  	},

  	l_to_address: {
  		type: 'integer'
  	},

  	nw_shoulder_width: {
  		type: 'float'
  	},

  	r_from_address: {
  		type: 'integer'
  	},

  	r_to_address: {
  		type: 'integer'
  	},

  	se_shoulder_width: {
  		type: 'float'
  	}
    
  }

};

// Installed
// Reconstructed
// Retired
// Rehabilitated


