const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000";

app.post("/predict", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Lỗi gọi API Flask:", error.message);
        res.status(500).json({ error: "Lỗi server!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Node.js chạy tại http://localhost:${PORT}`);
});
