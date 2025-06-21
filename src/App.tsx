// src/App.tsx
import React from "react";
import { useGameLoop } from "./hooks/useGameLoop";
import { useOfflineProgress } from "./hooks/useOfflineProgress";
import { PlayerStats } from "./components/game/PlayerStats";
import { HuntingPanel } from "./components/game/HuntingPanel";
import { LevelUpNotification } from "./components/ui/LevelUpNotification";

const appStyles: React.CSSProperties = {
  minHeight: "100vh",
  padding: "16px",
  backgroundColor: "#020617",
  color: "white",
  fontFamily: "Inter, system-ui, sans-serif",
  backgroundImage: `
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(120, 200, 255, 0.1) 0%, transparent 50%)
  `,
  backgroundAttachment: "fixed",
  margin: 0,
  width: "100%",
};

const containerStyles: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

const titleStyles: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  background: "linear-gradient(to right, #22d3ee, #2563eb)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "8px",
};

const subtitleStyles: React.CSSProperties = {
  color: "#94a3b8",
};

const gridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
};

const gridLargeStyles: React.CSSProperties = {
  ...gridStyles,
  gridTemplateColumns: "320px 1fr",
};

const leftColumnStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const rightColumnStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const footerStyles: React.CSSProperties = {
  textAlign: "center",
  marginTop: "32px",
  color: "#64748b",
  fontSize: "0.875rem",
};

function App() {
  // Initialize game hooks
  useGameLoop();
  useOfflineProgress();

  // Check if screen is large (simplified)
  const [isLarge, setIsLarge] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={appStyles}>
      <div style={containerStyles}>
        {/* Header */}
        <header style={headerStyles}>
          <h1 style={titleStyles}>Solo Leveling Idle</h1>
          <p style={subtitleStyles}>
            Rise from E-Rank to become the strongest hunter
          </p>
        </header>

        {/* Main Game Layout */}
        <div style={isLarge ? gridLargeStyles : gridStyles}>
          {/* Left Column - Player Stats */}
          <div style={leftColumnStyles}>
            <PlayerStats />
          </div>

          {/* Right Column - Hunting */}
          <div style={rightColumnStyles}>
            <HuntingPanel />
          </div>
        </div>

        {/* Footer */}
        <footer style={footerStyles}>
          <p>Inspired by Solo Leveling • Made with React & TypeScript</p>
        </footer>
      </div>

      {/* Notifications */}
      <LevelUpNotification />
    </div>
  );
}

export default App;
