//Create web server
const express = require('express');     
const app = express();                  //Create express app
const path = require('path');           //Path module
const bodyParser = require('body-parser');  //Middleware for parsing bodies from URL
const { check, validationResult } = require('express-validator'); //Validation
const mongoose = require('mongoose');   //Mongoose
const port = 3000;                      //Port 3000
const Comment = require('./models/comment'); //Import Comment model

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comments', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB', err);
    })

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware
app.use(bodyParser.urlencoded({extended: true}));

//Routes

//GET: Home page
app.get('/', (req, res) => {
    res.render('index');
})

//GET: Comments page
app.get('/comments', (req, res) => {
    Comment.find()
        .then(comments => {
            res.render('comments', {comments: comments});
        })
        .catch(err => {
            console.log('Error getting comments', err);
        })
})

//POST: Comments page
app.post('/comments', [
    check('name').isLength({min: 1}).withMessage('Name is required'),
    check('comment').isLength({min: 1}).withMessage('Comment is required')
], (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        const comment = new Comment(req.body);
        comment.save()
            .then(() => {
                res.redirect('/comments');
            })
            .catch(err => {
                console.log('Error saving comment', err);
            })
    } else {
        res.render('index', {
            errors: errors.array(),
            data: req.body
        })
    }
})

//Listen on port 3000
app.listen(port, () => {
    console.log('Server started on port 3000');
})