const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price']
    },
    rating: {
        type: Number,
        default: 4.5
    },
    priceDiscount: Number,
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
    startsDate: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;