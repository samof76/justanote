var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var NoteSchema = new Schema({
    'note': {type: String, required: true, trim: true},
    'tags': {type: []},
    'date': {type: Date, default: Date.now}
    });

var Note = mongoose.model('Note', NoteSchema);

exports.list = function(req, res) {
    Note.find({}, function(err, result) {
        if(err) {
            res.send({'code': 400, 'error': 'Some issue'}, 400)
        } else {
            res.send(result);
        }
    });
    //res.send("List all nites");
}

exports.new = function(req, res) {
    note = Note(req.body);
    note.save(function(err) {
       if(err) {
            res.send({'code': 400, 'error': 'Some issue'}, 400);
       } else {
        res.send(note);
       }
     })
}

exports.note = function(req, res) {
    var id = req.params.id;
    Note.findOne({_id: id}, function(err, result) {
        if(err) {
            res.send({'code': 400, 'error': 'Some issue'}, 400)
        } else {
            res.send(result);
        }
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    Note.findOne({_id: id}, function(err, result) {
       if(err) {
        res.send({'code': 400, 'error': 'Some issue'}, 400);
       } else {
        result.note = req.body.note;
        result.save(function(err) {
            if(err) {
                res.send({'code': 400, 'error': 'Some issue'}, 400);
            } else {
                res.send(result);
            }
        });
       }
    });
}