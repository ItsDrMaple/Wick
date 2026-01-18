import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// put your real API key in Render environment variables
const MAILS_API_KEY = process.env.MAILS_API_KEY;

app.get("/", (req, res) => res.send("Server alive"));

app.post("/verify-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ valid: false });

  try {
    const response = await fetch("https://api.mails.so/v1/verify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MAILS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // mails.so returns data.valid, data.disposable, data.mx
    res.json({
      valid: data.valid === true && data.mx === true && data.disposable === false,
      disposable: data.disposable,
      mx: data.mx,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      valid: false,
      error: "Mail API unreachable",
    });
  }
});

app.listen(PORT, () => console.log("Server running on port", PORT));
