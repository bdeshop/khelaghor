import { useState, useEffect } from "react";
import { getAllFavourites, deleteFavourite } from "../config/api";
import { Heart, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import AddFavouriteModal from "./AddFavouriteModal";
import EditFavouriteModal from "./EditFavouriteModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./Favourites.css";

interface Favourite {
  _id: string;
  image: string;
  title: string;
  actionType: "url" | "modal";
  url?: string;
  modalOptions?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function Favourites() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFavourite, setSelectedFavourite] = useState<Favourite | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllFavourites();
      const favouritesData = response.favourites || response;
      setFavourites(favouritesData);
      console.log("Favourites fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch favourites";
      setError(errorMessage);
      console.error("Error fetching favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleEdit = (favourite: Favourite) => {
    setSelectedFavourite(favourite);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchFavourites();
  };

  const handleDelete = (favourite: Favourite) => {
    setSelectedFavourite(favourite);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFavourite) return;

    setIsDeleting(true);
    try {
      await deleteFavourite(selectedFavourite._id);
      console.log("Favourite deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedFavourite(null);
      fetchFavourites();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete favourite";
      setError(errorMessage);
      console.error("Error deleting favourite:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchFavourites();
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
      <AddFavouriteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedFavourite && (
        <EditFavouriteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedFavourite(null);
          }}
          onSuccess={handleEditSuccess}
          favourite={selectedFavourite}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFavourite(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Favourite?"
        message={`Are you sure you want to delete "${selectedFavourite?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      <div className="favourites-container">
        <div className="favourites-header">
          <div className="favourites-header-content">
            <div className="favourites-header-icon">
              <Heart size={32} />
            </div>
            <div>
              <h1 className="favourites-title">Favourites</h1>
              <p className="favourites-subtitle">
                Manage your favourite items and quick actions
              </p>
            </div>
          </div>
          <div className="favourites-actions">
            <button
              className="refresh-btn"
              onClick={fetchFavourites}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button className="add-favourite-btn" onClick={handleAdd}>
              <Plus size={18} />
              <span>Add Favourite</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="favourites-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="favourites-loading">
            <div className="spinner"></div>
            <p>Loading favourites...</p>
          </div>
        ) : (
          <>
            <div className="favourites-grid">
              {favourites.length === 0 ? (
                <div className="no-favourites">
                  <Heart size={64} />
                  <h3>No favourites found</h3>
                  <p>Click "Add Favourite" to create your first favourite</p>
                </div>
              ) : (
                favourites.map((favourite) => (
                  <div key={favourite._id} className="favourite-card">
                    <div className="favourite-image-container">
                      {favourite.image ? (
                        <img
                          src={`http://localhost:8000${favourite.image}`}
                          alt={favourite.title}
                          className="favourite-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const placeholder = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="image-placeholder"
                        style={{ display: favourite.image ? "none" : "flex" }}
                      >
                        <Heart size={48} />
                        <span>No Image</span>
                      </div>
                      <div
                        className={`favourite-status ${
                          favourite.isActive ? "active" : "inactive"
                        }`}
                      >
                        {favourite.isActive ? "Active" : "Inactive"}
                      </div>
                      <div className="favourite-type">
                        {favourite.actionType === "url" ? "URL" : "Modal"}
                      </div>
                    </div>

                    <div className="favourite-content">
                      <h3 className="favourite-title">{favourite.title}</h3>

                      {favourite.actionType === "url" && favourite.url && (
                        <div className="favourite-link">
                          <a
                            href={favourite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {favourite.url}
                          </a>
                        </div>
                      )}

                      {favourite.actionType === "modal" &&
                        favourite.modalOptions && (
                          <div className="favourite-options">
                            <span className="options-label">Options:</span>
                            <span className="options-text">
                              {favourite.modalOptions}
                            </span>
                          </div>
                        )}

                      <div className="favourite-meta">
                        <span className="favourite-date">
                          Created: {formatDate(favourite.createdAt)}
                        </span>
                      </div>

                      <div className="favourite-actions">
                        <button
                          className="favourite-action-btn edit"
                          onClick={() => handleEdit(favourite)}
                          title="Edit favourite"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="favourite-action-btn delete"
                          onClick={() => handleDelete(favourite)}
                          title="Delete favourite"
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

            {favourites.length > 0 && (
              <div className="favourites-footer">
                <p className="results-count">
                  Showing {favourites.length} favourite
                  {favourites.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Favourites;
