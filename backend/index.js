const express=require('express');
const app=express();
const port=3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var useragent = require('express-useragent');



mongoose.connect( 'mongodb+srv://renuscaria141999:Yv3qClj5BFiq61XI@cluster0.0lkwn.mongodb.net/', { /* useNewUrlParser: true, */ /* useCreateIndex: true, */ /* useUnifiedTopology: true */ }).then(() => {
  console.log("Db connected")
}).catch((ex) => {
  console.log("Db connection error")
  console.log(ex)
});

app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true, limit: '150mb'
}));
app.use(bodyParser.json({ limit: '150mb' }));  
app.use(useragent.express());


app.use(require("./routes/userRoute"));
app.use(require("./routes/blogRoute"));

app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
