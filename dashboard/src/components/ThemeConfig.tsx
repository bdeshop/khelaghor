import { useState, useEffect } from "react";
import {
  Palette,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Image,
  Type,
  Layout,
  Smartphone,
  Square,
  Menu,
  FileText,
  Upload,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import "./ThemeConfig.css";

interface ThemeConfig {
  brand: {
    site_name: string;
    logo: string;
    favicon: string;
    logo_width: number;
    logo_height: number;
  };
  colors: {
    background: { body: string; section: string; card: string };
    text: { heading: string; body: string; muted: string };
    primary: string;
    secondary: string;
    accent: string;
  };
  header: {
    logo: { src: string; height_mobile: number; height_desktop: number };
    buttons: {
      login: { bg: string; text: string; hover_opacity: number };
      signup: { bg: string; text: string; hover_opacity: number };
      deposit: { bg: string; text: string };
      wallet: { bg: string; text: string; balance_color: string };
    };
    profile_menu: {
      bg: string;
      hover_bg: string;
      text: string;
      icon_color: string;
      vip_color: string;
    };
    background: string;
    height: number;
  };
  mobile_bar: {
    buttons: {
      deposit: { bg: string; text: string };
      wallet: { bg: string; text: string };
      profile: { bg: string; text: string };
    };
    background: string;
    height: number;
  };
  banner: {
    nav_button: { bg: string; hover_bg: string; icon_color: string };
    indicator: { active_bg: string; inactive_bg: string };
    height: { mobile: number; tablet: number; desktop: number };
  };
  popular_games: {
    section_title: { indicator_color: string; text_color: string };
    card: {
      bg: string;
      footer_bg: string;
      text_color: string;
      hover_scale: number;
      play_button_bg: string;
    };
  };
  game_grid: {
    card: {
      bg: string;
      hover_bg: string;
      text_color: string;
      border_radius: number;
    };
  };
  footer: {
    background: string;
    text_color: string;
    muted_text: string;
    heading_color: string;
    link_hover_color: string;
    divider_color: string;
  };
  modals: {
    close_button: { bg: string; hover_bg: string; icon_color: string };
    overlay_bg: string;
    content_bg: string;
    header_bg: string;
    text_color: string;
    border_color: string;
  };
  sidebar: {
    background: string;
    item_bg: string;
    item_hover_bg: string;
    item_active_bg: string;
    text_color: string;
    text_active_color: string;
    icon_color: string;
    icon_active_color: string;
    divider_color: string;
  };
  buttons: {
    primary: { bg: string; text: string; hover_bg: string };
    danger: { bg: string; text: string; hover_bg: string };
    secondary: { bg: string; text: string; hover_bg: string };
    radius: number;
  };
  typography: {
    font_family: { primary: string };
    headings: {
      h1: { desktop: number; mobile: number };
      h2: { desktop: number; mobile: number };
      h3: { desktop: number; mobile: number };
    };
    body_text: {
      regular: { desktop: number; mobile: number };
      small: { desktop: number; mobile: number };
    };
  };
  category_tabs: {
    bg: string;
    active_bg: string;
    text_color: string;
    active_text_color: string;
    border_radius: number;
  };
  forms: {
    input: {
      bg: string;
      border_color: string;
      focus_border_color: string;
      text_color: string;
      placeholder_color: string;
      border_radius: number;
    };
    label: { text_color: string };
  };
}

const ThemeConfig = () => {
  const [config, setConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    brand: true,
    colors: true,
    header: false,
    mobile_bar: false,
    banner: false,
    popular_games: false,
    game_grid: false,
    footer: false,
    modals: false,
    sidebar: false,
    buttons: false,
    typography: false,
    category_tabs: false,
    forms: false,
  });

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/theme-config`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setConfig(response.data.themeConfig);
    } catch (error) {
      console.error("Error fetching theme config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/theme-config`, config, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Theme configuration saved successfully!");
    } catch (error) {
      console.error("Error saving theme config:", error);
      alert("Error saving theme configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset to default theme? This cannot be undone."
      )
    ) {
      return;
    }
    try {
      setResetting(true);
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/theme-config/reset`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      alert("Theme reset to default successfully!");
      fetchConfig();
    } catch (error) {
      console.error("Error resetting theme:", error);
      alert("Error resetting theme configuration");
    } finally {
      setResetting(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    try {
      setUploadingLogo(true);
      const authToken = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${API_URL}/theme-config/logo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && config) {
        setConfig({
          ...config,
          brand: { ...config.brand, logo: response.data.logoUrl },
        });
        alert("Logo uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error uploading logo");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    try {
      setUploadingFavicon(true);
      const authToken = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${API_URL}/theme-config/favicon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && config) {
        setConfig({
          ...config,
          brand: { ...config.brand, favicon: response.data.faviconUrl },
        });
        alert("Favicon uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading favicon:", error);
      alert("Error uploading favicon");
    } finally {
      setUploadingFavicon(false);
      e.target.value = "";
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateConfig = (path: string, value: string | number) => {
    if (!config) return;
    const keys = path.split(".");
    const newConfig = JSON.parse(JSON.stringify(config));
    let current: Record<string, unknown> = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const renderColorInput = (label: string, path: string, value: string) => (
    <div className="config-field">
      <label className="field-label">{label}</label>
      <div className="color-input-wrapper">
        <input
          type="color"
          className="color-picker"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => updateConfig(path, e.target.value)}
        />
        <input
          type="text"
          className="color-text"
          value={value}
          onChange={(e) => updateConfig(path, e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const renderTextInput = (label: string, path: string, value: string) => (
    <div className="config-field">
      <label className="field-label">{label}</label>
      <input
        type="text"
        className="config-input"
        value={value}
        onChange={(e) => updateConfig(path, e.target.value)}
      />
    </div>
  );

  const renderNumberInput = (label: string, path: string, value: number) => (
    <div className="config-field">
      <label className="field-label">{label}</label>
      <input
        type="number"
        className="config-input"
        value={value}
        onChange={(e) => updateConfig(path, Number(e.target.value))}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading theme configuration...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="error-container">
        <p>Failed to load theme configuration</p>
        <button className="refresh-btn" onClick={fetchConfig}>
          <RefreshCw size={18} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="theme-config-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Theme Configuration</h2>
          <p className="page-subtitle">
            Customize your app's appearance and branding
          </p>
        </div>
        <div className="header-actions">
          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={resetting}
          >
            <RotateCcw size={18} />
            {resetting ? "Resetting..." : "Reset to Default"}
          </button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="config-sections">
        {/* Brand Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("brand")}
          >
            <div className="section-title">
              <Image size={20} />
              <span>Brand Settings</span>
            </div>
            {expandedSections.brand ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.brand && (
            <div className="section-content">
              {renderTextInput(
                "Site Name",
                "brand.site_name",
                config.brand.site_name
              )}

              <div className="config-field">
                <label className="field-label">Logo</label>
                <div className="upload-field">
                  {config.brand.logo && (
                    <div className="preview-image">
                      <img
                        src={`http://localhost:8000${config.brand.logo}`}
                        alt="Logo"
                      />
                    </div>
                  )}
                  <div className="upload-actions">
                    <input
                      type="text"
                      className="config-input"
                      value={config.brand.logo}
                      onChange={(e) =>
                        updateConfig("brand.logo", e.target.value)
                      }
                      placeholder="/images/logo.png"
                    />
                    <label className="upload-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        style={{ display: "none" }}
                      />
                      <Upload size={16} />
                      {uploadingLogo ? "Uploading..." : "Upload"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="config-field">
                <label className="field-label">Favicon</label>
                <div className="upload-field">
                  {config.brand.favicon && (
                    <div className="preview-image favicon-preview">
                      <img
                        src={`http://localhost:8000${config.brand.favicon}`}
                        alt="Favicon"
                      />
                    </div>
                  )}
                  <div className="upload-actions">
                    <input
                      type="text"
                      className="config-input"
                      value={config.brand.favicon}
                      onChange={(e) =>
                        updateConfig("brand.favicon", e.target.value)
                      }
                      placeholder="/uploads/favicon.ico"
                    />
                    <label className="upload-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        disabled={uploadingFavicon}
                        style={{ display: "none" }}
                      />
                      <Upload size={16} />
                      {uploadingFavicon ? "Uploading..." : "Upload"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="fields-grid">
                {renderNumberInput(
                  "Logo Width",
                  "brand.logo_width",
                  config.brand.logo_width
                )}
                {renderNumberInput(
                  "Logo Height",
                  "brand.logo_height",
                  config.brand.logo_height
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colors Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("colors")}
          >
            <div className="section-title">
              <Palette size={20} />
              <span>Colors</span>
            </div>
            {expandedSections.colors ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.colors && (
            <div className="section-content">
              <div className="subsection">
                <h4 className="subsection-title">Background Colors</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Body",
                    "colors.background.body",
                    config.colors.background.body
                  )}
                  {renderColorInput(
                    "Section",
                    "colors.background.section",
                    config.colors.background.section
                  )}
                  {renderColorInput(
                    "Card",
                    "colors.background.card",
                    config.colors.background.card
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Text Colors</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Heading",
                    "colors.text.heading",
                    config.colors.text.heading
                  )}
                  {renderColorInput(
                    "Body",
                    "colors.text.body",
                    config.colors.text.body
                  )}
                  {renderColorInput(
                    "Muted",
                    "colors.text.muted",
                    config.colors.text.muted
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Accent Colors</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Primary",
                    "colors.primary",
                    config.colors.primary
                  )}
                  {renderColorInput(
                    "Secondary",
                    "colors.secondary",
                    config.colors.secondary
                  )}
                  {renderColorInput(
                    "Accent",
                    "colors.accent",
                    config.colors.accent
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("header")}
          >
            <div className="section-title">
              <Layout size={20} />
              <span>Header</span>
            </div>
            {expandedSections.header ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.header && (
            <div className="section-content">
              <div className="subsection">
                <h4 className="subsection-title">General</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Background",
                    "header.background",
                    config.header.background
                  )}
                  {renderNumberInput(
                    "Height",
                    "header.height",
                    config.header.height
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Logo</h4>
                <div className="fields-grid">
                  {renderTextInput(
                    "Logo Source",
                    "header.logo.src",
                    config.header.logo.src
                  )}
                  {renderNumberInput(
                    "Mobile Height",
                    "header.logo.height_mobile",
                    config.header.logo.height_mobile
                  )}
                  {renderNumberInput(
                    "Desktop Height",
                    "header.logo.height_desktop",
                    config.header.logo.height_desktop
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Login Button</h4>
                <div className="fields-grid">
                  {renderTextInput(
                    "Background",
                    "header.buttons.login.bg",
                    config.header.buttons.login.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "header.buttons.login.text",
                    config.header.buttons.login.text
                  )}
                  {renderNumberInput(
                    "Hover Opacity",
                    "header.buttons.login.hover_opacity",
                    config.header.buttons.login.hover_opacity
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Signup Button</h4>
                <div className="fields-grid">
                  {renderTextInput(
                    "Background",
                    "header.buttons.signup.bg",
                    config.header.buttons.signup.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "header.buttons.signup.text",
                    config.header.buttons.signup.text
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Profile Menu</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Background",
                    "header.profile_menu.bg",
                    config.header.profile_menu.bg
                  )}
                  {renderColorInput(
                    "Hover Background",
                    "header.profile_menu.hover_bg",
                    config.header.profile_menu.hover_bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "header.profile_menu.text",
                    config.header.profile_menu.text
                  )}
                  {renderColorInput(
                    "Icon Color",
                    "header.profile_menu.icon_color",
                    config.header.profile_menu.icon_color
                  )}
                  {renderColorInput(
                    "VIP Color",
                    "header.profile_menu.vip_color",
                    config.header.profile_menu.vip_color
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bar Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("mobile_bar")}
          >
            <div className="section-title">
              <Smartphone size={20} />
              <span>Mobile Bar</span>
            </div>
            {expandedSections.mobile_bar ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.mobile_bar && (
            <div className="section-content">
              <div className="fields-grid">
                {renderColorInput(
                  "Background",
                  "mobile_bar.background",
                  config.mobile_bar.background
                )}
                {renderNumberInput(
                  "Height",
                  "mobile_bar.height",
                  config.mobile_bar.height
                )}
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Deposit Button</h4>
                <div className="fields-grid">
                  {renderTextInput(
                    "Background",
                    "mobile_bar.buttons.deposit.bg",
                    config.mobile_bar.buttons.deposit.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "mobile_bar.buttons.deposit.text",
                    config.mobile_bar.buttons.deposit.text
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Wallet Button</h4>
                <div className="fields-grid">
                  {renderTextInput(
                    "Background",
                    "mobile_bar.buttons.wallet.bg",
                    config.mobile_bar.buttons.wallet.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "mobile_bar.buttons.wallet.text",
                    config.mobile_bar.buttons.wallet.text
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("sidebar")}
          >
            <div className="section-title">
              <Menu size={20} />
              <span>Sidebar</span>
            </div>
            {expandedSections.sidebar ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.sidebar && (
            <div className="section-content">
              <div className="fields-grid">
                {renderColorInput(
                  "Background",
                  "sidebar.background",
                  config.sidebar.background
                )}
                {renderColorInput(
                  "Item Background",
                  "sidebar.item_bg",
                  config.sidebar.item_bg === "transparent"
                    ? "#000000"
                    : config.sidebar.item_bg
                )}
                {renderColorInput(
                  "Item Hover",
                  "sidebar.item_hover_bg",
                  config.sidebar.item_hover_bg
                )}
                {renderColorInput(
                  "Item Active",
                  "sidebar.item_active_bg",
                  config.sidebar.item_active_bg
                )}
                {renderColorInput(
                  "Text Color",
                  "sidebar.text_color",
                  config.sidebar.text_color
                )}
                {renderColorInput(
                  "Active Text",
                  "sidebar.text_active_color",
                  config.sidebar.text_active_color
                )}
                {renderColorInput(
                  "Icon Color",
                  "sidebar.icon_color",
                  config.sidebar.icon_color
                )}
                {renderColorInput(
                  "Active Icon",
                  "sidebar.icon_active_color",
                  config.sidebar.icon_active_color
                )}
                {renderColorInput(
                  "Divider",
                  "sidebar.divider_color",
                  config.sidebar.divider_color
                )}
              </div>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("buttons")}
          >
            <div className="section-title">
              <Square size={20} />
              <span>Buttons</span>
            </div>
            {expandedSections.buttons ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.buttons && (
            <div className="section-content">
              {renderNumberInput(
                "Border Radius",
                "buttons.radius",
                config.buttons.radius
              )}
              <div className="subsection">
                <h4 className="subsection-title">Primary Button</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Background",
                    "buttons.primary.bg",
                    config.buttons.primary.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "buttons.primary.text",
                    config.buttons.primary.text
                  )}
                  {renderColorInput(
                    "Hover Background",
                    "buttons.primary.hover_bg",
                    config.buttons.primary.hover_bg
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Danger Button</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Background",
                    "buttons.danger.bg",
                    config.buttons.danger.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "buttons.danger.text",
                    config.buttons.danger.text
                  )}
                  {renderColorInput(
                    "Hover Background",
                    "buttons.danger.hover_bg",
                    config.buttons.danger.hover_bg
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Secondary Button</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Background",
                    "buttons.secondary.bg",
                    config.buttons.secondary.bg
                  )}
                  {renderColorInput(
                    "Text Color",
                    "buttons.secondary.text",
                    config.buttons.secondary.text
                  )}
                  {renderColorInput(
                    "Hover Background",
                    "buttons.secondary.hover_bg",
                    config.buttons.secondary.hover_bg
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Typography Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("typography")}
          >
            <div className="section-title">
              <Type size={20} />
              <span>Typography</span>
            </div>
            {expandedSections.typography ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.typography && (
            <div className="section-content">
              {renderTextInput(
                "Font Family",
                "typography.font_family.primary",
                config.typography.font_family.primary
              )}
              <div className="subsection">
                <h4 className="subsection-title">Headings</h4>
                <div className="fields-grid">
                  {renderNumberInput(
                    "H1 Desktop",
                    "typography.headings.h1.desktop",
                    config.typography.headings.h1.desktop
                  )}
                  {renderNumberInput(
                    "H1 Mobile",
                    "typography.headings.h1.mobile",
                    config.typography.headings.h1.mobile
                  )}
                  {renderNumberInput(
                    "H2 Desktop",
                    "typography.headings.h2.desktop",
                    config.typography.headings.h2.desktop
                  )}
                  {renderNumberInput(
                    "H2 Mobile",
                    "typography.headings.h2.mobile",
                    config.typography.headings.h2.mobile
                  )}
                  {renderNumberInput(
                    "H3 Desktop",
                    "typography.headings.h3.desktop",
                    config.typography.headings.h3.desktop
                  )}
                  {renderNumberInput(
                    "H3 Mobile",
                    "typography.headings.h3.mobile",
                    config.typography.headings.h3.mobile
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Body Text</h4>
                <div className="fields-grid">
                  {renderNumberInput(
                    "Regular Desktop",
                    "typography.body_text.regular.desktop",
                    config.typography.body_text.regular.desktop
                  )}
                  {renderNumberInput(
                    "Regular Mobile",
                    "typography.body_text.regular.mobile",
                    config.typography.body_text.regular.mobile
                  )}
                  {renderNumberInput(
                    "Small Desktop",
                    "typography.body_text.small.desktop",
                    config.typography.body_text.small.desktop
                  )}
                  {renderNumberInput(
                    "Small Mobile",
                    "typography.body_text.small.mobile",
                    config.typography.body_text.small.mobile
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("footer")}
          >
            <div className="section-title">
              <FileText size={20} />
              <span>Footer</span>
            </div>
            {expandedSections.footer ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.footer && (
            <div className="section-content">
              <div className="fields-grid">
                {renderColorInput(
                  "Background",
                  "footer.background",
                  config.footer.background
                )}
                {renderColorInput(
                  "Text Color",
                  "footer.text_color",
                  config.footer.text_color
                )}
                {renderColorInput(
                  "Muted Text",
                  "footer.muted_text",
                  config.footer.muted_text.startsWith("rgba")
                    ? "#ffffff"
                    : config.footer.muted_text
                )}
                {renderColorInput(
                  "Heading Color",
                  "footer.heading_color",
                  config.footer.heading_color
                )}
                {renderColorInput(
                  "Link Hover",
                  "footer.link_hover_color",
                  config.footer.link_hover_color
                )}
                {renderColorInput(
                  "Divider",
                  "footer.divider_color",
                  config.footer.divider_color.startsWith("rgba")
                    ? "#ffffff"
                    : config.footer.divider_color
                )}
              </div>
            </div>
          )}
        </div>

        {/* Forms Section */}
        <div className="config-section">
          <div
            className="section-header"
            onClick={() => toggleSection("forms")}
          >
            <div className="section-title">
              <FileText size={20} />
              <span>Forms</span>
            </div>
            {expandedSections.forms ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {expandedSections.forms && (
            <div className="section-content">
              <div className="subsection">
                <h4 className="subsection-title">Input Fields</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Background",
                    "forms.input.bg",
                    config.forms.input.bg
                  )}
                  {renderColorInput(
                    "Border Color",
                    "forms.input.border_color",
                    config.forms.input.border_color
                  )}
                  {renderColorInput(
                    "Focus Border",
                    "forms.input.focus_border_color",
                    config.forms.input.focus_border_color
                  )}
                  {renderColorInput(
                    "Text Color",
                    "forms.input.text_color",
                    config.forms.input.text_color
                  )}
                  {renderColorInput(
                    "Placeholder",
                    "forms.input.placeholder_color",
                    config.forms.input.placeholder_color
                  )}
                  {renderNumberInput(
                    "Border Radius",
                    "forms.input.border_radius",
                    config.forms.input.border_radius
                  )}
                </div>
              </div>
              <div className="subsection">
                <h4 className="subsection-title">Labels</h4>
                <div className="fields-grid">
                  {renderColorInput(
                    "Text Color",
                    "forms.label.text_color",
                    config.forms.label.text_color
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeConfig;
