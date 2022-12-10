require('dotenv').config();
const db = require('./dbUtils.js');

// Import session and passport
const passportSetup = require('./passportSetup');

const express = require("express");
const bodyParser = require('body-parser');
// You should not use another name for the Server class
// or it will not import the correct Server class
// const { Server } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3001;

// const httpServer = require("http").createServer(app);
const cors = require("cors");
// const io = new Server(httpServer, {
//     cors: {
//         origin: process.env.FRONTEND_ORIGIN,
//         methods: ["GET", "POST", "PUT", "DELETE"]
//     }
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_ORIGIN, "http://localhost:5001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Set up session and passport
passportSetup(app);

//Set up file upload
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },//50MB
    createParentPath: true//Create the directory if it does not exist
}));


//routers
app.use("/api", require("./routers/user"));
app.use("/", require("./routers/oauth"));
app.use("/api", require("./routers/posts"));
app.use("/api/file", require("./routers/files"));



(async () => {
    if (process.env.NODE_ENV !== 'production') {
        await db.connect('sharifyDB');
    }
    else {
        await db.connect('sharifyDB', { user: process.env.MONGODBATLAS_USR, password: process.env.MONGODBATLAS_PSW });
    }
    app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT || 3000}`));
    // io.on("connection", (socket) => {
    //     console.log("New client connected");
    //     socket.on("disconnect", () => {
    //         console.log("Client disconnected");
    //     });
    // });
})().then(() => { console.log('Done'); });
