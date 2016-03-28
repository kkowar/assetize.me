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

// About Condition Category Types
// The Condition Category Type library is a read-only library.

// 5 Star

// This is the default type that comes with all condition categories provided with startup data.

// Advanced Feature Extension
// With an advanced extension, Condition Categories can have different types. This gives the ability to measure condition categories on inspections in a way that make sense for that condition category. The type of a condition category cannot be changed once the condition category is saved. The Condition Category Types library is a read-only library that contains all of the available types:

// 5 Star

// This is the default type that comes with all condition categories provided with start up data.
// When this type is selected, the Index Mappings recordset for the condition category is populated with 11 records, and only the Indexes can be edited.
// Index
// An Index type condition category requires entry of the actual  inspected Index during an Inspection.
// When this type is selected, the Index Mappings recordset for the condition category is empty and cannot be edited.
// Number

// This type allows the entry of a number value during an inspection, which determines the inspected index based on the Index Mappings.
// The Index Mappings of a Number type must include the high and low bounds of the acceptable values. For example,
// If a reading of a condition category can never be more than 400, then there must be an Index Mapping for a Value of 400 and none greater than 400.
// If a reading can never be less than 50 then there must be an Index Mapping for a Value of 50 and none less than 50.
// Quantity

// This type allows a condition category to be measured with an amount and unit, which determines the inspected index based on the Index Mappings.
// When Quantity is selected as the type, Unit Category and Default Unit fields are required.
// The Unit Category determines the available Default Unit options.
// Once the condition category is saved, Index Mappings can be created for the default unit.
// If Index Mappings exist for a quantity type condition category, the Unit Category and Default Unit cannot be changed.
// When this condition category is inspected, the measured value can be set in the default unit or in a convertible unit.
// The Index Mappings of a Quantity type must include the high and low bounds of the acceptable values, including the unit. For example,
// If a reading of a condition category can never be more than 80 degrees F, there must be an Index Mapping for a Value of 80 F and none more than 80 F.
// If a reading of a condition category can never be less than 20 degrees F, there must be an Index Mapping for a Value of 20 F and none less than 20 F.
// Option

// This type allows selecting from a list of values during the inspection, which determines the index based on the Index Mappings.
// The Index Mappings of an Option type must include all of the acceptable values.  For example, if a condition category needs to allow values of Excellent, Fair, and Poor, then there must be an Index Mapping for each of those values.
//  Without an advanced feature extension, only 5-Star Condition Categories are available.

 