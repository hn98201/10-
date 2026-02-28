export default async function handler(req, res) {
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

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=${series_id}` +
      `&api_key=${apiKey}` +
      `&sort_order=desc` +
      `&limit=${limit}` +
      `&file_type=json`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
```

**③** 아래로 내려서 **"변경사항 커밋"** 초록 버튼 클릭

---

### 완료 후 모습
```
저장소
├── api/
│   └── fred.js   ✅
└── vercel.json   ✅
