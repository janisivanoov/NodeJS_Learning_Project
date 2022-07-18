const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour must have less or equal then 40 characters'],
        minLength: [10, 'A tour must have more or equal then 10 characters'],
        //validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration:{
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty:{
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: 'Difficulty is either: easy, medium, hard'
        }
    },
    ratingsAverage:{
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price']
    },
    rating: {
        type: Number,
        default: 4.5
    },
    priceDiscount: {
        type: Number,
        validate: function(val){
            return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a discription']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startsDate: [Date],
    secretTour: {
        type: Boolean, 
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before save & create functions
tourSchema.pre('save', function() {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre('save', function(next){
    console.log('Will save document');
    next();
});

tourSchema.post('save', function(doc, next){
    console.log(doc);
    next();
});

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){
//tourSchema.pre('find', function(next){
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function(docs, next){
    console.log('Query took ${Date.now() - this.start} milliseconds!');
    console.log(docs);
    next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    this.pipeline().ushift({ $match: { secretTour: {$ne: true}}});
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;