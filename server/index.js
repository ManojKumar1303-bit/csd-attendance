import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ==========================
// CORS (production safe)
// ==========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://merncrud123.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ==========================
// CONNECT TO MONGODB
// ==========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ==========================
// SCHEMA & MODEL
// ==========================
const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Person = mongoose.model("Person", PersonSchema);

// ==========================
// ROUTES
// ==========================

// GET ALL
app.get("/", async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

// CREATE
app.post("/", async (req, res) => {
  const newPerson = await Person.create(req.body);
  res.json(newPerson);
});

// UPDATE
app.put("/:id", async (req, res) => {
  const updated = await Person.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/:id", async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.json({ message: "Person Deleted" });
});

// ==========================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
