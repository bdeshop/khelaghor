import { THEME_CONFIG } from "../constants/theme";

/**
 * Hook to access global theme configuration
 * Use this to get theme values in your components
 */
export const useTheme = () => {
  return THEME_CONFIG;
};

/**
 * Get section-specific theme config
 */
export const useHeaderTheme = () => THEME_CONFIG.header;
export const useBannerTheme = () => THEME_CONFIG.banner;
export const useFooterTheme = () => THEME_CONFIG.footer;
export const usePopularGamesTheme = () => THEME_CONFIG.popular_games;
export const useSidebarTheme = () => THEME_CONFIG.sidebar;
export const useModalsTheme = () => THEME_CONFIG.modals;
export const useFormsTheme = () => THEME_CONFIG.forms;

/**
 * Helper function to get button styles based on theme config
 */
export const getButtonStyles = (
  variant: "primary" | "danger" | "secondary" = "primary"
) => {
  const config = THEME_CONFIG.buttons[variant];

  return {
    backgroundColor: config.bg,
    color: config.text,
    borderRadius: `${THEME_CONFIG.buttons.radius}px`,
  };
};

/**
 * Helper to get responsive font size
 */
export const getResponsiveFontSize = (type: "h1" | "h2" | "h3" | "body") => {
  if (type === "body") {
    return THEME_CONFIG.typography.body_text.regular;
  }
  return THEME_CONFIG.typography.headings[type];
};
