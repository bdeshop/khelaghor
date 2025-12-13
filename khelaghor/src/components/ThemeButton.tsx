import { ButtonHTMLAttributes } from "react";
import { THEME_CONFIG } from "../constants/theme";

interface ThemeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary";
  children: React.ReactNode;
}

/**
 * Button component that automatically uses theme configuration
 * Change theme.ts to update all buttons across the project
 */
export const ThemeButton = ({
  variant = "primary",
  children,
  className = "",
  ...props
}: ThemeButtonProps) => {
  const buttonConfig = THEME_CONFIG.buttons[variant];

  return (
    <button
      className={`px-6 py-3 font-medium transition-colors ${className}`}
      style={{
        backgroundColor: buttonConfig.bg,
        color: buttonConfig.text,
        borderRadius: `${THEME_CONFIG.buttons.radius}px`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = buttonConfig.hover_bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = buttonConfig.bg;
      }}
      {...props}
    >
      {children}
    </button>
  );
};
