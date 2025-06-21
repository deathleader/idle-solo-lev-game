// src/components/game/ShadowAssignmentModal.tsx
import React, { useState, useEffect } from "react";
import { useGameStore } from "../../stores/gameStore";
import { formatExpPerSecond } from "../../utils/formatters";
import { getRarityColor } from "../../data/shadows";
import { getHuntingAreaById } from "../../data/huntingAreas";
import { X, Users, Check } from "lucide-react";

interface ShadowAssignmentModalProps {
  areaId: string;
  isOpen: boolean;
  onClose: () => void;
}

const modalOverlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
};

const shadowItemStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  marginBottom: "8px",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const selectedShadowStyles: React.CSSProperties = {
  ...shadowItemStyles,
  background:
    "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))",
  border: "1px solid rgba(34, 197, 94, 0.4)",
};

const deployedShadowStyles: React.CSSProperties = {
  ...shadowItemStyles,
  background:
    "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(37, 99, 235, 0.2))",
  border: "1px solid rgba(34, 211, 238, 0.4)",
};

const buttonStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const ShadowAssignmentModal: React.FC<ShadowAssignmentModalProps> = ({
  areaId,
  isOpen,
  onClose,
}) => {
  const { ownedShadows, shadowDeployments, deployShadow, recallShadow } =
    useGameStore();

  const [selectedShadows, setSelectedShadows] = useState<Set<string>>(
    new Set()
  );

  const area = getHuntingAreaById(areaId);
  const allShadows = Object.values(ownedShadows);
  const currentlyDeployedInArea = shadowDeployments[areaId] || [];

  // Initialize selected shadows with currently deployed ones
  useEffect(() => {
    if (isOpen) {
      setSelectedShadows(new Set(currentlyDeployedInArea));
    }
  }, [isOpen, currentlyDeployedInArea]);

  if (!isOpen || !area) return null;

  const toggleShadowSelection = (shadowId: string) => {
    const newSelected = new Set(selectedShadows);
    if (newSelected.has(shadowId)) {
      newSelected.delete(shadowId);
    } else {
      newSelected.add(shadowId);
    }
    setSelectedShadows(newSelected);
  };

  const calculateExpPreview = () => {
    const baseExpPerSecond = area.expReward / (area.huntDuration / 1000);
    let totalExp = 0;

    selectedShadows.forEach((shadowId) => {
      const shadow = ownedShadows[shadowId]?.shadow;
      if (shadow) {
        totalExp += baseExpPerSecond * shadow.currentExpMultiplier;
      }
    });

    return totalExp;
  };

  const handleConfirm = () => {
    // First, recall all shadows currently in this area
    currentlyDeployedInArea.forEach((shadowId) => {
      recallShadow(shadowId);
    });

    // Then deploy all selected shadows
    selectedShadows.forEach((shadowId) => {
      const shadow = ownedShadows[shadowId]?.shadow;
      if (shadow && !shadow.isDeployed) {
        deployShadow(shadowId, areaId);
      }
    });

    onClose();
  };

  const previewExp = calculateExpPreview();

  return (
    <div style={modalOverlayStyles} onClick={onClose}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Assign Shadows
            </h3>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
              {area.name} • Select shadows to deploy
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Preview Stats */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users
                style={{ width: "16px", height: "16px", color: "#22c55e" }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#22c55e",
                }}
              >
                Selected: {selectedShadows.size} shadows
              </span>
            </div>
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#22c55e" }}
            >
              +{formatExpPerSecond(previewExp)} EXP/sec
            </div>
          </div>
        </div>

        {/* Shadow List */}
        <div
          style={{
            marginBottom: "20px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#e2e8f0",
            }}
          >
            Available Shadows ({allShadows.length})
          </h4>

          {allShadows.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
            >
              <Users
                style={{ width: "48px", height: "48px", margin: "0 auto 16px" }}
              />
              <p style={{ margin: 0 }}>
                No shadows available. Hunt monsters to extract shadows!
              </p>
            </div>
          ) : (
            allShadows.map((ownedShadow) => {
              const shadow = ownedShadow.shadow;
              const isSelected = selectedShadows.has(ownedShadow.shadowId);
              const isDeployedElsewhere =
                shadow.isDeployed && shadow.deployedArea !== areaId;
              const rarityColor = getRarityColor(shadow.rarity);

              let itemStyle = shadowItemStyles;
              if (isSelected) {
                itemStyle = selectedShadowStyles;
              } else if (isDeployedElsewhere) {
                itemStyle = deployedShadowStyles;
              }

              return (
                <div
                  key={ownedShadow.shadowId}
                  style={itemStyle}
                  onClick={() =>
                    !isDeployedElsewhere &&
                    toggleShadowSelection(ownedShadow.shadowId)
                  }
                  onMouseEnter={(e) => {
                    if (!isDeployedElsewhere && !isSelected) {
                      e.currentTarget.style.borderColor =
                        "rgba(34, 197, 94, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeployedElsewhere && !isSelected) {
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{shadow.icon}</span>
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
                            fontSize: "14px",
                            fontWeight: "600",
                            color: rarityColor,
                          }}
                        >
                          {shadow.name}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            color: "#60a5fa",
                          }}
                        >
                          Lv.{shadow.level}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {shadow.currentExpMultiplier.toFixed(1)}x multiplier
                        {isDeployedElsewhere && (
                          <span style={{ color: "#22d3ee", marginLeft: "8px" }}>
                            • Deployed in {shadow.deployedArea}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    {isSelected && (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: "#22c55e",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          style={{
                            width: "12px",
                            height: "12px",
                            color: "white",
                          }}
                        />
                      </div>
                    )}
                    {isDeployedElsewhere && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          fontStyle: "italic",
                        }}
                      >
                        Deployed
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#374151",
              color: "#d1d5db",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={buttonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(34, 197, 94, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
