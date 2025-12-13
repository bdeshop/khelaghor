import { useState, useEffect } from "react";
import { getPromotions, deletePromotion } from "../config/api";
import { Gift, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import AddPromotionModal from "./AddPromotionModal";
import EditPromotionModal from "./EditPromotionModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./Promotions.css";

interface GameType {
  _id: string;
  name: string;
}

interface PaymentMethod {
  _id: string;
  method_name_en: string;
  method_name_bd?: string;
  method_image?: string;
}

interface BonusSettings {
  bonusType: string;
  bonusAmount?: number;
  bonusPercentage?: number;
  maxBonusAmount?: number;
  minDepositAmount?: number;
}

interface Promotion {
  _id: string;
  promotionImage?: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  gameType: GameType | string;
  paymentMethods?: PaymentMethod[] | string;
  bonusSettings?: BonusSettings | string;
  createdAt: string;
  updatedAt: string;
}

function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPromotions();
      const promotionsData = response.promotions || response;
      setPromotions(promotionsData);
      console.log("Promotions fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch promotions";
      setError(errorMessage);
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchPromotions();
  };

  const handleDelete = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPromotion) return;

    setIsDeleting(true);
    try {
      await deletePromotion(selectedPromotion._id);
      console.log("Promotion deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedPromotion(null);
      fetchPromotions();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete promotion";
      setError(errorMessage);
      console.error("Error deleting promotion:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    console.log("Add button clicked, opening modal...");
    setIsAddModalOpen(true);
    console.log("isAddModalOpen set to true");
  };

  const handleAddSuccess = () => {
    fetchPromotions();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <AddPromotionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedPromotion && (
        <EditPromotionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPromotion(null);
          }}
          onSuccess={handleEditSuccess}
          promotion={selectedPromotion}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPromotion(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Promotion?"
        message={`Are you sure you want to delete "${selectedPromotion?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      <div className="promotions-container">
        <div className="promotions-header">
          <div className="promotions-header-content">
            <div className="promotions-header-icon">
              <Gift size={32} />
            </div>
            <div>
              <h1 className="promotions-title">Promotions</h1>
              <p className="promotions-subtitle">
                Manage promotional offers and bonuses
              </p>
            </div>
          </div>
          <div className="promotions-actions">
            <button
              className="refresh-btn"
              onClick={fetchPromotions}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button className="add-promotion-btn" onClick={handleAdd}>
              <Plus size={18} />
              <span>Add Promotion</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="promotions-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="promotions-loading">
            <div className="spinner"></div>
            <p>Loading promotions...</p>
          </div>
        ) : (
          <>
            <div className="promotions-grid">
              {promotions.length === 0 ? (
                <div className="no-promotions">
                  <Gift size={64} />
                  <h3>No promotions found</h3>
                  <p>Click "Add Promotion" to create your first promotion</p>
                </div>
              ) : (
                promotions.map((promotion) => {
                  const gameTypeName =
                    typeof promotion.gameType === "object"
                      ? promotion.gameType.name
                      : promotion.gameType;

                  const paymentMethodsArray = Array.isArray(
                    promotion.paymentMethods
                  )
                    ? promotion.paymentMethods
                    : [];

                  return (
                    <div key={promotion._id} className="promotion-card">
                      <div className="promotion-image-container">
                        {promotion.promotionImage ? (
                          <img
                            src={`http://localhost:8000${promotion.promotionImage}`}
                            alt={promotion.title}
                            className="promotion-image"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/400x200?text=Promotion";
                            }}
                          />
                        ) : (
                          <div className="promotion-placeholder">
                            <Gift size={48} />
                          </div>
                        )}
                      </div>

                      <div className="promotion-content">
                        <h3 className="promotion-title">
                          {promotion.title}
                          {promotion.titleBn && (
                            <span className="title-bn">
                              {" "}
                              ({promotion.titleBn})
                            </span>
                          )}
                        </h3>

                        <p className="promotion-description">
                          {promotion.description}
                        </p>

                        <div className="promotion-info">
                          <div className="info-row">
                            <span className="info-label">Game Type:</span>
                            <span className="info-value">{gameTypeName}</span>
                          </div>
                          {paymentMethodsArray.length > 0 && (
                            <div className="info-row">
                              <span className="info-label">
                                Payment Methods:
                              </span>
                              <span className="info-value">
                                {paymentMethodsArray
                                  .map((m) => m.method_name_en)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="promotion-meta">
                          <span className="promotion-date">
                            Created: {formatDate(promotion.createdAt)}
                          </span>
                        </div>

                        <div className="promotion-actions">
                          <button
                            className="promotion-action-btn edit"
                            onClick={() => handleEdit(promotion)}
                            title="Edit promotion"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="promotion-action-btn delete"
                            onClick={() => handleDelete(promotion)}
                            title="Delete promotion"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {promotions.length > 0 && (
              <div className="promotions-footer">
                <p className="results-count">
                  Showing {promotions.length} promotion
                  {promotions.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Promotions;
