import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve each project under its route
// app.use("/1", express.static(path.join("./Day 01 - Live Coding a Gambling Strategy/build")));
app.use("/2", express.static(path.join("./Day 02 - I coded Zerodha's Trading Algorithm in 1 hour/dist")));
app.use("/3", express.static(path.join("./Day 03 - I built a Trading Bot in 1 hour/dist")));

// Optional: fallback
app.get("/", (req, res) => {
  res.send("Welcome! Available projects: /1, /2, /3...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

