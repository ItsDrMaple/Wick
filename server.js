import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// TEST ROUTE (open this in browser)
app.get("/", (req, res) => {
  res.send("Server is alive");
});

// EMAIL VERIFY ROUTE
app.post("/verify-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ valid: false });
  }

  // temporary fake success so we know frontend works
  res.json({
    valid: true,
    disposable: false,
    mx: true
  });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
