const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Must enter an email'],
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'Please enter a Restaurant Name'],
  },
  cusine: {
    type: String,
    require: [true, 'Please Enter a cusine type'],
  },
  city: {
    type: String,
    require: [true, 'Please Enter a city for the restaurant'],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updatedat: {
    type: Date,
    default: Date.now,
  },
});

//Declare Virtual Fields
RestaurantSchema.virtual('ownerEmail').get(function () {
  return `The owner of ${this.name} has ${this.email} as email `;
});
//Custom Schema Methods
//1. Instance Method Declaration
RestaurantSchema.method.getOwnerEmail = function () {
  return `The owner of ${this.name} has ${this.email} as email `;
};

RestaurantSchema.methods.getAllRestaurantInfo = function () {
  return `${this.name} is a ${this.cusine} restaurant. Send an email to ${this.email} to book a table`;
};

//2. Static method declararion

//Writing Query Helpers

/**
 * The pre() method is a middleware that allow us to run some code
 * before an event (such as saving a document) occurs. it is a way to add
 * additional behavior to our models that gets executed automatically each
 * time you save, update, or validate a document. We can use the pre method
 * to modify the document, validate it, or perform any action we feel is
 * needed: one case could be hashing a password before saving it to the DB.
 */
RestaurantSchema.pre('save', (next) => {
  console.log('Entered the pre() method: I am doing something before saving');
  let now = Date.now();

  this.updatedat = now;
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now;
  }

  // Call the next function in the pre-save chain
  next();
});

RestaurantSchema.pre('findOneAndUpdate', (next) => {
  console.log('Before findOneAndUpdate');
  let now = Date.now();
  this.updatedat = now;
  console.log(this.updatedat);
  next();
});

RestaurantSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

RestaurantSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

RestaurantSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

RestaurantSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
