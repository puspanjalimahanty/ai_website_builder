import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWebsite = async () => {
    if (!prompt) return alert("Describe your website first");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/generate", {
        prompt,
      });
      setCode(res.data.code);
    } catch (err) {
      alert("Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">⚡ AI Site Builder</div>
      </div>

      {/* Hero */}
      <div className="hero">
        <h1>
          Turn your ideas into <span>websites</span> instantly with AI
        </h1>
        <p>Create modern, responsive websites in seconds — no coding required.</p>

        <div className="prompt-box">
          <textarea
            placeholder="Describe the website you want to build..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={generateWebsite} disabled={loading}>
            {loading ? "Generating..." : "Create with AI"}
          </button>
        </div>
      </div>

      {/* Preview */}
      {code && (
        <div className="preview">
          <h2>Live Preview</h2>
          <iframe
            title="preview"
            srcDoc={`<!DOCTYPE html>
<html>
<head>
<style>html{scroll-behavior:smooth;}</style>
</head>
<body>
${code}
</body>
</html>`}
          />
        </div>
      )}
    </div>
  );
}

export default App;
