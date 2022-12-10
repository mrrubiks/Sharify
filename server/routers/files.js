const router = require("express").Router();

router.post('/upload', (req, res) => {
    if (req.isUnauthenticated()) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    if (!req.files) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }
    req.files.image.mv('./uploads/' + req.files.image.md5 + '.' + req.files.image.name.split('.').pop());
    res.status(200).json({
        message: "File uploaded",
        imageHash: req.files.image.md5 + '.' + req.files.image.name.split('.').pop()
    });
});

router.get('/img/:name', (req, res) => {
    if (req.isUnauthenticated()) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    res.sendFile(req.params.name, {
        root: './uploads'
    });
});

module.exports = router;