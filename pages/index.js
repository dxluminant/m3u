import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function Home() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    fetch("https://is.gd/Bnmgis.m3u")
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n").filter(line => line && !line.startsWith("#"));
        setUrl(lines[0]); // first playable stream
      })
      .catch(err => console.error("Failed to load M3U:", err));
  }, []);

  if (!url) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading playlist...</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ReactPlayer url={url} playing controls width="80%" height="80%" />
    </div>
  );
}
