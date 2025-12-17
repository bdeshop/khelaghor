import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface Game {
  _id: string;
  title: string;
  image: string;
  url: string;
  category: {
    _id: string;
    name: string;
    icon: string;
  };
}

import { API_BASE_URL } from "@/config/api";

interface GameGridProps {
  categoryId: string;
}

export function GameGrid({ categoryId }: GameGridProps) {
  const { t } = useLanguage();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      if (!categoryId) return;

      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/games?category=${categoryId}`
        );
        const data = await res.json();

        if (data.success) {
          setGames(data.games);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 sm:h-5 bg-red-600 rounded-full" />
          <h2 className="text-sm sm:text-md font-bold text-white uppercase">
            {t("hot")}
          </h2>
        </div>
        <div className="text-white text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 sm:h-5 bg-red-600 rounded-full" />
        <h2 className="text-sm sm:text-md font-bold text-white uppercase">
          {t("hot")}
        </h2>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-1 sm:gap-1.5 md:gap-2">
        {games.map((game) => (
          <div
            key={game._id}
            className="bg-[#550b0b] rounded p-0.5 sm:p-1 md:p-1.5 cursor-pointer transition-all hover:bg-[#6a0f0f] active:scale-95 sm:hover:scale-105"
          >
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <div className="w-3/4 sm:w-4/5 aspect-square relative overflow-hidden rounded">
                <img
                  src={`${API_BASE_URL}${game.image}`}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[7px] sm:text-[8px] md:text-[9px] font-medium text-white text-center w-full leading-tight px-0.5">
                {game.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
