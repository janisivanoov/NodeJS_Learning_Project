const { query } = require('express');
const fs = require('fs');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

exports.getAllTours = catchAsync( async (req, res, next) => {
        //Build query
        // 1A) Filtering
        const queryOvj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => '$${match}');
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        //EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query).filter()
                                                                .sort()
                                                                .limitFields()
                                                                .paginate();
        const tours = await features.query;

        // const tours = await Tour.find();
        //                         .where('duration')
        //                         .equal(5)
        //                         .where('difficulty')
        //                         .equal('easy');
        
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
          });
        res.status(404).json({
            status: 'fail',
            message: err
        });
});

exports.getTour = catchAsync( async (req, res, next) => {
        const tour = await Tour.find();
        // Tour.findOne({ _id: req.params.id })

        if(!tour){
            return next(new AppError('No tour found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
              tour,
            },
          });
        res.status(404).json({
            status: 'Fail', 
            message: err
        });
});

exports.createTour = catchAsync(async (req, res, next) => {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
              tour: newTour,
            },
        });
        res.status(400).json({
            status: 'fail',
            message: err
        });
});

exports.updateTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findById(req.params.id, req.body, {
            new: true,
            runValidators: false
        });
        const newTour = await Tour.create(req.body);

        if(!tour){
            return next(new AppError('No tour found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
              tour
            },
          });
        res.status(404).json({
            status: 'fail',
            message: err
        });
});

exports.deleteTour = catchAsync( async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if(!tour){
        return next(new AppError('No tour found with that ID', 404));
    }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
        const stats = Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 }}
            },
            {
                $group: {
                    _id: {$toUpper: `difficulty`},
                    numTours: {$sum: 1},
                    numRatings: {$sum: `$ratingsQuantity`},
                    avgRating: { $avg: `$ratingsAverage`},
                    avgPrice: {$avg: `$price`},
                    minPrice: {$min: `$price`},
                    maxprice: {$max: `$price`}
                }
            },
            {
                $sort: {avgPrice: 1}
            }
            //{
            //   $match: {_id: {$ne: 'EASY'}}
            //}
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
        res.status(404).json({
            status: 'fail',
            message: err
        });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date('${year}-01-01'),
                        $lte: new Date('${year}-12-31')
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum: 1 },
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
        res.status(404).json({
            status: 'fail',
            message: err
        });
});