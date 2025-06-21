import React, { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { useGameLoop } from "../../hooks/useGameLoop";
import {
  HUNTING_AREAS,
  getAvailableAreas,
  getNextAreaToUnlock,
} from "../../data/huntingAreas";
import {
  formatNumber,
  formatTimeShort,
  formatExpPerSecond,
} from "../../utils/formatters";
import { ShadowAssignmentModal } from "./ShadowAssignmentModal";
import {
  Swords,
  Play,
  Square,
  MapPin,
  Clock,
  Lock,
  Target,
  Users,
  Settings,
} from "lucide-react";

// Styles
const panelStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
};

const progressBarStyles: React.CSSProperties = {
  backgroundColor: "#1e293b",
  borderRadius: "12px",
  overflow: "hidden",
  height: "8px",
  position: "relative",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const progressFillStyles: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(90deg, #f97316, #ef4444)",
  borderRadius: "12px",
  transition: "width 0.1s ease",
  boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
};

const areaCardStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
};

const activeAreaCardStyles: React.CSSProperties = {
  ...areaCardStyles,
  background:
    "linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(37, 99, 235, 0.15))",
  border: "1px solid rgba(34, 211, 238, 0.4)",
  boxShadow: "0 8px 32px rgba(34, 211, 238, 0.2)",
};

const startButtonStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
};

const stopButtonStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
};

const lockedButtonStyles: React.CSSProperties = {
  backgroundColor: "#374151",
  color: "#9ca3af",
  border: "none",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "not-allowed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
};

const selectStyles: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#374151",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "6px",
  padding: "8px",
  fontSize: "14px",
};

