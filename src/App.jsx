import { useState, useEffect } from 'react';
import './App.css';

const CHANNEL_ID = 'UCqGyXWNWzhg08genmTcbwfQ';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CORS_PROXY = 'https://api.codetabs.com/v1/proxy/?quest=';

function useLatestVideo() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(CORS_PROXY + RSS_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch feed');
        return res.text();
      })
      .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, 'application/xml');
        const entry = doc.querySelector('entry');
        if (!entry) throw new Error('No videos found');
        const videoId = entry.querySelector('videoId')?.textContent;
        const title = entry.querySelector('title')?.textContent;
        setVideo({ videoId, title });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { video, loading, error };
}

function LatestVideo() {
  const { video, loading, error } = useLatestVideo();
  const [playing, setPlaying] = useState(false);

  if (loading) {
    return (
      <div className="video-section">
        <div className="video-container">
          <div className="video-placeholder">Loading latest video...</div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-section">
        <div className="video-container">
          <div className="video-placeholder">
            Couldn't load the latest video.{' '}
            <a href={`https://www.youtube.com/@bullshiftcarreviews`} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    );
  }

  const thumbUrl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <div className="video-section">
      <h2 className="video-heading">Latest Video</h2>
      <div className="video-container">
        {playing ? (
          <iframe
            className="video-embed"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-thumb-btn"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            <img src={thumbUrl} alt={video.title} className="video-thumb" />
            <div className="video-play-overlay">
              <svg viewBox="0 0 68 48" width="68" height="48">
                <path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C56 0 34 0 34 0S12 0 7.5 1.7a8.5 8.5 0 0 0-6 6C0 12.3 0 24 0 24s0 11.7 1.5 16.3a8.5 8.5 0 0 0 6 6C12 48 34 48 34 48s22 0 26.5-1.7a8.5 8.5 0 0 0 6-6C68 35.7 68 24 68 24s0-11.7-1.5-16.3z" fill="#FF0000" />
                <path d="M27 34l18-10-18-10v20z" fill="#fff" />
              </svg>
            </div>
          </button>
        )}
      </div>
      <p className="video-title">{video.title}</p>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            Bull<span className="logo-accent">shift</span>
            <span className="logo-sub">Car Reviews</span>
          </h1>
          <p className="tagline">Comedy. Cars. And a lot of tongue.</p>
          <p className="host">Hosted by Dilan</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <LatestVideo />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="socials">
            <a
              href="https://www.youtube.com/@bullshiftcarreviews"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/>
              </svg>
              YouTube
            </a>
            <a
              href="https://www.facebook.com/Bullshiftcarreviews/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.3l-.5 3.5h-2.8v8.4C19.6 23.1 24 18.2 24 12.1z"/>
              </svg>
              Facebook
            </a>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} Bullshift Car Reviews. All rights reserved. Powered By BlackOps Solutions IT</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
