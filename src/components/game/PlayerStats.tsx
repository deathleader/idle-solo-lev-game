// src/components/game/PlayerStats.tsx
import React, { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { formatNumber, formatExpPerSecond } from "../../utils/formatters";
import {
  User,
  Star,
  Users,
  Sword,
  Package,
  Settings,
} from "lucide-react";
import { ShadowManagement } from "./ShadowManagement";

const panelStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "24px",
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
};

const avatarStyles: React.CSSProperties = {
  padding: "8px",
  borderRadius: "8px",
  backgroundColor: "rgba(34, 211, 238, 0.2)",
  border: "1px solid rgba(34, 211, 238, 0.3)",
};

const expBarContainer: React.CSSProperties = {
  marginBottom: "24px",
};

const expBarStyles: React.CSSProperties = {
  backgroundColor: "#1e293b",
  borderRadius: "9999px",
  overflow: "hidden",
  height: "12px",
  marginBottom: "4px",
};

const expBarFillStyles: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(to right, #10b981, #059669)",
  transition: "width 0.5s ease",
};

const statsGridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginBottom: "24px",
};

const statCardStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "12px",
};

const statSenseStyles: React.CSSProperties = {
  ...statCardStyles,
  gridColumn: "span 2",
};

const shadowStatsStyles: React.CSSProperties = {
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  paddingTop: "16px",
};

const toolbarStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  padding: "16px 0",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  marginTop: "16px",
};

const toolbarIconStyles: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const modalOverlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: "#1e293b",
  borderRadius: "16px",
  padding: "24px",
  maxWidth: "600px",
  maxHeight: "80vh",
  width: "90%",
  overflowY: "auto",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

