let express = require('express');
let router = express.Router();
let BookSchema = require('../models/books');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Books API' });
});

router.post('/api/books', (request, response, next) =>{
   let bookJSON = request.body;
   if (!bookJSON.title || !bookJSON.description)
       HandleError(response, 'Missing Information', 'Form Data Missing', 500);
   else{
       let book = new BookSchema({
           title: bookJSON.title || "A Mysterious Novel", // title: request.body.title
           description: bookJSON.description || 'Surprisingly mysterious; good luck learning about this one.',
           year: bookJSON.year || 1980,
           author: bookJSON.author || 'Pierre Armen Faulton',
           hardCover: bookJSON.hardCover || true,
           price: bookJSON.price || 0.00
       });
       book.save( (error) => {
           if (error){
               response.send({"error": error});
           }else{
               response.send({"id": book.id});
           }
       });
   }
});
// Check Post with: db.books.find()

router.get('/api/books', (request, response, next)=>{
    let _id = request.query['_id'];
    if (_id){
        BookSchema
            .find({"_id": _id})
            .exec( (error, books) =>{
               if (error){
                   response.send({"error": error});
               }else{
                   response.send(books);
               }
            });
    }else{
        BookSchema
            .find()
            .exec( (error, books) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
});

router.get('api/books/:_id', (request, response, next) =>{
    BookSchema
        .findById({"_id": request.params._id}, (error, result) => {
            if (error){
                response.status(500).send(error);
            }else if (result){
                response.send(result);
            }else{
                response.status(404).send({"_id": request.params._id, "error": "Not Found"});
            }
        });
});

router.patch('api/books/:_id', (request, response, next) => {
    BookSchema
        .findById(request.params._id, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            }else{
                response.status(404).send({"_id": request.params._id, "error":  "Not Found"});
            }
        });
});

router.delete('api/books/:_id', (request, response, next) => {
    BookSchema
        .findById(request.params._id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params._id});
                });
            }else{
                response.status(404).send({"_id": request.params._id, "error":  "Not Found"});
            }
        });
});
module.exports = router;