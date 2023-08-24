const express = require("express");
const path = require("path");
const port = 8000;

const db = require("./config/mongoose");
const Task = require("./models/task");

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));

app.get("/", async function (req, res) {
  try {
    // Fetch all tasks from the database
    const tasksFromDB = await Task.find({});

    // Map the retrieved tasks with serial numbers for display
    const tasksWithSerialNumber = tasksFromDB.map((task, index) => ({
      ...task.toObject(), // Convert Mongoose document to plain JavaScript object
      serialNumber: index + 1,
    }));

    return res.render("home", {
      title: "To-do List",
      to_do_tasks: tasksWithSerialNumber,
    });
  } catch (error) {
    console.error("Error rendering home page:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/listData", async function (req, res) {
  try {
    return res.render("listData", {
      title: "This is list data",
    });
  } catch (error) {
    console.error("Error rendering listData:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/create-task", async function (req, res) {
  try {
    const newTask = new Task({
      taskName: req.body.taskName,
      taskDescription: req.body.taskDescription,
      taskDueDate: req.body.taskDueDate,
      taskType: req.body.taskType,
    });

    // Save the new task
    await newTask.save();

    console.log("Created task:", newTask);
    return res.redirect("back");
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).send("Internal Server Error");
  }
});
app.get("/delete-task", async function (req, res) {
  try {
    const taskIdToDelete = req.query.taskId; // Get the task ID from the query parameter

    if (!taskIdToDelete) {
      console.log("Task ID not provided for deletion");
      return res.redirect("/");
    }

    // Find the task by ID and delete it from the database
    await Task.findByIdAndDelete(taskIdToDelete);

    console.log("Task Deleted:", taskIdToDelete);
    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(port, function (err) {
  if (err) {
    console.log(`Error while starting the server: ${err}`);
  }

  console.log(`The server is running on port: ${port}`);
});
