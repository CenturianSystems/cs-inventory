require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("tiny"));
app.use(express.static("client/build"));

const keys = require("./config/keys");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the Database
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((err) => {
    console.log("Could not connect to the Database. Exiting now....", err);
    process.exit();
  });

// app.get('/', (req, res) => {
//     res.json({
//         "message": "Welcome to Centurian Systems",
//         "description": "We provide the best Security Solutions that are pocket friendly and long lasting."
//     })
// })

require("./routes/product.route.js")(app);
require("./routes/sale.route.js")(app);
require("./routes/purchase.route.js")(app);
require("./routes/user.js")(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"))
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`App is listening on PORT - ${process.env.PORT}`);
});
