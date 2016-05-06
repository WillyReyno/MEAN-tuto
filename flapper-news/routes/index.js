var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// Créer un middleware permettant de donner un post en paramètre d'une route
router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if(err) { return next(err); }

        if(!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

// Créer un middleware permettant de donner un commentaire en paramètre d'une route
router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment) {
        if(err) { return next(err); }

        if(!comment) { return next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});

// Récupère tous les posts de la base
router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
        if(err) { return next(err); }

        res.json(posts);
    });
});

// Ajoute un post dans la base
router.post('/posts', function(req, res, next) {
    var post = new Post(req.body);

    post.save(function(err, post) {
        if(err) { return next(err); }

        res.json(post);
    })
});

// Récupère un post spécifique
router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });

});

// Upvote un post spécifique
router.put('/posts/:post/upvote', function(req, res, next) {
    req.post.upvote(function(err, post) {
        if(err) { return next(err); }

        res.json(post);
    });
});

// Récupère les commentaires d'un post spécifique
router.post('/posts/:post/comments', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment) {
        if(err) { return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err) { return next(err); }

            res.json(comment);
        });
    })
});

// Upvote un commentaire spécifique
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
    req.comment.upvote(function(err, comment) {
        if(err) { return next(err); }

        res.json(comment);
    });
});

module.exports = router;
