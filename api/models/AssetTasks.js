/**
 * AssetTasks
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	id: 'string',
  	activity_id: 'string',
  	status: 'string',
  	estimated_start_date: 'date',
  	actual_start_date: 'date',
  	actual_finish_date: 'date',
  	priority: 'string',
  	total_cost: 'string'
    
  }

};

// Status Options
// Projected
// Planned
// In Progress
// Completed
// Cancelled
