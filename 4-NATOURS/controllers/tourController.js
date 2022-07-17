const { query } = require('express');
const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

exports.getAllTours = (req, res) => {
    try{

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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = (req, res) => {
    try{
        const tours = await Tour.find();
        // Tour.findOne({ _id: req.params.id })
        res.status(200).json({
            status: 'success',
            data: {
              tour,
            },
          });
    } catch (err) {
        res.status(404).json({
            status: 'Fail', 
            message: err
        });
    }
};

exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
              tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status: 'success',
            data: {
              tour
            },
          });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};