export const HuntingPanel: React.FC = () => {
  const {
    player,
    isHunting,
    currentHuntingArea,
    huntingStartTime,
    startHunting,
    stopHunting,
    ownedShadows,
    shadowDeployments,
  } = useGameStore();

  const { getHuntingProgress, getRemainingTime } = useGameLoop();

  // Modal state
  const [shadowModalOpen, setShadowModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  // Force re-render every 100ms when hunting
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    if (isHunting) {
      const interval = setInterval(forceUpdate, 100);
      return () => clearInterval(interval);
    }
  }, [isHunting]);

  const availableAreas = getAvailableAreas(player.level);
  const nextArea = getNextAreaToUnlock(player.level);

  const handleStartHunting = (areaId: string) => {
    if (isHunting) {
      stopHunting();
    }
    startHunting(areaId);
  };

  const handleStopHunting = () => {
    stopHunting();
  };

  const openShadowModal = (areaId: string) => {
    setSelectedAreaId(areaId);
    setShadowModalOpen(true);
  };

  const getShadowsInArea = (areaId: string) => {
    const deployedIds = shadowDeployments[areaId] || [];
    return deployedIds.map((id) => ownedShadows[id]?.shadow).filter(Boolean);
  };

  const getAreaExpPerSecond = (areaId: string) => {
    const area = HUNTING_AREAS.find((a) => a.id === areaId);
    if (!area) return 0;

    const shadowsInArea = getShadowsInArea(areaId);
    const baseExpPerSecond = area.expReward / (area.huntDuration / 1000);

    return shadowsInArea.reduce((total, shadow) => {
      return total + baseExpPerSecond * shadow.currentExpMultiplier;
    }, 0);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "#9ca3af",
      uncommon: "#22c55e",
      rare: "#3b82f6",
      epic: "#a855f7",
      legendary: "#f59e0b",
    };
    return colors[rarity as keyof typeof colors] || "#9ca3af";
  };

  return (
    <div>
      {/* Hunting Areas */}
      <div style={panelStyles}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(37, 99, 235, 0.2))",
              border: "1px solid rgba(34, 211, 238, 0.3)",
            }}
          >
            <Swords
              style={{ width: "24px", height: "24px", color: "#22d3ee" }}
            />
          </div>
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                margin: "0 0 4px 0",
              }}
            >
              Hunting Areas
            </h2>
            <p style={{ margin: 0, color: "#94a3b8" }}>
              Hunt manually or deploy shadows
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {availableAreas.map((area) => {
            const isCurrentArea = currentHuntingArea === area.id;
            const isCurrentlyHunting = isHunting && isCurrentArea;
            const canHunt = player.level >= area.unlockLevel;
            const shadowsInArea = getShadowsInArea(area.id);
            const areaExpPerSecond = getAreaExpPerSecond(area.id);

            return (
              <div
                key={area.id}
                style={
                  isCurrentlyHunting ? activeAreaCardStyles : areaCardStyles
                }
                onMouseEnter={(e) => {
                  if (canHunt && !isCurrentlyHunting) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.3)";
                    e.currentTarget.style.borderColor =
                      "rgba(34, 211, 238, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canHunt && !isCurrentlyHunting) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.1)";
                  }
                }}
              >
                {/* Area Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {area.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#94a3b8",
                        lineHeight: "1.4",
                      }}
                    >
                      {area.description}
                    </p>
                  </div>
                  {isCurrentlyHunting && (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Hunting
                    </div>
                  )}
                  {shadowsInArea.length > 0 && !isCurrentlyHunting && (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {shadowsInArea.length} Shadow
                      {shadowsInArea.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Area Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#64748b",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                      Level {area.level}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Clock
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#64748b",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                      {(area.huntDuration / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Hunting Progress (only when manually hunting) */}
                {isCurrentlyHunting && (
                  <div style={{ marginBottom: "16px" }}>
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
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#f8fafc",
                        }}
                      >
                        Progress
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#22d3ee",
                          fontWeight: "600",
                        }}
                      >
                        {formatTimeShort(getRemainingTime())}
                      </span>
                    </div>
                    <div style={progressBarStyles}>
                      <div
                        style={{
                          ...progressFillStyles,
                          width: `${getHuntingProgress()}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* EXP Reward */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#22c55e",
                        marginBottom: "4px",
                        fontWeight: "600",
                      }}
                    >
                      EXP Reward
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#22c55e",
                      }}
                    >
                      +{formatNumber(area.expReward)}
                    </div>
                  </div>
                </div>

                {/* Shadow Management */}
                <div style={{ marginBottom: "16px" }}>
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
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      Shadow Army
                    </span>
                    <button
                      onClick={() => openShadowModal(area.id)}
                      style={{
                        backgroundColor: "rgba(168, 85, 247, 0.2)",
                        border: "1px solid rgba(168, 85, 247, 0.4)",
                        borderRadius: "6px",
                        color: "#a855f7",
                        fontSize: "11px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(168, 85, 247, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(168, 85, 247, 0.2)";
                      }}
                    >
                      <Settings style={{ width: "12px", height: "12px" }} />
                      Manage
                    </button>
                  </div>

                  {shadowsInArea.length > 0 ? (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Users
                            style={{
                              width: "14px",
                              height: "14px",
                              color: "#22c55e",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#22c55e",
                            }}
                          >
                            {shadowsInArea.length} Shadow
                            {shadowsInArea.length > 1 ? "s" : ""} Deployed
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#22c55e",
                          }}
                        >
                          +{formatExpPerSecond(areaExpPerSecond)} EXP/s
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Shadows are automatically farming this area
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "rgba(100, 116, 139, 0.1)",
                        border: "1px solid rgba(100, 116, 139, 0.2)",
                        borderRadius: "8px",
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginBottom: "4px",
                        }}
                      >
                        No shadows deployed
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        Click "Manage" to assign shadows
                      </div>
                    </div>
                  )}
                </div>

                {/* Shadow Drops */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Shadow Drops:
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {area.shadowDrops.map((shadowDrop, index) => {
                      const rarityColor = getRarityColor(shadowDrop.rarity);

                      return (
                        <div
                          key={index}
                          style={{
                            ...shadowDropTagStyles,
                            borderColor: rarityColor + "40",
                            backgroundColor: rarityColor + "10",
                            color: rarityColor,
                          }}
                        >
                          <span>{shadowDrop.icon}</span>
                          <span>{shadowDrop.name}</span>
                          <span style={{ fontSize: "9px", opacity: 0.8 }}>
                            ({shadowDrop.dropChance}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                {canHunt ? (
                  <button
                    onClick={() =>
                      isCurrentlyHunting
                        ? handleStopHunting()
                        : handleStartHunting(area.id)
                    }
                    style={
                      isCurrentlyHunting ? stopButtonStyles : startButtonStyles
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      const color = isCurrentlyHunting
                        ? "rgba(239, 68, 68, 0.4)"
                        : "rgba(34, 197, 94, 0.4)";
                      e.currentTarget.style.boxShadow = `0 6px 16px ${color}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isCurrentlyHunting ? (
                      <>
                        <Square style={{ width: "16px", height: "16px" }} />
                        Stop Hunting
                      </>
                    ) : (
                      <>
                        <Play style={{ width: "16px", height: "16px" }} />
                        Start Hunting
                      </>
                    )}
                  </button>
                ) : (
                  <button style={lockedButtonStyles}>
                    <Lock style={{ width: "16px", height: "16px" }} />
                    Requires Level {area.unlockLevel}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Area to Unlock */}
        {nextArea && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background:
                "linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.1))",
              border: "1px solid rgba(100, 116, 139, 0.2)",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Lock
                style={{ width: "20px", height: "20px", color: "#64748b" }}
              />
              <div>
                <h4
                  style={{
                    fontWeight: "600",
                    color: "#e2e8f0",
                    margin: "0 0 4px 0",
                  }}
                >
                  Next Area: {nextArea.name}
                </h4>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                  Unlocks at level {nextArea.unlockLevel}
                  <span style={{ color: "#22d3ee", fontWeight: "600" }}>
                    {" "}
                    ({nextArea.unlockLevel - player.level} levels to go)
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hunting Tips */}
      <div style={panelStyles}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))",
              border: "1px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            <Target
              style={{ width: "20px", height: "20px", color: "#a855f7" }}
            />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
            Hunting Tips
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#22d3ee",
                borderRadius: "50%",
                marginTop: "6px",
                flexShrink: 0,
              }}
            ></div>
            <p
              style={{
                fontSize: "14px",
                color: "#e2e8f0",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              <strong>Manual Hunting:</strong> Hunt manually to extract shadows
              and gain EXP quickly
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#22d3ee",
                borderRadius: "50%",
                marginTop: "6px",
                flexShrink: 0,
              }}
            ></div>
            <p
              style={{
                fontSize: "14px",
                color: "#e2e8f0",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              <strong>Shadow Assignment:</strong> Deploy shadows to areas for
              automatic EXP farming
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#22d3ee",
                borderRadius: "50%",
                marginTop: "6px",
                flexShrink: 0,
              }}
            ></div>
            <p
              style={{
                fontSize: "14px",
                color: "#e2e8f0",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              <strong>Shadow Rarity:</strong> Higher rarity shadows provide
              better EXP multipliers
            </p>
          </div>
        </div>
      </div>

      {/* Shadow Assignment Modal */}
      <ShadowAssignmentModal
        areaId={selectedAreaId}
        isOpen={shadowModalOpen}
        onClose={() => setShadowModalOpen(false)}
      />
    </div>
  );
};
