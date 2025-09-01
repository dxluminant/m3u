import React from 'react';
import ReactPlayer from 'react-player';

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ReactPlayer 
        url="https://is.gd/Bnmgis.m3u"
        playing={true}
        controls={true}
        width="80%"
        height="80%"
      />
    </div>
  );
}
