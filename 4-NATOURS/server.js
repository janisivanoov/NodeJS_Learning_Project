const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

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
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Forest Hiker',
    rating: 4.7,
    price: 497
});

testTour
    .save()
    .then(doc => {
        console.log(doc);
    })
    .catch(err => {
        console.log('Error! :', err);
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});