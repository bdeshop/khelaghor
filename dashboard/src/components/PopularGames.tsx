import { useState, useEffect } from "react";
import { getAllPopularGames, deletePopularGame } from "../config/api";
import { Gamepad2, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import AddPopularGameModal from "./AddPopularGameModal";
import EditPopularGameModal from "./EditPopularGameModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./PopularGames.css";

interface PopularGame {
  _id: string;
  image: string;
  title: string;
  redirectUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function PopularGames() {
  const [games, setGames] = useState<PopularGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<PopularGame | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllPopularGames();
      const gamesData = response.games || response;
      setGames(gamesData);
      console.log("Popular games fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch popular games";
      setError(errorMessage);
      console.error("Error fetching popular games:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleEdit = (game: PopularGame) => {
    setSelectedGame(game);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchGames();
  };

  const handleDelete = (game: PopularGame) => {
    setSelectedGame(game);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGame) return;

    setIsDeleting(true);
    try {
      await deletePopularGame(selectedGame._id);
      console.log("Popular game deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedGame(null);
      fetchGames();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete popular game";
      setError(errorMessage);
      console.error("Error deleting popular game:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchGames();
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
      <AddPopularGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedGame && (
        <EditPopularGameModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGame(null);
          }}
          onSuccess={handleEditSuccess}
          game={selectedGame}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedGame(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Popular Game?"
        message={`Are you sure you want to delete "${selectedGame?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      <div className="popular-games-container">
        <div className="popular-games-header">
          <div className="popular-games-header-content">
            <div className="popular-games-header-icon">
              <Gamepad2 size={32} />
            </div>
            <div>
              <h1 className="popular-games-title">Popular Games</h1>
              <p className="popular-games-subtitle">
                Manage featured and popular games
              </p>
            </div>
          </div>
          <div className="popular-games-actions">
            <button
              className="refresh-btn"
              onClick={fetchGames}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button className="add-game-btn" onClick={handleAdd}>
              <Plus size={18} />
              <span>Add Game</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="popular-games-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="popular-games-loading">
            <div className="spinner"></div>
            <p>Loading popular games...</p>
          </div>
        ) : (
          <>
            <div className="popular-games-grid">
              {games.length === 0 ? (
                <div className="no-games">
                  <Gamepad2 size={64} />
                  <h3>No popular games found</h3>
                  <p>Click "Add Game" to create your first popular game</p>
                </div>
              ) : (
                games.map((game) => (
                  <div key={game._id} className="game-card">
                    <div className="game-image-container">
                      {game.image ? (
                        <img
                          src={`http://localhost:8000${game.image}`}
                          alt={game.title}
                          className="game-image"
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
                        style={{ display: game.image ? "none" : "flex" }}
                      >
                        <Gamepad2 size={48} />
                        <span>No Image</span>
                      </div>
                      <div
                        className={`game-status ${
                          game.isActive ? "active" : "inactive"
                        }`}
                      >
                        {game.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="game-content">
                      <h3 className="game-title">{game.title}</h3>

                      <div className="game-link">
                        <a
                          href={game.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {game.redirectUrl}
                        </a>
                      </div>

                      <div className="game-meta">
                        <span className="game-date">
                          Created: {formatDate(game.createdAt)}
                        </span>
                      </div>

                      <div className="game-actions">
                        <button
                          className="game-action-btn edit"
                          onClick={() => handleEdit(game)}
                          title="Edit game"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="game-action-btn delete"
                          onClick={() => handleDelete(game)}
                          title="Delete game"
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

            {games.length > 0 && (
              <div className="popular-games-footer">
                <p className="results-count">
                  Showing {games.length} game{games.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default PopularGames;
