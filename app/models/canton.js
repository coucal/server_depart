var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RecordSchema = new Schema({
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

module.exports = mongoose.model('result15', RecordSchema);