export const PlayerStats: React.FC = () => {
  const {
    player,
    getExpPercentage,
    getTotalShadows,
    getDeployedShadows,
    getShadowExpPerSecond,
    allocateStatPoint,
  } = useGameStore();
  const [showShadowModal, setShowShadowModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "E":
        return "#9ca3af";
      case "D":
        return "#4ade80";
      case "C":
        return "#60a5fa";
      case "B":
        return "#a855f7";
      case "A":
        return "#fb923c";
      case "S":
        return "#f87171";
      case "National":
        return "#facc15";
      default:
        return "#9ca3af";
    }
  };

  const deployedShadows = getDeployedShadows();
  const shadowExpPerSecond = getShadowExpPerSecond();

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <div
          style={{
            ...avatarStyles,
            boxShadow: `0 0 10px ${getRankColor(player.rank)}30`,
          }}
        >
          <User
            style={{
              width: "24px",
              height: "24px",
              color: getRankColor(player.rank),
            }}
          />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            {player.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: getRankColor(player.rank),
              }}
            >
              {player.rank}-Rank Hunter
            </span>
            <span style={{ color: "#94a3b8" }}>• Level {player.level}</span>
          </div>
        </div>
      </div>

      {/* Experience Bar */}
      <div style={expBarContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Star style={{ width: "16px", height: "16px", color: "#facc15" }} />
            Experience
          </span>
          <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
            {formatNumber(player.currentExp)} / {formatNumber(player.expToNext)}
          </span>
        </div>
        <div style={expBarStyles}>
          <div
            style={{ ...expBarFillStyles, width: `${getExpPercentage()}%` }}
          />
        </div>
        <div
          style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}
        >
          {getExpPercentage().toFixed(1)}% to next level
        </div>
        {shadowExpPerSecond > 0 && (
          <div
            style={{ fontSize: "0.75rem", color: "#22c55e", marginTop: "2px" }}
          >
            +{formatExpPerSecond(shadowExpPerSecond)} EXP/sec from shadows
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#f87171",
                borderRadius: "50%",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Strength
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#f87171",
              }}
            >
              {formatNumber(player.stats.strength)}
            </span>
            {player.availableStatPoints > 0 && (
              <button
                onClick={() => allocateStatPoint("strength")}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #f87171",
                  backgroundColor: "rgba(248, 113, 113, 0.1)",
                  color: "#f87171",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(248, 113, 113, 0.2)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(248, 113, 113, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                +
              </button>
            )}
          </div>
        </div>

        <div style={statCardStyles}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#4ade80",
                borderRadius: "50%",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Agility
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#4ade80",
              }}
            >
              {formatNumber(player.stats.agility)}
            </span>
            {player.availableStatPoints > 0 && (
              <button
                onClick={() => allocateStatPoint("agility")}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #4ade80",
                  backgroundColor: "rgba(74, 222, 128, 0.1)",
                  color: "#4ade80",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(74, 222, 128, 0.2)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(74, 222, 128, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                +
              </button>
            )}
          </div>
        </div>

        <div style={statCardStyles}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#60a5fa",
                borderRadius: "50%",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Intelligence
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#60a5fa",
              }}
            >
              {formatNumber(player.stats.intelligence)}
            </span>
            {player.availableStatPoints > 0 && (
              <button
                onClick={() => allocateStatPoint("intelligence")}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #60a5fa",
                  backgroundColor: "rgba(96, 165, 250, 0.1)",
                  color: "#60a5fa",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(96, 165, 250, 0.2)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(96, 165, 250, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                +
              </button>
            )}
          </div>
        </div>

        <div style={statCardStyles}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#a855f7",
                borderRadius: "50%",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Vitality
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#a855f7",
              }}
            >
              {formatNumber(player.stats.vitality)}
            </span>
            {player.availableStatPoints > 0 && (
              <button
                onClick={() => allocateStatPoint("vitality")}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #a855f7",
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  color: "#a855f7",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(168, 85, 247, 0.2)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(168, 85, 247, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                +
              </button>
            )}
          </div>
        </div>

        <div style={statSenseStyles}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#facc15",
                borderRadius: "50%",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Sense
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#facc15",
              }}
            >
              {formatNumber(player.stats.sense)}
            </span>
            {player.availableStatPoints > 0 && (
              <button
                onClick={() => allocateStatPoint("sense")}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #facc15",
                  backgroundColor: "rgba(250, 204, 21, 0.1)",
                  color: "#facc15",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(250, 204, 21, 0.2)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(250, 204, 21, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shadow Army Stats */}
      <div style={shadowStatsStyles}>
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 0 12px 0",
          }}
        >
          <Users style={{ width: "16px", height: "16px", color: "#a855f7" }} />
          Shadow Army
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              Total Shadows
            </span>
            <span style={{ color: "#a855f7", fontWeight: "500" }}>
              {getTotalShadows()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              Deployed
            </span>
            <span style={{ color: "#22c55e", fontWeight: "500" }}>
              {deployedShadows.length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              EXP/sec
            </span>
            <span style={{ color: "#facc15", fontWeight: "500" }}>
              +{formatExpPerSecond(shadowExpPerSecond)}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={toolbarStyles}>
        <div
          style={toolbarIconStyles}
          onClick={() => setShowEquipmentModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
          title="Equipment"
        >
          <Sword style={{ width: "20px", height: "20px", color: "#ef4444" }} />
        </div>

        <div
          style={toolbarIconStyles}
          onClick={() => setShowInventoryModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
            e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
          title="Inventory"
        >
          <Package
            style={{ width: "20px", height: "20px", color: "#22c55e" }}
          />
        </div>

        <div
          style={toolbarIconStyles}
          onClick={() => setShowShadowModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(168, 85, 247, 0.1)";
            e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
          title="Shadow Army"
        >
          <Users style={{ width: "20px", height: "20px", color: "#a855f7" }} />
        </div>

        <div
          style={toolbarIconStyles}
          onClick={() => setShowSettingsModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            e.currentTarget.style.borderColor = "rgba(100, 116, 139, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
          title="Settings"
        >
          <Settings
            style={{ width: "20px", height: "20px", color: "#64748b" }}
          />
        </div>
      </div>

      {/* Shadow Army Modal */}
      {showShadowModal && (
        <div
          style={modalOverlayStyles}
          onClick={() => setShowShadowModal(false)}
        >
          <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Shadow Army Management
              </h3>
              <button
                onClick={() => setShowShadowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <ShadowManagement />
          </div>
        </div>
      )}

      {/* Equipment Modal (Placeholder) */}
      {showEquipmentModal && (
        <div
          style={modalOverlayStyles}
          onClick={() => setShowEquipmentModal(false)}
        >
          <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Equipment
              </h3>
              <button
                onClick={() => setShowEquipmentModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              <Sword
                style={{ width: "48px", height: "48px", margin: "0 auto 16px" }}
              />
              <h4 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>
                Equipment System
              </h4>
              <p style={{ margin: 0 }}>
                Coming soon! Equip weapons and armor to boost your hunting
                power.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal (Placeholder) */}
      {showInventoryModal && (
        <div
          style={modalOverlayStyles}
          onClick={() => setShowInventoryModal(false)}
        >
          <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Inventory
              </h3>
              <button
                onClick={() => setShowInventoryModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              <Package
                style={{ width: "48px", height: "48px", margin: "0 auto 16px" }}
              />
              <h4 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>
                Inventory System
              </h4>
              <p style={{ margin: 0 }}>
                Coming soon! Store and manage your items and resources.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (Placeholder) */}
      {showSettingsModal && (
        <div
          style={modalOverlayStyles}
          onClick={() => setShowSettingsModal(false)}
        >
          <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              <Settings
                style={{ width: "48px", height: "48px", margin: "0 auto 16px" }}
              />
              <h4 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>
                Game Settings
              </h4>
              <p style={{ margin: 0 }}>
                Coming soon! Customize your game experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
