import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const MAILS_API_KEY = process.env.MAILS_API_KEY;

app.get("/", (req, res) => {
  res.send("Backend alive");
});

app.post("/verify-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ valid: false, error: "No email" });
  }

  try {
    const r = await fetch("https://api.mails.so/v1/verify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MAILS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await r.json();
    res.json(data);

  } catch (e) {
    res.status(500).json({ valid: false, error: "API unreachable" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
