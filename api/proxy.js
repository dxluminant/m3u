export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const response = await fetch(url, { redirect: "follow" });
    let contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");

    let text = await response.text();

    // যদি M3U বা M3U8 হয় → proxy link rewrite
    if (contentType.includes("mpegurl") || url.endsWith(".m3u") || url.endsWith(".m3u8")) {
      const baseUrl = url.replace(/[^/]+$/, "");
      let lines = text.split("\n").map(line => {
        line = line.trim();
        if (line && !line.startsWith("#")) {
          if (line.startsWith("http")) {
            return `/api/proxy?url=${encodeURIComponent(line)}`;
          } else {
            return `/api/proxy?url=${encodeURIComponent(baseUrl + line)}`;
          }
        }
        return line;
      });
      text = lines.join("\n");
    }

    res.send(text);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}