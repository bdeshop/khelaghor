import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { THEME_CONFIG } from "@/constants/theme";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  textEnglish: string;
  textBangla: string;
  order: number;
}

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerHeight, setBannerHeight] = useState<number>(
    THEME_CONFIG.banner.height.mobile
  );

  // Handle responsive height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setBannerHeight(THEME_CONFIG.banner.height.desktop);
      } else if (width >= 640) {
        setBannerHeight(THEME_CONFIG.banner.height.tablet);
      } else {
        setBannerHeight(THEME_CONFIG.banner.height.mobile);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/banners/active"
        );
        const data = await response.json();
        if (data.success && data.banners) {
          setBanners(data.banners);
          const urls = data.banners.map(
            (banner: Banner) => `http://localhost:8000${banner.imageUrl}`
          );
          setImageUrls(urls);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % imageUrls.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  useEffect(() => {
    if (imageUrls.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageUrls.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  if (loading) {
    return (
      <div className="relative flex items-center gap-0.5 sm:gap-2 md:gap-4 w-full overflow-hidden">
        <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 md:gap-3 min-w-0">
          <div className="relative w-full h-[140px] sm:h-[200px] md:h-[300px] rounded-lg overflow-hidden bg-white/10 animate-pulse" />
        </div>
      </div>
    );
  }

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-0.5 sm:gap-2 md:gap-4 w-full overflow-hidden">
      <button
        onClick={prevSlide}
        className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors flex-shrink-0"
        style={{
          backgroundColor: THEME_CONFIG.banner.nav_button.bg,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            THEME_CONFIG.banner.nav_button.hover_bg)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor =
            THEME_CONFIG.banner.nav_button.bg)
        }
      >
        <ChevronLeft
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6"
          style={{ color: THEME_CONFIG.banner.nav_button.icon_color }}
        />
      </button>

      <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 md:gap-3 min-w-0">
        <div
          className="relative w-full rounded-lg overflow-hidden"
          style={{
            height: `${bannerHeight}px`,
          }}
        >
          <img
            src={imageUrls[currentSlide]}
            alt={banners[currentSlide]?.title || "Banner"}
            className="absolute inset-0 w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Image failed to load:", imageUrls[currentSlide]);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center">
          {imageUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="h-0.5 sm:h-1 rounded-full transition-all"
              style={{
                width: i === currentSlide ? "48px" : "32px",
                backgroundColor:
                  i === currentSlide
                    ? THEME_CONFIG.banner.indicator.active_bg
                    : THEME_CONFIG.banner.indicator.inactive_bg,
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={nextSlide}
        className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors flex-shrink-0"
        style={{
          backgroundColor: THEME_CONFIG.banner.nav_button.bg,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            THEME_CONFIG.banner.nav_button.hover_bg)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor =
            THEME_CONFIG.banner.nav_button.bg)
        }
      >
        <ChevronRight
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6"
          style={{ color: THEME_CONFIG.banner.nav_button.icon_color }}
        />
      </button>
    </div>
  );
}
