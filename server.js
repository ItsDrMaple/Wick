import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const MAILS_API_KEY = process.env.MAILS_API_KEY;

app.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ valid: false });

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
    // mails.so returns something like { valid: true, disposable: false, mx: true }
    res.json({
      valid: data.valid,
      disposable: data.disposable,
      mx: data.mx
    });
  } catch (err) {
    res.status(500).json({ valid: false, error: "API unreachable" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
