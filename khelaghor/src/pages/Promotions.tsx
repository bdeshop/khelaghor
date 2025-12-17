import { ClockIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/components/ui/sidebar";
import { FundsModal } from "@/components/FundsModal";
import { PromotionDetailsModal } from "@/components/PromotionDetailsModal";
import { API_BASE_URL } from "@/config/api";

interface BonusSettings {
  bonusPercentage: number;
  maxBonusAmount: number;
  bonusType: string;
  bonusAmount: number;
  minDepositAmount: number;
}

interface GameType {
  _id: string;
  name: string;
}

interface PaymentMethod {
  _id: string;
  method_name_en: string;
  method_name_bd: string;
  method_image: string;
}

interface Promotion {
  _id: string;
  promotionImage: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  gameType: GameType;
  paymentMethods: PaymentMethod[];
  bonusSettings: BonusSettings;
  createdAt: string;
  updatedAt: string;
}

interface PromotionsResponse {
  success: boolean;
  count: number;
  promotions: Promotion[];
}

export default function Promotions() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [promoCode, setPromoCode] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [categories, setCategories] = useState<string[]>(["ALL"]);
  const [loading, setLoading] = useState(true);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const { t, language } = useLanguage();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/promotions`);
        const data: PromotionsResponse = await response.json();

        if (data.success) {
          setPromotions(data.promotions);

          // Extract unique game types for categories
          const gameTypes = data.promotions.map((promo) => promo.gameType.name);
          const uniqueCategories = ["ALL", ...Array.from(new Set(gameTypes))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const filteredPromotions =
    activeCategory === "ALL"
      ? promotions
      : promotions.filter((promo) => promo.gameType.name === activeCategory);

  const handleShowDetails = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div
        className={`pt-14 pb-20 md:pb-6 transition-all duration-300 ${
          isCollapsed ? "md:ml-14" : "md:ml-60"
        }`}
      >
        {/* Category Tabs - Full Width */}
        <div className="bg-black py-3 mb-6 border-b border-gray-800">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? "bg-gradient-to-b from-[#db110f] to-[#750503] text-white rounded-t"
                      : "bg-[#2e2f31] text-gray-300 hover:bg-[#3a3b3d] rounded-t"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1300px] mx-auto px-6">
          {/* Promo Code Input */}
          <div className="flex gap-2 mb-6 justify-end">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t("promoCode")}
              className="w-64 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition-colors">
              {t("add")}
            </button>
          </div>

          {/* Promotions Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-white text-lg">
                {t("loading") || "Loading..."}
              </div>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-400 text-lg">
                {t("noPromotions") || "No promotions available"}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPromotions.map((promo) => (
                <div
                  key={promo._id}
                  className="bg-[#222222] rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={`${API_BASE_URL}${promo.promotionImage}`}
                      alt={language === "bangla" ? promo.titleBn : promo.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {t("new")}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      ∞
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">
                      {language === "bangla" ? promo.titleBn : promo.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2">
                      {promo.gameType.name}
                    </p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                      <span>
                        <ClockIcon className="w-4 h-4" />
                      </span>
                      <span className="line-clamp-1">
                        {new Date(promo.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Bonus Info */}
                    <div className="text-xs text-gray-300 mb-3">
                      {promo.bonusSettings.bonusType === "fixed" ? (
                        <span>৳{promo.bonusSettings.bonusAmount} Bonus</span>
                      ) : (
                        <span>
                          {promo.bonusSettings.bonusPercentage}% up to ৳
                          {promo.bonusSettings.maxBonusAmount}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 justify-end">
                      {promo.bonusSettings.minDepositAmount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedPromotion(promo);
                            setIsFundsModalOpen(true);
                          }}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded text-sm font-medium transition-colors"
                        >
                          {t("deposit")}
                        </button>
                      )}
                      <button
                        onClick={() => handleShowDetails(promo)}
                        className="text-white px-5 py-2.5 rounded text-sm font-medium transition-all hover:opacity-90"
                        style={{
                          background:
                            "linear-gradient(to bottom, #db110f, #750503)",
                        }}
                      >
                        {t("detail")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Funds Modal */}
      <FundsModal
        isOpen={isFundsModalOpen}
        onClose={() => {
          setIsFundsModalOpen(false);
          setSelectedPromotion(null);
        }}
        selectedPromotion={selectedPromotion}
      />

      {/* Promotion Details Modal */}
      <PromotionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        promotion={selectedPromotion}
      />
    </div>
  );
}
