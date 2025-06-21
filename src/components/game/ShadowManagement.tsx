import React, { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { formatNumber } from "../../utils/formatters";
import { getRarityColor, getRarityGlow } from "../../data/shadows";
import { getAvailableAreas } from "../../data/huntingAreas";
import {
  Users,
  Play,
  Square,
  TrendingUp,
  MapPin,
  Star,
  Zap,
} from "lucide-react";

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
  gap: "16px",
  marginBottom: "24px",
};

const iconContainerStyles: React.CSSProperties = {
  padding: "12px",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))",
  border: "1px solid rgba(168, 85, 247, 0.3)",
};

const shadowCardStyles: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
  transition: "all 0.3s ease",
};

const deployedCardStyles: React.CSSProperties = {
  ...shadowCardStyles,
  background:
    "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))",
  border: "1px solid rgba(34, 197, 94, 0.3)",
};

const shadowHeaderStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const shadowInfoStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const levelBadgeStyles: React.CSSProperties = {
  backgroundColor: "rgba(59, 130, 246, 0.2)",
  border: "1px solid rgba(59, 130, 246, 0.4)",
  borderRadius: "12px",
  padding: "4px 8px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#60a5fa",
};

const deployButtonStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.2s ease",
};

const recallButtonStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.2s ease",
};

const selectStyles: React.CSSProperties = {
  backgroundColor: "#374151",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "6px",
  padding: "6px 8px",
  fontSize: "12px",
  marginLeft: "8px",
  minWidth: "120px",
};

const noShadowsStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "40px 20px",
  color: "#64748b",
};

const expBarStyles: React.CSSProperties = {
  backgroundColor: "#1e293b",
  borderRadius: "8px",
  overflow: "hidden",
  height: "6px",
  marginTop: "8px",
};

export const ShadowManagement: React.FC = () => {
  const { player, ownedShadows, deployShadow, recallShadow } = useGameStore();

  const [selectedAreas, setSelectedAreas] = useState<{
    [shadowId: string]: string;
  }>({});

  const shadowArray = Object.values(ownedShadows);
  const availableAreas = getAvailableAreas(player.level);

  const handleDeploy = (shadowId: string) => {
    const areaId = selectedAreas[shadowId];
    if (areaId) {
      deployShadow(shadowId, areaId);
    }
  };

  const handleRecall = (shadowId: string) => {
    recallShadow(shadowId);
  };

  const handleAreaChange = (shadowId: string, areaId: string) => {
    setSelectedAreas((prev) => ({
      ...prev,
      [shadowId]: areaId,
    }));
  };

  if (shadowArray.length === 0) {
    return (
      <div style={panelStyles}>
        <div style={headerStyles}>
          <div style={iconContainerStyles}>
            <Users
              style={{ width: "24px", height: "24px", color: "#a855f7" }}
            />
          </div>
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "800",
                margin: "0 0 4px 0",
              }}
            >
              Shadow Army
            </h2>
            <p style={{ margin: 0, color: "#94a3b8" }}>
              Manage your extracted shadows
            </p>
          </div>
        </div>

        <div style={noShadowsStyles}>
          <Users
            style={{
              width: "48px",
              height: "48px",
              color: "#64748b",
              margin: "0 auto 16px",
            }}
          />
          <h3
            style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 8px 0" }}
          >
            No Shadows Extracted
          </h3>
          <p style={{ fontSize: "14px", margin: 0, lineHeight: "1.4" }}>
            Hunt monsters in dungeons to extract shadows and build your army!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <div style={iconContainerStyles}>
          <Users style={{ width: "24px", height: "24px", color: "#a855f7" }} />
        </div>
        <div>
          <h2
            style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 4px 0" }}
          >
            Shadow Army
          </h2>
          <p style={{ margin: 0, color: "#94a3b8" }}>
            {shadowArray.length} shadows •{" "}
            {shadowArray.filter((s) => s.shadow.isDeployed).length} deployed
          </p>
        </div>
      </div>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {shadowArray.map((ownedShadow) => {
          const shadow = ownedShadow.shadow;
          const rarityColor = getRarityColor(shadow.rarity);
          const isDeployed = shadow.isDeployed;

          const expPercentage =
            shadow.level >= shadow.maxLevel
              ? 100
              : (shadow.currentExp / shadow.expToNext) * 100;

          return (
            <div
              key={ownedShadow.shadowId}
              style={isDeployed ? deployedCardStyles : shadowCardStyles}
              onMouseEnter={(e) => {
                if (!isDeployed) {
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeployed) {
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.1)";
                }
              }}
            >
              <div style={shadowHeaderStyles}>
                <div style={shadowInfoStyles}>
                  <span style={{ fontSize: "24px" }}>{shadow.icon}</span>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: rarityColor,
                        }}
                      >
                        {shadow.name}
                      </span>
                      <div style={levelBadgeStyles}>Lv. {shadow.level}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {shadow.description}
                    </div>
                  </div>
                </div>

                {isDeployed ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#22c55e",
                        textAlign: "right",
                      }}
                    >
                      <div style={{ fontWeight: "600" }}>Deployed</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <MapPin style={{ width: "12px", height: "12px" }} />
                        {shadow.deployedArea}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRecall(ownedShadow.shadowId)}
                      style={recallButtonStyles}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(239, 68, 68, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Square style={{ width: "12px", height: "12px" }} />
                      Recall
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <select
                      value={selectedAreas[ownedShadow.shadowId] || ""}
                      onChange={(e) =>
                        handleAreaChange(ownedShadow.shadowId, e.target.value)
                      }
                      style={selectStyles}
                    >
                      <option value="">Select Area</option>
                      {availableAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDeploy(ownedShadow.shadowId)}
                      disabled={!selectedAreas[ownedShadow.shadowId]}
                      style={{
                        ...deployButtonStyles,
                        opacity: selectedAreas[ownedShadow.shadowId] ? 1 : 0.5,
                        cursor: selectedAreas[ownedShadow.shadowId]
                          ? "pointer"
                          : "not-allowed",
                        marginLeft: "8px",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAreas[ownedShadow.shadowId]) {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(34, 197, 94, 0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Play style={{ width: "12px", height: "12px" }} />
                      Deploy
                    </button>
                  </div>
                )}
              </div>

              {/* Shadow Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "2px",
                    }}
                  >
                    EXP Mult
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#facc15",
                    }}
                  >
                    {shadow.currentExpMultiplier.toFixed(1)}x
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "2px",
                    }}
                  >
                    Rarity
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: rarityColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {shadow.rarity}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "2px",
                    }}
                  >
                    Max Lv
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#60a5fa",
                    }}
                  >
                    {shadow.maxLevel}
                  </div>
                </div>
              </div>

              {/* EXP Bar */}
              {shadow.level < shadow.maxLevel && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Star style={{ width: "12px", height: "12px" }} />
                      Shadow EXP
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {formatNumber(shadow.currentExp)} /{" "}
                      {formatNumber(shadow.expToNext)}
                    </span>
                  </div>
                  <div style={expBarStyles}>
                    <div
                      style={{
                        height: "100%",
                        background: `linear-gradient(to right, ${rarityColor}, ${rarityColor}dd)`,
                        width: `${expPercentage}%`,
                        transition: "width 0.3s ease",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              )}

              {shadow.level >= shadow.maxLevel && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                    borderRadius: "6px",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#fbbf24",
                      fontWeight: "600",
                    }}
                  >
                    ⭐ MAX LEVEL REACHED ⭐
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
