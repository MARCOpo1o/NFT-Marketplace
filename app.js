/*
  app.js -- This creates an Express webserver with login/register/logout authentication
  This version has removed all of the authentication and database management.
*/

// *********************************************************** //
//  Loading packages to support the server
// *********************************************************** //
// First we load in all of the packages we need for the server...
const createError = require("http-errors"); // to handle the server errors
const express = require("express");
const path = require("path");  // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const bodyParser = require("body-parser"); // to handle HTML form input
const debug = require("debug")("personalapp:server"); 
const layouts = require("express-ejs-layouts");
const auth = require("./routes/auth");


const mongoose = require( 'mongoose' );
const mongodb_URI = 'mongodb+srv://tqin:Wach047302@cluster0.looip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//const mongodb_URI = 'mongodb+srv://cs_sj:BrandeisSpr22@cluster0.kgugl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});






// *********************************************************** //
// Initializing the Express server 
// This code is run once when the app is started and it creates
// a server that respond to requests by sending responses
// *********************************************************** //
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



// this allows us to use page layout for the views 
// so we don't have to repeat the headers and footers on every page ...
// the layout is in views/layout.ejs
app.use(layouts);

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));


// Here we enable session handling using cookies
app.use(
  session({
    secret: "zzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
    resave: false,
    saveUninitialized: false
  })
);

app.use(auth);

// *********************************************************** //
//  Defining the routes the Express server will respond to
// *********************************************************** //



// specify that the server should render the views/index.ejs page for the root path
// and the index.ejs code will be wrapped in the views/layouts.ejs code which provides
// the headers and footers for all webpages generated by this app
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/about", (req, res, next) => {
  res.render("about");
});

app.get("/demopage", (req, res, next) => {
  res.render("demo");
});

app.get("/create", 
  (req, res, next) => {
        res.render("create");
      }
);

app.get("/login", 
  (req, res, next) => {
      res.render("login");

  });
  app.get("/signup", 
  (req, res, next) => {
      res.render("signup");

  });

  app.get("/login1", 
  (req, res, next) => {
      res.render("login1");

  });

  app.get("/secret", 
  (req, res, next) => {
      res.render("secret");

  });


// // for images//
// // app.use("/images",express.static(path.join(__dirname,"/images")))

// // Here is for storage within users' accounts //
const multer = require("multer");

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/Users/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
//  const storage = multer.diskStorage({
//     destination:(req,file, cb)=>{
//         cb(null,"public/images")
//     }, filename: (req,file,cb)=>{
//         cb(null, file.originalname)
//     }
// })

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

//const upload = multer({ storage: storage })

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}




// app.post("/api/upload", upload.single("file"),(req,res)=>{
//     res.status(200).json("File has been uploaded");

//   if (req.session.username) {
//     res.locals.loggedIn = true
//     res.locals.username = req.session.username
//     res.locals.user = req.session.user
//   } else {
//     res.locals.loggedIn = false
//     res.locals.username = null
//     res.locals.user = null
//   }
//   res.redirect('/')
// })

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('secret', {
          msg: 'File Uploaded!',
          file: `Users/${req.file.filename}`
        });
      }
    }
  });
});

// app.get("/boots", 
//   (req, res, next) => {

//         res.render("bootstrapdemo");
//       }
// );



//*************************** */
//displaying all the images in the drive
//var express = require("express"),
//     app = express(),
//     imageDir = __dirname + "/User/<%= user._id %>",
//     imageSuffix = "-image.png",
//     fs = require("fs");

// app.get("/images/:id", function (request, response) {
//     var path = imageDir + request.params.id + imageSuffix;

//     console.log("fetching image: ", path);
//     response.sendFile(path);
// });


// app.listen(5500);

//************************************* */



// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
// notice that the function has four parameters which is how Express indicates it is an error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


//functions to see the uploaded images
app.use('/static', express.static(path.join(__dirname,'uploads')))

app.get('/getimages',(req, res) => {
  let images = getImagesFromDir(path.join(__dirname, 'uploads'))

  res.render('index', {title:'Node.js - Auto Generated Gallery from a Directory', images:images})
})
function getImagesFromDir(dirPath){

  let allImages = []

  let files = fs.readdirSync(dirPath)

  for (file in files){
    let fileLocation = path.join(dirPath,file)
    var stat = fs.statSync(fileLocation)

    if (stat && stat.isDirectory()){
      getImagesFromDir(fileLocation)

    }
    else if(stat && stat.isFile() && ['.jpg','.png'].indexOf(path.extname(fileLocation)) !== -1){
      allImages.push('static/'+file)
    }
  }
  return allImages

}

// *********************************************************** //
//  Starting up the server!
// *********************************************************** //
//Here we set the port to use between 1024 and 65535  (2^16-1)
const port = "5500";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;

