let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb+srv://Admin:Admin123@mydb.2ulxr.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
console.log("mongodb connect...");
module.exports = mongoose;