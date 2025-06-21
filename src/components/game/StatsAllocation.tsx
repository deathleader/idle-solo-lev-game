// src/components/game/StatAllocation.tsx
import React from "react";
import { useGameStore } from "../../stores/gameStore";
import { Plus, Zap, TrendingUp, Target, Brain, Heart, Eye } from "lucide-react";
import type { PlayerStats } from "../../types/game";

// Styles
const panelStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "24px",
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
};

const titleSectionStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const iconContainerStyles: React.CSSProperties = {
  padding: "12px",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(37, 99, 235, 0.2))",
  border: "1px solid rgba(34, 211, 238, 0.3)",
};

const pointsBadgeStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, #22d3ee, #2563eb)",
  color: "white",
  borderRadius: "20px",
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  boxShadow: "0 4px 12px rgba(34, 211, 238, 0.3)",
};

const statCardStyles = (color: string): React.CSSProperties => ({
  background: `linear-gradient(135deg, ${color}10, ${color}05)`,
  border: `1px solid ${color}30`,
  borderRadius: "16px",
  padding: "20px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
});

const statHeaderStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const statInfoStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const statIconStyles = (color: string): React.CSSProperties => ({
  padding: "8px",
  borderRadius: "10px",
  background: `${color}20`,
  border: `1px solid ${color}40`,
});

const addButtonStyles = (color: string): React.CSSProperties => ({
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  border: `2px solid ${color}40`,
  background: `linear-gradient(135deg, ${color}20, ${color}10)`,
  color: color,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  fontSize: "0",
  boxShadow: `0 4px 12px ${color}20`,
});

const noPointsStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "40px 20px",
  background:
    "linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.1))",
  border: "1px solid rgba(100, 116, 139, 0.2)",
  borderRadius: "16px",
};

const tipStyles: React.CSSProperties = {
  marginTop: "24px",
  padding: "16px",
  background:
    "linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))",
  border: "1px solid rgba(251, 191, 36, 0.2)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
};

export const StatsAllocation: React.FC = () => {
  const { player, allocateStatPoint } = useGameStore();

  const statConfig = [
    {
      key: "strength" as keyof PlayerStats,
      name: "Strength",
      color: "#ef4444",
      icon: TrendingUp,
      description: "Increases physical damage and melee effectiveness",
    },
    {
      key: "agility" as keyof PlayerStats,
      name: "Agility",
      color: "#22c55e",
      icon: Target,
      description: "Increases speed and critical hit chance",
    },
    {
      key: "intelligence" as keyof PlayerStats,
      name: "Intelligence",
      color: "#3b82f6",
      icon: Brain,
      description: "Increases mana and magical damage",
    },
    {
      key: "vitality" as keyof PlayerStats,
      name: "Vitality",
      color: "#a855f7",
      icon: Heart,
      description: "Increases health and stamina",
    },
    {
      key: "sense" as keyof PlayerStats,
      name: "Sense",
      color: "#eab308",
      icon: Eye,
      description: "Increases perception and detection abilities",
    },
  ];

  if (player.availableStatPoints === 0) {
    return (
      <div style={panelStyles}>
        <div style={noPointsStyles}>
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.2))",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            <Zap style={{ width: "32px", height: "32px", color: "#64748b" }} />
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#94a3b8",
              margin: "0 0 8px 0",
            }}
          >
            No Stat Points Available
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Level up to gain more stat points to allocate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <div style={titleSectionStyles}>
          <div style={iconContainerStyles}>
            <Zap style={{ width: "20px", height: "20px", color: "#22d3ee" }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                margin: "0 0 4px 0",
              }}
            >
              Allocate Stat Points
            </h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
              Enhance your hunter abilities
            </p>
          </div>
        </div>

        <div style={pointsBadgeStyles}>
          <Zap style={{ width: "16px", height: "16px" }} />
          {player.availableStatPoints} points
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {statConfig.map((stat) => {
          const IconComponent = stat.icon;

          return (
            <div
              key={stat.key}
              style={statCardStyles(stat.color)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={statHeaderStyles}>
                <div style={statInfoStyles}>
                  <div style={statIconStyles(stat.color)}>
                    <IconComponent
                      style={{
                        width: "20px",
                        height: "20px",
                        color: stat.color,
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: stat.color,
                        }}
                      >
                        {stat.name}
                      </span>
                      <div
                        style={{
                          background: `${stat.color}20`,
                          border: `1px solid ${stat.color}40`,
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: stat.color,
                        }}
                      >
                        {player.stats[stat.key]}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#94a3b8",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      {stat.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => allocateStatPoint(stat.key)}
                  style={addButtonStyles(stat.color)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = `0 6px 16px ${stat.color}40`;
                    e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}30, ${stat.color}20)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = `0 4px 12px ${stat.color}20`;
                    e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`;
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  title={`Add 1 point to ${stat.name}`}
                >
                  <Plus style={{ width: "20px", height: "20px" }} />
                </button>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: "6px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`,
                    width: `${Math.min(
                      (player.stats[stat.key] / 50) * 100,
                      100
                    )}%`,
                    transition: "width 0.3s ease",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={tipStyles}>
        <div
          style={{
            padding: "8px",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))",
            flexShrink: 0,
          }}
        >
          💡
        </div>
        <div>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#fbbf24",
              margin: "0 0 4px 0",
            }}
          >
            Pro Tip
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: 0,
              lineHeight: "1.4",
            }}
          >
            Balanced stats work well for beginners, but specializing in specific
            areas can create powerful builds. Experiment with different
            combinations to find your playstyle!
          </p>
        </div>
      </div>
    </div>
  );
};
