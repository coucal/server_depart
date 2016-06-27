var mongoose   = require('mongoose');
//mongoose.connect('mongodb://webmaster:password@ds019664.mlab.com:19664/docsa'); // connect to our database
mongoose.connect('mongodb://localhost:27017/test'); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!")
});
