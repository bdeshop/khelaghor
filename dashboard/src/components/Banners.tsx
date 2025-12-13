import { useState, useEffect } from "react";
import { getAllBanners, deleteBanner } from "../config/api";
import {
  Image as ImageIcon,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import AddBannerModal from "./AddBannerModal";
import EditBannerModal from "./EditBannerModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./Banners.css";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  textEnglish?: string;
  textBangla?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function Banners() {
  const [activeTab, setActiveTab] = useState<"images" | "text">("images");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllBanners();
      // Handle response structure
      const bannersData = response.banners || response;
      setBanners(bannersData);
      console.log("Banners fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch banners";
      setError(errorMessage);
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchBanners(); // Refresh the banners list
  };

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBanner) return;

    setIsDeleting(true);
    try {
      await deleteBanner(selectedBanner.id);
      console.log("Banner deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedBanner(null);
      fetchBanners(); // Refresh the list
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete banner";
      setError(errorMessage);
      console.error("Error deleting banner:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchBanners(); // Refresh the banners list
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
      <AddBannerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedBanner && (
        <EditBannerModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBanner(null);
          }}
          onSuccess={handleEditSuccess}
          banner={selectedBanner}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBanner(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Banner?"
        message={`Are you sure you want to delete "${selectedBanner?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      <div className="banners-container">
        {/* Header */}
        <div className="banners-header">
          <div className="banners-header-content">
            <div className="banners-header-icon">
              <ImageIcon size={32} />
            </div>
            <div>
              <h1 className="banners-title">Banners</h1>
              <p className="banners-subtitle">
                Manage promotional banners and advertisements
              </p>
            </div>
          </div>
          <div className="banners-actions">
            <button
              className="refresh-btn"
              onClick={fetchBanners}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button className="add-banner-btn" onClick={handleAdd}>
              <Plus size={18} />
              <span>Add Banner</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="banners-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="banners-loading">
            <div className="spinner"></div>
            <p>Loading banners...</p>
          </div>
        ) : (
          <>
            {/* Banners Grid */}
            <div className="banners-grid">
              {banners.length === 0 ? (
                <div className="no-banners">
                  <ImageIcon size={64} />
                  <h3>No banners found</h3>
                  <p>Click "Add Banner" to create your first banner</p>
                </div>
              ) : (
                banners.map((banner) => (
                  <div key={banner.id} className="banner-card">
                    <div className="banner-image-container">
                      <img
                        src={`http://localhost:8000${banner.imageUrl}`}
                        alt={banner.title}
                        className="banner-image"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x200?text=Banner+Image";
                        }}
                      />
                      <div
                        className={`banner-status ${
                          banner.isActive ? "active" : "inactive"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="banner-content">
                      <h3 className="banner-title">{banner.title}</h3>

                      <div className="banner-meta">
                        <span className="banner-date">
                          Created: {formatDate(banner.createdAt)}
                        </span>
                      </div>

                      <div className="banner-actions">
                        <button
                          className="banner-action-btn edit"
                          onClick={() => handleEdit(banner)}
                          title="Edit banner"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="banner-action-btn delete"
                          onClick={() => handleDelete(banner)}
                          title="Delete banner"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Results Count */}
            {banners.length > 0 && (
              <div className="banners-footer">
                <p className="results-count">
                  Showing {banners.length} banner
                  {banners.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Banners;
