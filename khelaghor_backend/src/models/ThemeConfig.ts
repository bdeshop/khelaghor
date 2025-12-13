import mongoose, { Document, Schema } from "mongoose";

// Sub-schemas for nested objects
const ButtonStyleSchema = new Schema(
  {
    bg: { type: String, default: "" },
    text: { type: String, default: "#ffffff" },
    hover_bg: { type: String, default: "" },
    hover_opacity: { type: Number, default: 0.9 },
    balance_color: { type: String, default: "" },
  },
  { _id: false }
);

const FontSizeSchema = new Schema(
  {
    desktop: { type: Number, default: 16 },
    mobile: { type: Number, default: 14 },
  },
  { _id: false }
);

export interface IThemeConfig extends Document {
  brand: {
    site_name: string;
    logo: string;
    favicon: string;
    logo_width: number;
    logo_height: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      body: string;
      section: string;
      card: string;
    };
    text: {
      heading: string;
      body: string;
      muted: string;
    };
  };
  header: {
    background: string;
    height: number;
    logo: {
      src: string;
      height_mobile: number;
      height_desktop: number;
    };
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
  };
  mobile_bar: {
    background: string;
    height: number;
    buttons: {
      deposit: { bg: string; text: string };
      wallet: { bg: string; text: string };
      profile: { bg: string; text: string };
    };
  };
  banner: {
    nav_button: {
      bg: string;
      hover_bg: string;
      icon_color: string;
    };
    indicator: {
      active_bg: string;
      inactive_bg: string;
    };
    height: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  popular_games: {
    section_title: {
      indicator_color: string;
      text_color: string;
    };
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
    overlay_bg: string;
    content_bg: string;
    header_bg: string;
    text_color: string;
    border_color: string;
    close_button: {
      bg: string;
      hover_bg: string;
      icon_color: string;
    };
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
    radius: number;
    primary: { bg: string; text: string; hover_bg: string };
    danger: { bg: string; text: string; hover_bg: string };
    secondary: { bg: string; text: string; hover_bg: string };
  };
  typography: {
    font_family: {
      primary: string;
    };
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
    label: {
      text_color: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const themeConfigSchema = new Schema<IThemeConfig>(
  {
    brand: {
      site_name: { type: String, default: "KhelaGhor" },
      logo: { type: String, default: "/images/logo.png" },
      favicon: { type: String, default: "/uploads/favicon.ico" },
      logo_width: { type: Number, default: 160 },
      logo_height: { type: Number, default: 32 },
    },
    colors: {
      primary: { type: String, default: "#f7b500" },
      secondary: { type: String, default: "#111111" },
      accent: { type: String, default: "#db110f" },
      background: {
        body: { type: String, default: "#0b0b0b" },
        section: { type: String, default: "#121212" },
        card: { type: String, default: "#1c1c1c" },
      },
      text: {
        heading: { type: String, default: "#ffffff" },
        body: { type: String, default: "#cccccc" },
        muted: { type: String, default: "#999999" },
      },
    },
    header: {
      background: { type: String, default: "#222222" },
      height: { type: Number, default: 56 },
      logo: {
        src: { type: String, default: "/images/logo.png" },
        height_mobile: { type: Number, default: 24 },
        height_desktop: { type: Number, default: 32 },
      },
      buttons: {
        login: {
          bg: {
            type: String,
            default: "linear-gradient(to bottom, #db110f, #750503)",
          },
          text: { type: String, default: "#ffffff" },
          hover_opacity: { type: Number, default: 0.9 },
        },
        signup: {
          bg: {
            type: String,
            default: "linear-gradient(to bottom, #414141, #222222)",
          },
          text: { type: String, default: "#ffffff" },
          hover_opacity: { type: Number, default: 0.9 },
        },
        deposit: {
          bg: {
            type: String,
            default: "linear-gradient(to bottom, #db110f, #750503)",
          },
          text: { type: String, default: "#ffffff" },
        },
        wallet: {
          bg: {
            type: String,
            default: "linear-gradient(to bottom, #414141, #222222)",
          },
          text: { type: String, default: "#ffffff" },
          balance_color: { type: String, default: "#60a5fa" },
        },
      },
      profile_menu: {
        bg: { type: String, default: "#2a2a2a" },
        hover_bg: { type: String, default: "#374151" },
        text: { type: String, default: "#ffffff" },
        icon_color: { type: String, default: "#9ca3af" },
        vip_color: { type: String, default: "#ef4444" },
      },
    },
    mobile_bar: {
      background: { type: String, default: "#1a1a1a" },
      height: { type: Number, default: 64 },
      buttons: {
        deposit: {
          bg: {
            type: String,
            default: "linear-gradient(to bottom, #db110f, #750503)",
          },
          text: { type: String, default: "#ffffff" },
        },
        wallet: {
          bg: {
            type: String,
            default: "linear-gradient(to bottom, #414141, #222222)",
          },
          text: { type: String, default: "#ffffff" },
        },
        profile: {
          bg: { type: String, default: "#2a2a2a" },
          text: { type: String, default: "#ffffff" },
        },
      },
    },
    banner: {
      nav_button: {
        bg: { type: String, default: "rgba(255, 255, 255, 0.1)" },
        hover_bg: { type: String, default: "rgba(255, 255, 255, 0.2)" },
        icon_color: { type: String, default: "#ffffff" },
      },
      indicator: {
        active_bg: { type: String, default: "#ffffff" },
        inactive_bg: { type: String, default: "rgba(255, 255, 255, 0.3)" },
      },
      height: {
        mobile: { type: Number, default: 140 },
        tablet: { type: Number, default: 400 },
        desktop: { type: Number, default: 300 },
      },
    },
    popular_games: {
      section_title: {
        indicator_color: { type: String, default: "#dc2626" },
        text_color: { type: String, default: "#ffffff" },
      },
      card: {
        bg: { type: String, default: "#550b0b" },
        footer_bg: { type: String, default: "#3a0808" },
        text_color: { type: String, default: "#ffffff" },
        hover_scale: { type: Number, default: 1.05 },
        play_button_bg: { type: String, default: "#dc2626" },
      },
    },
    game_grid: {
      card: {
        bg: { type: String, default: "#1c1c1c" },
        hover_bg: { type: String, default: "#2a2a2a" },
        text_color: { type: String, default: "#ffffff" },
        border_radius: { type: Number, default: 8 },
      },
    },
    footer: {
      background: { type: String, default: "#0b0b0b" },
      text_color: { type: String, default: "#ffffff" },
      muted_text: { type: String, default: "rgba(255, 255, 255, 0.7)" },
      heading_color: { type: String, default: "#dc2626" },
      link_hover_color: { type: String, default: "#f87171" },
      divider_color: { type: String, default: "rgba(255, 255, 255, 0.6)" },
    },
    modals: {
      overlay_bg: { type: String, default: "rgba(0, 0, 0, 0.8)" },
      content_bg: { type: String, default: "#1c1c1c" },
      header_bg: { type: String, default: "#222222" },
      text_color: { type: String, default: "#ffffff" },
      border_color: { type: String, default: "#333333" },
      close_button: {
        bg: { type: String, default: "transparent" },
        hover_bg: { type: String, default: "#333333" },
        icon_color: { type: String, default: "#ffffff" },
      },
    },
    sidebar: {
      background: { type: String, default: "#121212" },
      item_bg: { type: String, default: "transparent" },
      item_hover_bg: { type: String, default: "#1c1c1c" },
      item_active_bg: { type: String, default: "#dc2626" },
      text_color: { type: String, default: "#cccccc" },
      text_active_color: { type: String, default: "#ffffff" },
      icon_color: { type: String, default: "#999999" },
      icon_active_color: { type: String, default: "#ffffff" },
      divider_color: { type: String, default: "#333333" },
    },
    buttons: {
      radius: { type: Number, default: 10 },
      primary: {
        bg: { type: String, default: "#f7b500" },
        text: { type: String, default: "#000000" },
        hover_bg: { type: String, default: "#ffcc33" },
      },
      danger: {
        bg: { type: String, default: "#dc2626" },
        text: { type: String, default: "#ffffff" },
        hover_bg: { type: String, default: "#ef4444" },
      },
      secondary: {
        bg: { type: String, default: "#333333" },
        text: { type: String, default: "#ffffff" },
        hover_bg: { type: String, default: "#444444" },
      },
    },
    typography: {
      font_family: {
        primary: { type: String, default: "Inter, sans-serif" },
      },
      headings: {
        h1: {
          desktop: { type: Number, default: 48 },
          mobile: { type: Number, default: 32 },
        },
        h2: {
          desktop: { type: Number, default: 36 },
          mobile: { type: Number, default: 26 },
        },
        h3: {
          desktop: { type: Number, default: 24 },
          mobile: { type: Number, default: 20 },
        },
      },
      body_text: {
        regular: {
          desktop: { type: Number, default: 16 },
          mobile: { type: Number, default: 14 },
        },
        small: {
          desktop: { type: Number, default: 14 },
          mobile: { type: Number, default: 12 },
        },
      },
    },
    category_tabs: {
      bg: { type: String, default: "#1c1c1c" },
      active_bg: { type: String, default: "#dc2626" },
      text_color: { type: String, default: "#cccccc" },
      active_text_color: { type: String, default: "#ffffff" },
      border_radius: { type: Number, default: 8 },
    },
    forms: {
      input: {
        bg: { type: String, default: "#222222" },
        border_color: { type: String, default: "#333333" },
        focus_border_color: { type: String, default: "#f7b500" },
        text_color: { type: String, default: "#ffffff" },
        placeholder_color: { type: String, default: "#666666" },
        border_radius: { type: Number, default: 8 },
      },
      label: {
        text_color: { type: String, default: "#cccccc" },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IThemeConfig>("ThemeConfig", themeConfigSchema);
