import { useState } from "react";
import { Gamepad2, FolderTree } from "lucide-react";
import GameCategory from "./GameCategory";
import GamesList from "./GamesList";
import "./Games.css";

function Games() {
  const [activeTab, setActiveTab] = useState<"category" | "games">("category");

  return (
    <div className="games-container">
      <div className="games-header">
        <div className="games-header-content">
          <div className="games-header-icon">
            <Gamepad2 size={32} />
          </div>
          <div>
            <h1 className="games-title">Games Management</h1>
            <p className="games-subtitle">
              Manage game categories and game listings
            </p>
          </div>
        </div>
      </div>

      <div className="games-tabs">
        <button
          className={`tab-btn ${activeTab === "category" ? "active" : ""}`}
          onClick={() => setActiveTab("category")}
        >
          <FolderTree size={20} />
          Game Categories
        </button>
        <button
          className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
          onClick={() => setActiveTab("games")}
        >
          <Gamepad2 size={20} />
          Games
        </button>
      </div>

      <div className="games-content">
        {activeTab === "category" ? <GameCategory /> : <GamesList />}
      </div>
    </div>
  );
}

export default Games;
