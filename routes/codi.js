var Hashids = require("hashids"),
    hashids = new Hashids("this is my erdbeere", 3);

exports.new = function(req, res) {
	res.render('index', { content: '', id: ""});
};

exports.get = function(req, res) {
	var id = hashids.decrypt(req.params.id);
	
	if(id == "") {
		res.render('index', { content: '', id: "" });
	} else {
		req.models.codi.find({id: id}, function(err, codii) {
			var codi = codii[0];

			if(typeof codi === 'undefined' || err) {
				res.render('index', { content: "", id: "" });
			} else {
				res.render('index', { content: codi.content, id: codi.id });
			}
		});
	}
}

exports.create = function(req, res) {
	var content = req.body.content;

	req.models.codi.create({
		content: content,
		owner: ""
	}, function(err, codi) {
		if(err) {
			res.end("error");
		} else {
			res.end(hashids.encrypt(codi.id));
		}
	});
}

exports.update = function(req, res) {
	var id = hashids.decrypt(req.params.id);
	var content = req.body.content;

	req.models.codi.find({id: id}, function(err, codii) {
		if(err) {
			res.end("alles unnormal");
			return;
		}
		var codi = codii[0];
		codi.content = content;
		codi.save(function(err) {
			if(err) {
				res.end("alles unnormal");
			} else {
				res.end("alles normal");
			}
		});

	});
}