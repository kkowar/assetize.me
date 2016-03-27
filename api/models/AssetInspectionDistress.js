/**
 * AssetInspectionDistress
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	pavement_segment_id: 'string',
  	pavement_inspection_id: 'string',
  	pavement_sample_id: 'string',
  	sample_to_station: 'integer',
  	sample_from_station: 'integer',
  	sample_length: 'integer',
  	sample_width: 'integer',
  	distress: 'string',
  	severity: 'string',
  	extent: 'float'
    
  }

};