import { HeroBanner } from "@/components/HeroBanner";
import { CategoryTabs } from "@/components/CategoryTabs";
import { GameGrid } from "@/components/GameGrid";
import { PromoBanner } from "@/components/PromoBanner";
import Favourites from "@/components/Favourites";
import { PopularGames } from "@/components/PopularGames";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      <div
        className="bg-background bg-fixed bg-cover bg-center bg-no-repeat overflow-x-hidden"
        style={{ backgroundImage: "url(/images/footer-bg.jpg)" }}
      >
        <div
          className={`pt-14 pb-20 md:pb-6 transition-all duration-300 ${
            isCollapsed ? "md:ml-14" : "md:ml-60"
          }`}
        >
          <div className="mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 w-full max-w-[1200px]">
            <HeroBanner />
            <PromoBanner />
            <CategoryTabs onCategoryChange={setSelectedCategory} />
            {selectedCategory && <GameGrid categoryId={selectedCategory} />}
            <Favourites />
            <PopularGames />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
