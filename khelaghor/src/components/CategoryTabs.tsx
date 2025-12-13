import { useEffect, useState } from "react";
import { THEME_CONFIG } from "@/constants/theme";

interface Category {
  _id: string;
  name: string;
  icon: string;
}

const API_BASE_URL = "http://localhost:8000";

interface CategoryTabsProps {
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/game-categories`);
        const data = await res.json();

        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          const firstId = data.categories[0]._id;
          setActiveCategory(firstId);
          onCategoryChange(firstId);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onCategoryChange]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  if (loading) {
    return (
      <nav className="bg-gradient-to-b from-[#130e0e] to-[#f21111] border-b border-border">
        <div className="flex items-center justify-center py-4">
          <span className="text-white text-sm">Loading categories...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="border-b border-border overflow-x-auto"
      style={{
        backgroundColor: THEME_CONFIG.category_tabs.bg,
        borderRadius: `${THEME_CONFIG.category_tabs.border_radius}px`,
      }}
    >
      <div className="flex items-center justify-start">
        {categories.map((category) => {
          const isActive = activeCategory === category._id;
          return (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              className="flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 min-w-[70px] sm:min-w-[80px] md:min-w-[90px] transition-colors"
              style={{
                backgroundColor: isActive
                  ? THEME_CONFIG.category_tabs.active_bg
                  : "transparent",
                color: isActive
                  ? THEME_CONFIG.category_tabs.active_text_color
                  : THEME_CONFIG.category_tabs.text_color,
              }}
            >
              <img
                src={`${API_BASE_URL}${category.icon}`}
                alt={category.name}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-0.5 sm:mb-1 object-contain"
              />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
