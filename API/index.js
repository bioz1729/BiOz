
import express from "express";
import { google } from "googleapis";
import fs from "fs";

const app = express();
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SHEET_ID = "your_google_sheet_id_here";   // 👈 replace this

app.get("/data", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const range = "Sheet1!A:C"; // adjust to your data columns

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    res.json(response.data.values);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
