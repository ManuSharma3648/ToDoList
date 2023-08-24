const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://manu:RoXstar_123@todocluster.p9xlwwu.mongodb.net/ToDoListData"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", function () {
  console.log("Successfully connected to the database");
});
