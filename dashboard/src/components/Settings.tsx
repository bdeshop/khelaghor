import { useState, useEffect, useCallback } from "react";
import {
  Settings as SettingsIcon,
  Mail,
  MessageCircle,
  Globe,
  Save,
  X,
  RefreshCw,
} from "lucide-react";
import { getSettings, updateSettings } from "../config/api";
import "./Settings.css";

interface SettingsData {
  telegram: string;
  email: string;
  bannerTextEnglish: string;
  bannerTextBangla: string;
}

function Settings() {
  const [loading, setLoading] = useState(false);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [currentSettings, setCurrentSettings] = useState<SettingsData | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<SettingsData>({
    telegram: "",
    email: "",
    bannerTextEnglish: "",
    bannerTextBangla: "",
  });

  const fetchCurrentSettings = useCallback(async () => {
    setFetchingSettings(true);
    setMessage(null);
    try {
      const response = await getSettings();
      if (response.success && response.settings) {
        const settings = response.settings;
        setCurrentSettings(settings);
        setFormData({
          telegram: settings.telegram || "",
          email: settings.email || "",
          bannerTextEnglish: settings.bannerTextEnglish || "",
          bannerTextBangla: settings.bannerTextBangla || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setMessage({
        type: "error",
        text: "Failed to load settings",
      });
    } finally {
      setFetchingSettings(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentSettings();
  }, [fetchCurrentSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateSettings(formData);
      setMessage({
        type: "success",
        text: "Settings updated successfully!",
      });

      // Refresh the current settings
      await fetchCurrentSettings();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (currentSettings) {
      setFormData({
        telegram: currentSettings.telegram || "",
        email: currentSettings.email || "",
        bannerTextEnglish: currentSettings.bannerTextEnglish || "",
        bannerTextBangla: currentSettings.bannerTextBangla || "",
      });
    } else {
      setFormData({
        telegram: "",
        email: "",
        bannerTextEnglish: "",
        bannerTextBangla: "",
      });
    }
    setMessage(null);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-header-icon">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="settings-title">Application Settings</h1>
            <p className="settings-subtitle">
              Manage your application configuration and preferences
            </p>
          </div>
        </div>
        <button
          type="button"
          className="refresh-btn"
          onClick={fetchCurrentSettings}
          disabled={fetchingSettings}
          title="Refresh settings"
        >
          <RefreshCw size={20} className={fetchingSettings ? "spinning" : ""} />
        </button>
      </div>

      {message && (
        <div className={`settings-message ${message.type}`}>{message.text}</div>
      )}

      {fetchingSettings ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading settings...</p>
        </div>
      ) : (
        <div className="settings-content">
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-section">
              <div className="section-header">
                <MessageCircle size={24} />
                <h2 className="section-title">Contact Information</h2>
              </div>
              <div className="section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telegram">
                      <MessageCircle size={18} />
                      Telegram
                    </label>
                    <input
                      type="text"
                      id="telegram"
                      placeholder="@username"
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData({ ...formData, telegram: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={18} />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="support@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="section-header">
                <Globe size={24} />
                <h2 className="section-title">Banner Text</h2>
              </div>
              <div className="section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bannerTextEnglish">
                      <Globe size={18} />
                      Banner Text (English)
                    </label>
                    <input
                      type="text"
                      id="bannerTextEnglish"
                      placeholder="Welcome to our platform"
                      value={formData.bannerTextEnglish}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bannerTextEnglish: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bannerTextBangla">
                      <Globe size={18} />
                      Banner Text (Bangla)
                    </label>
                    <input
                      type="text"
                      id="bannerTextBangla"
                      placeholder="আমাদের প্ল্যাটফর্মে স্বাগতম"
                      value={formData.bannerTextBangla}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bannerTextBangla: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
                disabled={loading}
              >
                <X size={18} />
                Reset
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
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Settings;
