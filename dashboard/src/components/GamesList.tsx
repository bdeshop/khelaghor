import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Gamepad2,
  RefreshCw,
  X,
  Save,
  ExternalLink,
} from "lucide-react";
import {
  getGames,
  createGame,
  updateGame,
  deleteGame,
  getGameCategories,
  API_BASE_URL,
} from "../config/api";
import "./GamesList.css";

interface Game {
  _id: string;
  title: string;
  image: string;
  url: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGames, setFetchingGames] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    imageFile: null as File | null,
    url: "",
    category: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getGameCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchGames = useCallback(async () => {
    setFetchingGames(true);
    setMessage(null);
    try {
      const response = await getGames();
      if (response.success && response.games) {
        setGames(response.games);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
      setMessage({
        type: "error",
        text: "Failed to load games",
      });
    } finally {
      setFetchingGames(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchGames();
  }, [fetchCategories, fetchGames]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }
      data.append("url", formData.url);
      data.append("category", formData.category);

      if (editingId) {
        await updateGame(editingId, data);
        setMessage({
          type: "success",
          text: "Game updated successfully!",
        });
      } else {
        await createGame(data);
        setMessage({
          type: "success",
          text: "Game created successfully!",
        });
      }

      setFormData({ title: "", imageFile: null, url: "", category: "" });
      setIsEditing(false);
      setEditingId(null);
      await fetchGames();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save game",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game: Game) => {
    setFormData({
      title: game.title,
      imageFile: null,
      url: game.url,
      category: game.category._id,
    });
    setEditingId(game._id);
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    setLoading(true);
    setMessage(null);

    try {
      await deleteGame(id);
      setMessage({
        type: "success",
        text: "Game deleted successfully!",
      });
      await fetchGames();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete game",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", imageFile: null, url: "", category: "" });
    setIsEditing(false);
    setEditingId(null);
    setMessage(null);
  };

  return (
    <div className="games-list-container">
      <div className="games-list-header">
        <h2 className="games-list-title">
          <Gamepad2 size={24} />
          Games
        </h2>
        <div className="games-list-actions">
          <button
            className="refresh-btn"
            onClick={fetchGames}
            disabled={fetchingGames}
            title="Refresh games"
          >
            <RefreshCw size={20} className={fetchingGames ? "spinning" : ""} />
          </button>
          {!isEditing && (
            <button
              className="add-btn"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Plus size={20} />
              Add Game
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`games-list-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {isEditing && (
        <div className="games-form-card">
          <h3 className="form-card-title">
            {editingId ? "Edit Game" : "Add New Game"}
          </h3>
          <form onSubmit={handleSubmit} className="games-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">
                  Game Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g., Poker, Roulette"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="url">
                  Game URL <span className="required">*</span>
                </label>
                <input
                  type="url"
                  id="url"
                  placeholder="https://example.com/game"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="image">
                  Game Image <span className="required">*</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingId}
                  />
                  <label htmlFor="image" className="file-input-label">
                    {formData.imageFile
                      ? formData.imageFile.name
                      : "Choose game image"}
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={18} />
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingId ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {fetchingGames ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading games...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          <Gamepad2 size={64} />
          <h3>No Games Found</h3>
          <p>Create your first game to get started</p>
          <button className="add-btn" onClick={() => setIsEditing(true)}>
            <Plus size={20} />
            Add Game
          </button>
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game._id} className="game-card">
              <div className="game-card-image">
                <img src={`${API_BASE_URL}${game.image}`} alt={game.title} />
                <div className="game-card-overlay">
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="play-btn"
                  >
                    <ExternalLink size={20} />
                    Play
                  </a>
                </div>
              </div>
              <div className="game-card-content">
                <h3 className="game-title">{game.title}</h3>
                <span className="game-category">{game.category.name}</span>
              </div>
              <div className="game-card-actions">
                <button
                  className="icon-btn edit"
                  onClick={() => handleEdit(game)}
                  disabled={loading}
                  title="Edit game"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="icon-btn delete"
                  onClick={() => handleDelete(game._id)}
                  disabled={loading}
                  title="Delete game"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GamesList;
