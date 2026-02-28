const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { series_id, limit = 3 } = req.query;

  if (!series_id) {
    return res.status(400).json({ error: "series_id 필요" });
  }

  const apiKey = process.env.FRED_API_KEY;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&sort_order=desc&limit=${limit}&file_type=json`;

  try {
    const data = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let body = "";
        response.on("data", chunk => body += chunk);
        response.on("end", () => resolve(JSON.parse(body)));
        response.on("error", reject);
      }).on("error", reject);
    });

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
