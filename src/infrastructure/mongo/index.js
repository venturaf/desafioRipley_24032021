const {MONGO_URL} = process.env;

const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex:true
}

const isConnected = error =>{
  if (!error) console.log("Mongo Successfull connected");
  else console.log(`${error}`);
}

module.exports = (mongoose) => {
    mongoose.connect(MONGO_URL, options,isConnected);
    return mongoose
} 