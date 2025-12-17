import {
  Home,
  Ticket,
  Star,
  Download,
  MessageSquare,
  ChevronDown,
  Gift,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { ReferralModal } from "@/components/ReferralModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { API_BASE_URL } from "@/config/api";

interface Category {
  _id: string;
  name: string;
  icon: string;
}

interface Game {
  _id: string;
  title: string;
  image: string;
  url: string;
}

const staticItems = [
  {
    titleKey: "home",
    url: "/",
    icon: Home,
    hasDropdown: false,
    isModal: false,
  },
  {
    titleKey: "promotions",
    url: "/promotions",
    icon: Ticket,
    hasDropdown: false,
    isModal: false,
  },
  {
    titleKey: "referralBonus",
    url: "#",
    icon: Gift,
    hasDropdown: false,
    isModal: true,
  },
  {
    titleKey: "vip",
    url: "/vip",
    icon: Star,
    hasDropdown: false,
    isModal: false,
  },
  {
    titleKey: "download",
    url: "/download",
    icon: Download,
    hasDropdown: false,
    isModal: false,
  },
  {
    titleKey: "contactUs",
    url: "/contact",
    icon: MessageSquare,
    hasDropdown: true,
    isModal: false,
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { t } = useLanguage();
  const isCollapsed = state === "collapsed";
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [apkUrl, setApkUrl] = useState<string>("");
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categoryGames, setCategoryGames] = useState<Record<string, Game[]>>(
    {}
  );
  const [loadingGames, setLoadingGames] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAppVersion = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/app-version`);
        const data = await response.json();
        if (data.success && data.appVersion?.apkUrl) {
          setApkUrl(data.appVersion.apkUrl);
        }
      } catch (error) {
        console.error("Failed to fetch app version:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/game-categories`);
        const data = await response.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchAppVersion();
    fetchCategories();
  }, []);

  const fetchCategoryGames = async (categoryId: string) => {
    if (categoryGames[categoryId]) {
      return; // Already fetched
    }

    setLoadingGames((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/games?category=${categoryId}`
      );
      const data = await response.json();
      if (data.success && data.games) {
        setCategoryGames((prev) => ({ ...prev, [categoryId]: data.games }));
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoadingGames((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (openCategory === categoryId) {
      setOpenCategory(null);
    } else {
      setOpenCategory(categoryId);
      fetchCategoryGames(categoryId);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (apkUrl) {
      window.open(apkUrl, "_blank");
    }
  };

  const contactOptions = [
    {
      label: "24/7 Support",
      icon: MessageSquare,
      action: () => {
        // Add support action
      },
    },
    {
      label: "Telegram",
      icon: MessageSquare,
      action: () => {
        window.open("https://t.me/yourtelegram", "_blank");
      },
    },
    {
      label: "Email",
      icon: MessageSquare,
      action: () => {
        window.location.href = "mailto:support@example.com";
      },
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar
        className={`fixed left-0 top-0 z-50 transition-transform duration-300 ${
          isCollapsed ? "-translate-x-full md:translate-x-0 md:w-14" : "w-60"
        }`}
      >
        {/* Collapse Toggle Button */}
        {/* <div
          className={`absolute top-4 z-10 ${
            isCollapsed ? "left-1/2 -translate-x-1/2" : "right-4"
          }`}
        >
          <SidebarTrigger />
        </div> */}

        <SidebarContent className="pt-16">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {staticItems.slice(0, 1).map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton asChild={!item.isModal}>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-red-600 hover:text-white ${
                          isCollapsed
                            ? "justify-center px-3 py-3"
                            : "px-3 py-2.5"
                        }`}
                        activeClassName="bg-red-600 text-white"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <span className="text-sm font-medium">
                              {t(item.titleKey)}
                            </span>
                          )}
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Dynamic Categories */}
                {categories.map((category) => (
                  <SidebarMenuItem key={category._id}>
                    <SidebarMenuButton asChild={false}>
                      <button
                        onClick={() => handleCategoryClick(category._id)}
                        className={`flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-red-600 hover:text-white w-full ${
                          isCollapsed
                            ? "justify-center px-3 py-3"
                            : "px-3 py-2.5"
                        } ${
                          openCategory === category._id
                            ? "bg-red-600 text-white"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`${API_BASE_URL}${category.icon}`}
                            alt={category.name}
                            className="h-5 w-5 flex-shrink-0 object-contain"
                          />
                          {!isCollapsed && (
                            <span className="text-sm font-medium capitalize">
                              {category.name}
                            </span>
                          )}
                        </div>
                        {!isCollapsed && (
                          <ChevronDown
                            className={`h-4 w-4 flex-shrink-0 transition-transform ${
                              openCategory === category._id ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>
                    </SidebarMenuButton>

                    {/* Games Dropdown */}
                    {openCategory === category._id && !isCollapsed && (
                      <div className="mt-1 space-y-0 max-h-80 overflow-y-auto">
                        {loadingGames[category._id] ? (
                          <div className="px-3 py-2 text-xs text-gray-400">
                            Loading games...
                          </div>
                        ) : categoryGames[category._id]?.length > 0 ? (
                          <div className="space-y-0">
                            {categoryGames[category._id].map((game) => (
                              <button
                                key={game._id}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-left border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                              >
                                <img
                                  src={`${API_BASE_URL}${game.image}`}
                                  alt={game.title}
                                  className="h-8 w-8 flex-shrink-0 object-cover rounded"
                                />
                                <span className="text-sm text-white truncate">
                                  {game.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-xs text-gray-400">
                            No games available
                          </div>
                        )}
                      </div>
                    )}
                  </SidebarMenuItem>
                ))}

                {/* Static Items */}
                {staticItems.slice(1).map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    {item.titleKey === "contactUs" ? (
                      <>
                        <SidebarMenuButton asChild={false}>
                          <button
                            onClick={() => setIsContactUsOpen(!isContactUsOpen)}
                            className={`flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-red-600 hover:text-white w-full ${
                              isCollapsed
                                ? "justify-center px-3 py-3"
                                : "px-3 py-2.5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                              {!isCollapsed && (
                                <span className="text-sm font-medium">
                                  {t(item.titleKey)}
                                </span>
                              )}
                            </div>
                            {!isCollapsed && (
                              <ChevronDown
                                className={`h-4 w-4 flex-shrink-0 transition-transform ${
                                  isContactUsOpen ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </button>
                        </SidebarMenuButton>
                        {isContactUsOpen && !isCollapsed && (
                          <div className="ml-8 mt-1 space-y-1">
                            {contactOptions.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={option.action}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-red-600/50 rounded-lg transition-colors w-full text-left"
                              >
                                <span>{option.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild={!item.isModal && item.titleKey !== "download"}
                      >
                        {item.isModal ? (
                          <button
                            onClick={() => setIsReferralModalOpen(true)}
                            className={`flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-red-600 hover:text-white w-full ${
                              isCollapsed
                                ? "justify-center px-3 py-3"
                                : "px-3 py-2.5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                              {!isCollapsed && (
                                <span className="text-sm font-medium">
                                  {t(item.titleKey)}
                                </span>
                              )}
                            </div>
                          </button>
                        ) : item.titleKey === "download" ? (
                          <button
                            onClick={handleDownloadClick}
                            className={`flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-red-600 hover:text-white w-full ${
                              isCollapsed
                                ? "justify-center px-3 py-3"
                                : "px-3 py-2.5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                              {!isCollapsed && (
                                <span className="text-sm font-medium">
                                  {t(item.titleKey)}
                                </span>
                              )}
                            </div>
                          </button>
                        ) : (
                          <NavLink
                            to={item.url}
                            end
                            className={`flex items-center justify-between gap-3 rounded-lg transition-colors hover:bg-red-600 hover:text-white ${
                              isCollapsed
                                ? "justify-center px-3 py-3"
                                : "px-3 py-2.5"
                            }`}
                            activeClassName="bg-red-600 text-white"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 flex-shrink-0" />
                              {!isCollapsed && (
                                <span className="text-sm font-medium">
                                  {t(item.titleKey)}
                                </span>
                              )}
                            </div>
                            {!isCollapsed &&
                              item.hasDropdown &&
                              item.titleKey !== "contactUs" && (
                                <ChevronDown className="h-4 w-4 flex-shrink-0" />
                              )}
                          </NavLink>
                        )}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </>
  );
}
