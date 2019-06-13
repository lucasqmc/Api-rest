let NeDB = require('nedb');
let db = new NeDB({
    filename:'users.db',
    autoload:true
});

module.exports = (app) => {

    let route = app.route('/users');

    route.get((req, res, next) => {

        res.header("Access-Control-Allow-Origin", "*");
        
        
        db.find({}).sort({name: 1}).exec((err, users) => {

            if(err){
                app.utils.error.send(err, req, res);
            }else{

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users
                });
            }
        });
    });

    route.post((req, res, next) => {
        //Validating post data:
        if(!app.utils.validator.user(app, req, res)) return false;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        db.insert(req.body,(err, user) => {

            if(err) {
                app.utils.error.send(err, req, res);
            } else{

                res.status(200).json(user);
            }
        });

    });

    let routeId = app.route('/users/:id');

    routeId.get((req ,res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       
        db.findOne({_id:req.params.id}).exec((err,user) => {

            if(err){
                app.utils.error.send(err, req, res);

            } else{
                res.status(200).json(user);
                
            }

        });

    });

    routeId.put((req ,res, next) => {
        //Validating put data:
        if(!app.utils.validator.user(app, req, res)) return false;

        db.update({_id:req.params.id},req.body,err => {

            if(err){
                app.utils.error.send(err, req, res);

            } else{
                res.status(200).json(req.body);
                
            }

        });

    });

    routeId.delete((req, res) => {

        db.remove({_id:req.params.id}, {}, err => {

            if(err){
                app.utils.error.send(err, req, res);

            } else{
                
                res.status(200).json(req.params);
            }
        });

    });
}