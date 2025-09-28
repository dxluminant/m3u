export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const response = await fetch(url, { redirect: "follow" });
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);

    // যদি playlist হয় (m3u/m3u8) → text + rewrite
    if (contentType.includes("mpegurl") || url.endsWith(".m3u") || url.endsWith(".m3u8")) {
      let text = await response.text();
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
      return res.send(lines.join("\n"));
    }

    // অন্য কিছু হলে (ts, mp4, segment ইত্যাদি) → raw binary পাঠাও
    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}