const mongoose = require('mongoose');

module.exports = mongoose.connect("mongodb://meglanadmin:RE%21kQadXLTr%235pAx@144.91.112.9:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true  
});

const db = mongoose.connection;

db.on("error", error => console.error("Failed to connect.. " + error));
db.once("open", () => console.log("Connected to mongoose"));
db.once("close", () => console.log("Disconnected from mongoose"));