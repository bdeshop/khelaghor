import { fetchThemeConfig } from "../lib/api";

// Default fallback theme config
const DEFAULT_THEME_CONFIG = {
  brand: {
    site_name: "KhelaGhor",
    logo: "/images/logo.png",
    favicon: "/uploads/favicon.ico",
    logo_width: 160,
    logo_height: 32,
  },
  colors: {
    primary: "#f7b500",
    secondary: "#111111",
    accent: "#db110f",
    background: {
      body: "#0b0b0b",
      section: "#121212",
      card: "#1c1c1c",
    },
    text: {
      heading: "#ffffff",
      body: "#cccccc",
      muted: "#999999",
    },
  },
  header: {
    background: "#222222",
    height: 56,
    logo: {
      src: "/images/logo.png",
      height_mobile: 24,
      height_desktop: 32,
    },
    buttons: {
      login: {
        bg: "linear-gradient(to bottom, #db110f, #750503)",
        text: "#ffffff",
        hover_opacity: 0.9,
      },
      signup: {
        bg: "linear-gradient(to bottom, #414141, #222222)",
        text: "#ffffff",
        hover_opacity: 0.9,
      },
      deposit: {
        bg: "linear-gradient(to bottom, #db110f, #750503)",
        text: "#ffffff",
      },
      wallet: {
        bg: "linear-gradient(to bottom, #414141, #222222)",
        text: "#ffffff",
        balance_color: "#60a5fa",
      },
    },
    profile_menu: {
      bg: "#2a2a2a",
      hover_bg: "#374151",
      text: "#ffffff",
      icon_color: "#9ca3af",
      vip_color: "#ef4444",
    },
  },
  mobile_bar: {
    background: "#1a1a1a",
    height: 64,
    buttons: {
      deposit: {
        bg: "linear-gradient(to bottom, #db110f, #750503)",
        text: "#ffffff",
      },
      wallet: {
        bg: "linear-gradient(to bottom, #414141, #222222)",
        text: "#ffffff",
      },
      profile: {
        bg: "#2a2a2a",
        text: "#ffffff",
      },
    },
  },
  banner: {
    nav_button: {
      bg: "rgba(255, 255, 255, 0.1)",
      hover_bg: "rgba(255, 255, 255, 0.2)",
      icon_color: "#ffffff",
    },
    indicator: {
      active_bg: "#ffffff",
      inactive_bg: "rgba(255, 255, 255, 0.3)",
    },
    height: {
      mobile: 140,
      tablet: 400,
      desktop: 300,
    },
  },
  popular_games: {
    section_title: {
      indicator_color: "#dc2626",
      text_color: "#ffffff",
    },
    card: {
      bg: "#550b0b",
      footer_bg: "#3a0808",
      text_color: "#ffffff",
      hover_scale: 1.05,
      play_button_bg: "#dc2626",
    },
  },
  game_grid: {
    card: {
      bg: "#1c1c1c",
      hover_bg: "#2a2a2a",
      text_color: "#ffffff",
      border_radius: 8,
    },
  },
  footer: {
    background: "#0b0b0b",
    text_color: "#ffffff",
    muted_text: "rgba(255, 255, 255, 0.7)",
    heading_color: "#dc2626",
    link_hover_color: "#f87171",
    divider_color: "rgba(255, 255, 255, 0.6)",
  },
  modals: {
    overlay_bg: "rgba(0, 0, 0, 0.8)",
    content_bg: "#1c1c1c",
    header_bg: "#222222",
    text_color: "#ffffff",
    border_color: "#333333",
    close_button: {
      bg: "transparent",
      hover_bg: "#333333",
      icon_color: "#ffffff",
    },
  },
  sidebar: {
    background: "#121212",
    item_bg: "transparent",
    item_hover_bg: "#1c1c1c",
    item_active_bg: "#dc2626",
    text_color: "#cccccc",
    text_active_color: "#ffffff",
    icon_color: "#999999",
    icon_active_color: "#ffffff",
    divider_color: "#333333",
  },
  buttons: {
    radius: 10,
    primary: {
      bg: "#f7b500",
      text: "#000000",
      hover_bg: "#ffcc33",
    },
    danger: {
      bg: "#dc2626",
      text: "#ffffff",
      hover_bg: "#ef4444",
    },
    secondary: {
      bg: "#333333",
      text: "#ffffff",
      hover_bg: "#444444",
    },
  },
  typography: {
    font_family: {
      primary: "Inter, sans-serif",
    },
    headings: {
      h1: { desktop: 48, mobile: 32 },
      h2: { desktop: 36, mobile: 26 },
      h3: { desktop: 24, mobile: 20 },
    },
    body_text: {
      regular: { desktop: 16, mobile: 14 },
      small: { desktop: 14, mobile: 12 },
    },
  },
  category_tabs: {
    bg: "#1c1c1c",
    active_bg: "#dc2626",
    text_color: "#cccccc",
    active_text_color: "#ffffff",
    border_radius: 8,
  },
  forms: {
    input: {
      bg: "#222222",
      border_color: "#333333",
      focus_border_color: "#f7b500",
      text_color: "#ffffff",
      placeholder_color: "#666666",
      border_radius: 8,
    },
    label: {
      text_color: "#cccccc",
    },
  },
} as const;

export type ThemeConfig = typeof DEFAULT_THEME_CONFIG;

// Dynamic theme config that will be loaded from API
let cachedThemeConfig: ThemeConfig | null = null;

export async function getThemeConfig(): Promise<ThemeConfig> {
  if (cachedThemeConfig) {
    return cachedThemeConfig;
  }

  try {
    const apiConfig = await fetchThemeConfig();
    cachedThemeConfig = apiConfig as ThemeConfig;
    return cachedThemeConfig;
  } catch (error) {
    console.warn("Failed to load theme config from API, using default:", error);
    return DEFAULT_THEME_CONFIG;
  }
}

// Export default for immediate use (will be replaced by API data)
export const THEME_CONFIG = DEFAULT_THEME_CONFIG;
