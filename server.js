import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

    // logic: valid if mails.so says valid and not disposable
    // ignore MX check for common domains
    const domain = email.split("@")[1]?.toLowerCase() || "";
    const commonDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const valid =
      data.valid === true &&
      data.disposable === false &&
      (data.mx === true || commonDomains.includes(domain));

    res.json({
      valid,
      disposable: data.disposable,
      mx: data.mx,
    });

  } catch (err) {
    console.error("Email verify error:", err);
    res.status(500).json({ valid: false, error: "Mail API unreachable" });
  }
});

app.listen(PORT, () => console.log("Server running on port", PORT));
