const router = require("express").Router();
const User = require("../models/user").User;
const Post = require("../models/post").Post;

router.get("/posts", (req, res) => {
    // console.log("GET /posts");
    if (req.isUnauthenticated()) {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
    else {
        Post.find()
            .then((posts) => {
                res.status(200).json({
                    posts: posts,
                    userId: req.user.id
                });
            }
            )
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error"
                });
            }
            );
    }
});

router.get("/posts/:id", (req, res) => {
    if (req.isUnauthenticated()) {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
    else {
        Post.findById(req.params.id)
            .populate('userId')
            .then((post) => {
                res.status(200).json({
                    post: post
                });
            }
            )
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error"
                });
            }
            );
    }
});

router.get("/posts/user", (req, res) => {
    if (req.isUnauthenticated()) {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
    else {
        Post.find({ userId: req.user._id })
            .then((posts) => {
                res.status(200).json({
                    posts: posts
                });
            }
            )
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error"
                });
            }
            );
    }
});

router.post("/posts", (req, res) => {
    if (req.isAuthenticated()) {
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            imgURL: req.body.imgURL,
            userId: req.user._id,
        });
        post.save()
            .then((post) => {
                console.log("Post created");
                res.status(200).json({
                    message: "Created"
                });
            }
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    message: "Internal server error"
                });
            }
            );
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});

router.put("/posts/upvotes/:id", (req, res) => {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id)
            .then((post) => {
                post.upVotes = req.body.upVotes || post.upVotes;
                post.save()
            })
            .then((post) => {
                res.status(200).json({
                    message: "Updated"
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error"
                });
            });
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});



router.put("/posts/:id", (req, res) => {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id)
            .then((post) => {
                if (post.userId == req.user.id) {
                    post.title = req.body.title || post.title;
                    post.description = req.body.description || post.description;
                    post.imgURL = req.body.imgURL || post.imgURL;
                    post.upVotes = req.body.upVotes || post.upVotes;
                    // console.log(post);
                    post.save()
                }
                else {
                    res.status(401).json({
                        message: "Unauthorized"
                    });
                }
            }
            )
            .then((post) => {
                res.status(200).json({
                    message: "Updated"
                });
            }
            )
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error"
                });
            }
            );
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});

router.delete("/posts/:id", (req, res) => {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id)
            .then((post) => {
                if (post.userId == req.user.id) {
                    return Post.deleteOne({ _id: post._id })
                }
                else {
                    res.status(401).json({
                        message: "Unauthorized"
                    });
                }
            }
            )
            .then((post) => {
                res.status(200).json({
                    message: "Deleted"
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error"
                });
            }
            );
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});




module.exports = router;