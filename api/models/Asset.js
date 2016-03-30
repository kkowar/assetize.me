/**
 * Asset
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	name: {
  	  type: 'string',
      required: true
  	},

    properties: {
      type: 'json'
    },

  	activities: {
  		type: 'json'
  		// name: string
  		// impact: absolute, %, relative
  		// type: maintenance, construction, inspection, administration

  		// NOTE: Activities attach to Triggers.
  	},

		forecasts: {
			type: 'json'
			// Default: boolean
			// Has Many:
		  	//qualities: 'json',
		  		// Name: string
		  		// Weight: float
		  		// Inspection_Types: 5 Star, Index, Number, Quantity Option
		  		// Index_Mappings:
		  			// Name: string
		  			// From: number
		  			// To: number
		  			// Value: string/number
		  		// Performance_Curve: Array[Year,Value]
		},

		characteristic_groups: {
			type: 'json'
	  	// Name: string
	  	// Minimum_Acceptable_Index: float
	  	// Minimum_Acceptable_Rating: Lookup
	  	// Filter: 'json'
	  	// Default: boolean
  	},

    // Point, Line, Multiline, Polygon, Undefined
    geometryType: { 
      type: 'string'
    },

    totalFeatures: {
      type: 'integer'
    }
    
  }

};


// Protocols



// Triggers

	// Preventative Maintenance Triggers
	// You must be a Cartegraph Administrator to do this task.

	// You must have an advanced feature extension to access this feature.

	// Preventative Maintenance plans create Tasks based on the triggers set for their associated asset types or equipment. Cartegraph Preventative Maintenance plans have four trigger types, Condition, Usage, Time, and Repeat.

	// Condition

	// Condition-based triggers evaluate the condition of a set of assets. Only one Condition trigger is allowed per plan activity.

	// Condition triggers are set for Estimated OCI, Inspected OCI, or Minimum is Reached and a specified index. When the OCI falls below the specific value, a task is created for the plan activity.

	// For example, Regulatory Signs need Inspection or Repair when the Estimated OCI condition falls below 60. A new Inspect or Repair Task is generated on the day the Estimated OCI falls below the user-specified value. The Inspector inspects or repairs the Sign and the Sign’s Estimated OCI changes. Next time OCI falls below 60 another Task is created.

	// Usage

	// Usage triggers apply to Equipment records and work best when combined with Time trigger.

	// Only one Usage trigger is allowed per plan activity.

	// The activity is scheduled based on a specified number of units—miles, kilometers, or hours. This unit automatically displays based on the Meter Type selected for the classification.

	// All the equipment records included in a plan with a Usage trigger must be assigned a classification and all of the units must be the same.

	// Time

	// Time-based triggers create Tasks for a set of assets based on a specified frequency. Only one Time trigger is allowed per plan activity. Cartegraph has the ability specify if Tasks are created if another task of the same activity type or on the specified interval.

	// For example, a water hydrant should be flushed once a year. A Task to flush the hydrant was created on year ago today. A new Task for the hydrant is supposed to be created today for this year.      

	// If the previous year task was already completed then the new Task is created one year from that completion date.       
	// If last year’s task was not completed, the new task does not get created. Once completed, the new task gets created one year from the completion date.     
	// Repeat

	// Repeat-based triggers create Tasks for a set of assets based on specific intervals.

	// If a Repeat trigger is used on a Plan’s activity this is the only trigger allowed for that activity.

	// For example, Storm Outfall must be inspected monthly. A Preventative Maintenance plan can be setup for Inspect Activity using Repeat Trigger that runs once a month starting from the install date.

// Activities
	
	// Can be Checked to modify initial, replace, retire
	// Can be: Maintenance, Construction, Inspection, Administration
	// About the Activity Impact on Asset Condition
	// You must have an advanced feature extension to access this feature.

	// This relates to Signs only without the advanced feature extension, or for any asset with the extension.

	// Corrective or preventative maintenance activities are performed to extend the asset’s life. The Asset Condition Categories/Impact library contains the impact of activities that extend the asset’s life. The activity’s impact is calculated to update that individual condition category.

	// For example, a park bench with condition categories of Aesthetics, Structure, and Surface. The following shows which activity impacts a condition category:

	// Activity
	 
	// Condition Category
	// Paint
	// Impacts
	// Aesthetics
	// Realignment
	// Impacts
	// Structure
	// Stain
	// Impacts
	// Surface
	// Activity impacts affect the individual condition category and increase the asset’s overall condition rating (OCR).
	// Impacts are expressed as:      
	// Absolute—resets the overall condition index (OCI) to the number indicated       
	// Relative—increases the index by the number indicated       
	// %— increases the index by the percent indicated     
	// For example, an asset has a Condition Category index of 50. A maintenance activity is performed with an impact factor of 75%. The estimated index for the condition category increases by 75% to 87.5.

	// Single Activity Recommendation
	// You must be a Cartegraph Administrator to do this task.

	// You must have an advanced feature extension to access this feature.

	// When an asset has multiple activities which qualify in a single year, those activities are sorted based on the selection criteria identified below. If activities have the same key value-the same cost when using the Lowest Cost option-they sub sort alphabetically by activity name. For example, a key value is the same cost when using the Lowest Cost option. If the first activity in the list does not meet scenario type constraints, like budget, the next activity is checked until one or no activity is performed on the asset before moving on to the next asset.

	// First Qualifying

	// What it Does: The activity with the earliest Projected Date in the plan year is chosen.
	// Intended Use: Perform whichever activity should occur first.  For every asset included in the plan year, this performs the earliest recommended activity in that plan year.  
	// Highest Impact

	// What is Impact? The difference between an asset's OCI before an activity is performed against the OCI of the asset after the activity is performed.
	// What it Does: Out of all suggested activities for an asset in the given plan year, the activity with the highest Impact of the asset's OCI is chosen. If activity impact cannot be calculated (null), the activity is not selected unless no other options exist for that asset.
	// Intended Use:  This method of recommendation would have the greatest impact on all assets and overall network OCI. 
	// Best Value

	// What is Cost Per Impact?  The Activity Cost divided by the activity's Impact. Identifies the cost for the increase in asset condition.
	// What it Does: The activity with the lowest Cost Per Impact is selected. Every activity suggested to be performed for a given asset in a plan year has its cost per impact determined. If the Cost Per Impact cannot be calculated (null), the activity is not be selected unless no other options exist for that asset.
	// Intended Use: This method gives you the biggest bang for your buck providing a balance between cost and impact. 
	// Lowest Cost

	// What it Does: The activity with the lowest Activity Cost is selected. If the activity cost calculates to zero, the activityi s as the lowest cost option. If the activity cost cannot be calculated (null), the activity is not selected unless no other options exist for that asset.
	// Intended Use:This method of recommendation would result in the lowest budget consumption per plan year.

// Preventative Maintenance

	// 	About Preventative Maintenance
	// You must have an advanced feature extension to access this feature.

	// Preventative Maintenance plans are used to prolong the service life of assets through proactive maintenance. Use this functionality to set conditional and/or chronological triggers that, when activated, automatically create the necessary followup tasks. The ability to create Preventative Maintenance plans is limited to Cartegraph Administrators only. Here’s what you need to know:

	// Preventative Maintenance has fourparts:      

	// Plans are a collection of assets you want to maintain.  Plans contain Schedules.      
	// Schedules are the Activities or work that create proactive tasks.  Schedules contain Triggers.    
	// Triggers are the rules governing when to fire the scheduled Tasks (work) There are four types of Triggers.  
	// Labor Assignments define who the scheduled Task is assigned to.  
	// The Administrator determines which tasks can be created by a Preventative Maintenance Plan, how often those tasks can be created, and the triggers that set the task creation process in motion. Triggers are what the system looks for to create a task for the asset.  There are four types:       

	// Condition—Create Tasks based on the condition of an asset. For example, a water hydrants OCI falls below 75, inspect it.    
	// The Preventative Maintenance engine compares the current condition of an asset to the value you set in the Plan’s Condition based Trigger. When the current condition falls at or below your set value a Task with the plan’s Activity is created for that asset.

	// To prevent duplicate tasks, condition-based plans always follow the After Complete rule: Do not create tasks if an open Task for the same asset and activity already exists.       

	// Time—Create Tasks after some amount of time has passed.  For example, repaint water hydrants every two years.     
	// The Preventative Maintenance engine looks at the last time the plan’s maintenance activity was completed and creates the tasks when the user-specified time interval has passed. For example, the time interval of two years does not start until the current Repaint task is completed.  Similar to condition triggers, time Triggers follow the After Complete rule.       

	// Repeat—This is a type of time trigger and is different from the time trigger:       
	// Does not follow the After Complete Rule so you could end up with more than one open task to do the same thing for the same asset      

	// Does not base the interval on the completion of a task.  It starts as soon as the interval ends   

	// For example, Storm Outlets are required by the EPA to be inspected twice a year or every 6 months. If you schedule the first inspection task for June 1 and don’t complete that task until August 1, the next task is remains scheduled for Dec. 1      

	// Usage—Available for only Equipment Preventative Maintenance plans. Cartegraph recommends always combing usage and time triggers for equipment plans. This is because without a time trigger a piece of equipment could miss the usage trigger and needs the fallback of the time trigger, similar to oil changes for vehicles.    

