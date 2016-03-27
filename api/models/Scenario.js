/**
 * Scenario
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	name: 'string',
  	asset_type_id: 'string',
  	filter: 'json',
  	start_date: 'date',
  	years: 'integer',
  	type: 'string', // Budget, OCI Target, Unlimited
  	target: 'string',
  	budget: 'float',
  	end_target_ock: 'float',
  	activity_sequence: 'json',
  		// Best Value
	  	// Asset Criticality
	  	// Asset Criticality and Highest Estimated OCI
	  	// Asset Criticality and Lowest Estimated OCI
	  	// Projected Date
  	asset_criticality_weight: 'integer',
  	estimated_oci_weight: 'integer',
  	recommend_single_actiivty_by: 'json',
  		// Best Value (Cost/Impact)
  		// First Qualifying
  		// Highest Impact
  		// Lowest Cost
  	description: 'string'
  	// average activity per year
  	//total cost
  	//segments involved
  	//activities utilized
  	//map
  	//ending average oci
  	//beginning average oci
  	//net oci gain/loss
  	//last run date
  	//total activities performed
  	//percent of total assets touched
  	//assets affected
  	//plan years
  		//cost per plan year
  		//begin oci plan year
  		//end oci plan year
  		//
  	//selected segment count
  	//selected segment total cost
  	//backlog costs
  	//maximum oci backlog
    
  }

};

// Unlimited
// What it Does:  Keeps running the engine until all your protocols and triggers are executed for all of your plan years. If an activity is projected to be done, it will be done
// Intended Use:  Do my maintenance protocols even really make sense?  How much money would I need to spend to fully achieve what I am trying to do and is it realistic?  If I have setup everything correctly, I should see my network continuing to improve, is it doing that?
// User Tip: User wants to know what would happen to the network OCI if no work was completed, a Do Nothing scenario. Create an Unlimited scenario and do not associate any protocols.

// Budget Limitation
// What it Does:  The engine keeping running until you are out of money for each plan year.

// Intended Use:  What kind of network OCI will I achieve with the amount of money I am given?  How much more improvement can I achieve with a little more money?

// If the Activity's Cost would result in having exceeded the Plan Year's Budget,  then the Activity is skipped and we go to Processing the next Activity in the Plan Year. The Scenario's Activity List will not contain Activities that were skipped.
// A Plan Year will only include activities which "qualify" or are projected to occur in the given plan year.  When budget dollars remain, the system will NOT look to future plan years to see if future qualifying activities have a cost that fits within the remaining budget.
// If all the money in a Plan Year's Budget is not used, that money is forfeited and not rolled into a subsequent Plan Year (aka, if you don't use it, you lose it).
// If the Plan Year's Budget is empty, treat it as a Budget of $0.
// User Tips:
// Question:  Why is my plan year cost always less than my budget?  Answer:   The scenario will run spending as much money as possible WITHOUT going over budget.  If $5000 remains in the budget but there are no qualifying activities that cost less than $5000, the $5000 will remain unspent. 
// Scenario:  User wants to know what activities that they would/should have done if they had more money (i.e., what activities am I NOT doing because I ran out of money).  Answer:  Run another scenario with the same settings but with Scenario Type being "Unlimited" and compare the results.  
// Scenario:  User runs scenario and none of the budget targets are met; plan year cost is always much less than plan year budget.  Answer:  Check your activity costs and see if they are set up properly (activities have costs, assets have data needed to calculate cost).  Check your scenario and protocol/trigger settings to see if you are too aggressively excluding item. For example, only allowing one activity per asset per year. Create a new set of maintenance protocols which are more aggressive for the scenario in which  you want to spend a lot of money. For example, perform a Replace activity when the asset gets to 50 OCI instead of when it gets to 20 OCI. Extend the number of years on your scenario to give assets enough time to deteriorate to a point where they need action.
// Scenario:  One plan year spends much less than budgeted but other plan years are cut off at the budget amount so total cost for scenario is less than total budget.  Answer:  Adjust the budget by year values.  Lower the budget for the low cost year and put that money into a different year where it can be used.

// OCI Target
// What it Does:  The engine keeps running until reaching your OCI target for each year.

// Intended Use:  How much money will it cost me to get my assets to the condition I want/need them to be?  How underfunded am I?

// The scenario looks at the OCI Target specified for each plan year.  The OCI Target is based on the ending OCI of the plan year (the last day of the plan year.
// A given plan year's OCI Target is considered met when the Network OCI for the last day of the plan year meets or exceeds the target value.
// In order for the engine to stop including more activities in a plan year, the Network OCI must exceed the Target OCI.  If every activity has been processed for a given plan year and the OCI Target is still not met, the engine will move on to the next plan year and begin processing against the OCI Target for that plan year.
// If no OCI Target is specified, it is treated as the OCI Target = 0, meaning no activities will be included for the given plan year.
// User Tips:
// Question: How is the Network OCI calculated? Answer:  The Network OCI is calculated by summing each asset's projected Estimated OCI for the last day of a plan year and dividing by the total number of assets.
// Question:  Which assets are included in the Network OCI calculation?  Answer: The assets which fall into the scope of the scenario filter.
// Question: If not all assets in the system are figured into the Network OCI calculation then what is the best way to get a picture of the whole network? Answer: Two options exists for getting a snapshot of the entire network, Option 1 involves setting up a single scenario using exclusively protocol filters, while Option 2 uses multiple scenarios.  Both options are outline below.
// Option 1:  Instead of using a scenario filter, create protocol filters so activities will only be recommended for specific assets which fall into these filters.  By doing this the Network OCI will encompass the whole network since no scenario filter has been defined, thus including all assets in the network.
// Option 2:  Using scenario filters to create multiple scenarios which in total encompass the whole network.  If this route is chosen, the OCI for the entire network will need to be manually calculated, as the whole network has been divided across multiple scenarios.
// Scenario: If the Target OCI for a given plan year is 80, and after an activity was performed the new Network OCI was calculated to be 79.879 will another activity tried to be processed?  Answer: Yes, the Network OCI must exceed the Target OCI, rounding does not count.  Therefore another activity would be processed in an effort to boost the Network OCI over the Target OCI of 80.
// Scenario:  Scenario runs and none of the OCI Targets are met, and the Network OCI is always less than plan year target.  Answer:  1)Check the impacts and see if  they are setup properly.  2)Check the scenario and protocol/trigger settings to see if they are too aggressive. For example, only performing activities when the assets are significantly deteriorated. Try creating a new set of maintenance protocols which are more aggressive for the scenario in order to achieve a greater OCI impact.  3) Extent the number of years on the scenario to give assets enough time to deteriorate to a point where they need action.


