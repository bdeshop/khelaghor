import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { THEME_CONFIG } from "@/constants/theme";

interface PopularGame {
  _id: string;
  image: string;
  title: string;
  redirectUrl: string;
  isActive: boolean;
  order: number;
}

export function PopularGames() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [games, setGames] = useState<PopularGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/popular-games");
        const data = await response.json();
        if (data.success && data.games) {
          setGames(data.games);
        }
      } catch (error) {
        console.error("Failed to fetch popular games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <div
            className="w-1 h-5 rounded-full"
            style={{
              backgroundColor:
                THEME_CONFIG.popular_games.section_title.indicator_color,
            }}
          />
          <h2
            className="text-md font-bold uppercase"
            style={{
              color: THEME_CONFIG.popular_games.section_title.text_color,
            }}
          >
            {t("popularGames")}
          </h2>
        </div>
        <div className="flex gap-2 sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 sm:gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/10 rounded-lg animate-pulse flex-shrink-0 w-32 sm:w-auto aspect-[4/3]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3 py-2 ">
        <div
          className="w-1 h-5 rounded-full"
          style={{
            backgroundColor:
              THEME_CONFIG.popular_games.section_title.indicator_color,
          }}
        />
        <h2
          className="text-md font-bold uppercase"
          style={{ color: THEME_CONFIG.popular_games.section_title.text_color }}
        >
          {t("popularGames")}
        </h2>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex overflow-x-auto gap-2 sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 sm:gap-2 pb-2 scrollbar-hide cursor-grab select-none"
      >
        {games.map((game) => (
          <div
            key={game._id}
            className="rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 group flex-shrink-0 w-32 sm:w-auto"
            style={{
              backgroundColor: THEME_CONFIG.popular_games.card.bg,
              transform: "scale(1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = `scale(${THEME_CONFIG.popular_games.card.hover_scale})`)
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={`http://localhost:8000${game.image}`}
                alt={game.title}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      THEME_CONFIG.popular_games.card.play_button_bg,
                  }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5"
                    fill={THEME_CONFIG.popular_games.card.text_color}
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="p-2"
              style={{
                backgroundColor: THEME_CONFIG.popular_games.card.footer_bg,
              }}
            >
              <p
                className="text-xs font-medium text-left truncate"
                style={{ color: THEME_CONFIG.popular_games.card.text_color }}
              >
                {game.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
