import type { Config } from "tailwindcss";
import { THEME_CONFIG } from "./src/constants/theme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Theme colors from global config
        primary: {
          DEFAULT: THEME_CONFIG.colors.primary,
          foreground: THEME_CONFIG.buttons.primary.text,
        },
        secondary: {
          DEFAULT: THEME_CONFIG.colors.secondary,
          foreground: THEME_CONFIG.colors.text.body,
        },
        background: {
          DEFAULT: THEME_CONFIG.colors.background.body,
          section: THEME_CONFIG.colors.background.section,
          card: THEME_CONFIG.colors.background.card,
        },
        text: {
          heading: THEME_CONFIG.colors.text.heading,
          body: THEME_CONFIG.colors.text.body,
        },
        // Keep existing shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: "hsl(var(--primary))",
          "primary-foreground": "hsl(var(--primary-foreground))",
          accent: "hsl(var(--accent))",
          "accent-foreground": "hsl(var(--accent-foreground))",
          border: "hsl(var(--border))",
          ring: "hsl(var(--ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        button: `${THEME_CONFIG.buttons.radius}px`,
      },
      fontFamily: {
        primary: [THEME_CONFIG.typography.font_family.primary],
      },
      fontSize: {
        "h1-desktop": `${THEME_CONFIG.typography.headings.h1.desktop}px`,
        "h1-mobile": `${THEME_CONFIG.typography.headings.h1.mobile}px`,
        "h2-desktop": `${THEME_CONFIG.typography.headings.h2.desktop}px`,
        "h2-mobile": `${THEME_CONFIG.typography.headings.h2.mobile}px`,
        "body-desktop": `${THEME_CONFIG.typography.body_text.regular.desktop}px`,
        "body-mobile": `${THEME_CONFIG.typography.body_text.regular.mobile}px`,
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
