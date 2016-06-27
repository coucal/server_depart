var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Database connection
var uristring = 'mongodb://localhost/canto';
var mongoOptions = { };

mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) {
        console.log('Error when connecting to: ' + uristring + '. ' + err);
    }
    else {
        console.log('Successfully connected to: ' + uristring);
    }
});


//First let's create the Schemas:
// Record Schema
var Record = new Schema({
  numtour: { type: Number },
  coddpt: { type: Number },
  codsubcom: { type: Number },
  libsubcom: { type: String },
  codburvot: { type: Number },
  codcan: { type: Number },
  libcan: { type: String },
  nbrins: { type: Number },
  nbrvot: { type: Number },
  nbrexp: { type: Number },
  numdepcand: { type: Number },
  liblisext: { type: String },
  codnua: { type: String },
  nbrvoix: { type: Number }
});



//Define Models
var RecordModel = mongoose.model('result15', Record);
var ObjectId = require('mongoose').Types.ObjectId;


var listRecords = function() {
	var query = RecordModel.find();

	query.exec(function(err, records) {
		if (err) {
			console.log(err);
		}

		console.log(records);
	});
}

var listRecord = function(id) {
	if (id == null) {
		return ;
	}

	var query = RecordModel.find({_id:id});
	query.field('_id libsubcom liblisext nbrvoix');

	query.exec(function(err, records) {
		if (err) {
			console.log(err);
		}

		console.log(records);
	});
}

var removeRecord = function(recordId) {
	var query = RecordModel.findOne({_id:recordId});

	query.exec(function(err, record) {
		if (err) {
			console.log(err);
			return ;
		}

		record.remove();
	});
}


//Aggregation function
var getVotes = function(cantonId) {
    RecordModel.aggregate([
        { $match: {
            codcan: cantonId
        }},
        { $group: {
            _id: "$liblisext",
            total: { $sum: "$nbrvoix"  }
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    });
}


//Let's add some data and call the getBalance fucntion
var i;
for (i=1;i<=17; i++) {
    getVotes(i);
}
