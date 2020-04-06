// mongoose is  used to connect to the db
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// when using async you should use try catch
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })


        console.log('MongoDB Connected...');
    } catch (err) {
        console.log(err.message);
        // Exit process with failure
        process.exit(1);

    }
};

module.exports = connectDB;