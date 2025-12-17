import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_BASE_URL } from "@/config/api";

interface Favourite {
  _id: string;
  image: string;
  title: string;
  actionType: string;
  url?: string;
  modalOptions?: string;
  isActive: boolean;
  order: number;
}

const Favourites = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/favourites`);
        const data = await response.json();
        if (data.success && data.favourites) {
          setFavourites(data.favourites);
        }
      } catch (error) {
        console.error("Failed to fetch favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
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
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
          <h2 className="text-sm sm:text-md font-bold text-white uppercase">
            {t("favourites")}
          </h2>
        </div>
        <div className="flex gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 sm:h-44 md:h-48 bg-white/10 rounded-lg animate-pulse flex-shrink-0 w-64 sm:w-auto"
            />
          ))}
        </div>
      </div>
    );
  }

  if (favourites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 px-2 sm:px-3 py-2">
        <div className="w-1 h-4 bg-red-600 rounded-full" />
        <h2 className="text-sm sm:text-md font-bold text-white uppercase">
          {t("favourites")}
        </h2>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex overflow-x-auto gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4 pb-2 scrollbar-hide cursor-grab select-none"
      >
        {favourites.map((favourite) => (
          <div
            key={favourite._id}
            className="relative bg-[#550b0b] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] flex-shrink-0 w-64 sm:w-auto"
          >
            <div className="relative h-32 sm:h-44 md:h-48">
              <img
                src={`${API_BASE_URL}${favourite.image}`}
                alt={favourite.title}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
