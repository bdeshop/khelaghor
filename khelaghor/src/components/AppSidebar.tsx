import {
  Home,
  Gamepad2,
  Trophy,
  Dices,
  Flame,
  Table2,
  Fish,
  Zap,
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

const items = [
  {
    titleKey: "home",
    url: "/",
    icon: Home,
    hasDropdown: false,
    isModal: false,
  },
  {
    titleKey: "hot",
    url: "/hot",
    icon: Gamepad2,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "sports",
    url: "/sports",
    icon: Trophy,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "casino",
    url: "/casino",
    icon: Dices,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "slots",
    url: "/slots",
    icon: Dices,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "crash",
    url: "/crash",
    icon: Flame,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "table",
    url: "/table",
    icon: Table2,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "fishing",
    url: "/fishing",
    icon: Fish,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "arcade",
    url: "/arcade",
    icon: Zap,
    hasDropdown: true,
    isModal: false,
  },
  {
    titleKey: "lottery",
    url: "/lottery",
    icon: Ticket,
    hasDropdown: true,
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

  useEffect(() => {
    const fetchAppVersion = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/app-version");
        const data = await response.json();
        if (data.success && data.appVersion?.apkUrl) {
          setApkUrl(data.appVersion.apkUrl);
        }
      } catch (error) {
        console.error("Failed to fetch app version:", error);
      }
    };

    fetchAppVersion();
  }, []);

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
                {items.map((item) => (
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
