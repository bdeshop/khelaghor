import { Facebook, Instagram, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { THEME_CONFIG } from "@/constants/theme";

const paymentMethods = [
  {
    id: 1,
    name: "bKash",
    image: "/images/pay16.png",
  },
  {
    id: 2,
    name: "bKash",
    image: "/images/pay22.png",
  },
  {
    id: 3,
    name: "Grolo",
    image: "/images/pay33.png",
  },
  { id: 4, name: "3PM", image: "/images/pay45.png" },
  {
    id: 5,
    name: "Cryptocurrency",
    image: "/images/pay48.png",
  },
];

const responsibleGaming = [
  { id: 1, path: "/icons/age-limit.png", label: "18+" },
  { id: 2, path: "/icons/gamcare.png", label: "Responsible" },
  { id: 3, path: "/icons/regulations.png", label: "Safe" },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      className="py-8 mt-12"
      style={{
        backgroundColor: THEME_CONFIG.footer.background,
        color: THEME_CONFIG.footer.text_color,
      }}
    >
      <div className="container mx-auto px-4 space-y-8">
        {/* Payment Methods */}
        <div>
          <h3
            className="text-sm font-bold mb-4 uppercase"
            style={{ color: THEME_CONFIG.footer.heading_color }}
          >
            {t("paymentMethods")}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="  px-3 py-2  cursor-pointer">
                <img
                  src={method.image}
                  alt={method.name}
                  className="h-6 w-16 opacity-80"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Responsible Gaming */}
        <div>
          <h3
            className="text-sm font-bold mb-4 uppercase"
            style={{ color: THEME_CONFIG.footer.heading_color }}
          >
            {t("responsibleGaming")}
          </h3>
          <div className="flex items-center gap-3">
            {responsibleGaming.map((item) => (
              <div
                key={item.id}
                className="rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                <span className="text-2xl">
                  <img src={item.path} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Websites */}
        <div>
          <h3
            className="text-sm font-bold mb-4 uppercase"
            style={{ color: THEME_CONFIG.footer.heading_color }}
          >
            {t("communityWebsites")}
          </h3>
          <div className="flex items-center gap-3">
            <a href="#">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#">
              <Send className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          className="pt-6"
          style={{
            borderTop: `1px solid ${THEME_CONFIG.footer.divider_color}`,
          }}
        >
          {/* Footer Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <a
              href="#"
              className="transition-colors"
              style={{ color: THEME_CONFIG.footer.heading_color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.link_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.heading_color)
              }
            >
              {t("affiliatesProgram")}
            </a>
            <span style={{ color: THEME_CONFIG.footer.muted_text }}>|</span>
            <a
              href="#"
              className="transition-colors"
              style={{ color: THEME_CONFIG.footer.heading_color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.link_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.heading_color)
              }
            >
              {t("responsibleGaming")}
            </a>
            <span style={{ color: THEME_CONFIG.footer.muted_text }}>|</span>
            <a
              href="#"
              className="transition-colors"
              style={{ color: THEME_CONFIG.footer.heading_color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.link_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.heading_color)
              }
            >
              {t("aboutUs")}
            </a>
            <span style={{ color: THEME_CONFIG.footer.muted_text }}>|</span>
            <a
              href="#"
              className="transition-colors"
              style={{ color: THEME_CONFIG.footer.heading_color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.link_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.heading_color)
              }
            >
              {t("security")}
            </a>
            <span style={{ color: THEME_CONFIG.footer.muted_text }}>|</span>
            <a
              href="#"
              className="transition-colors"
              style={{ color: THEME_CONFIG.footer.heading_color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.link_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.heading_color)
              }
            >
              {t("privacyPolicy")}
            </a>
            <span style={{ color: THEME_CONFIG.footer.muted_text }}>|</span>
            <a
              href="#"
              className="transition-colors"
              style={{ color: THEME_CONFIG.footer.heading_color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.link_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  THEME_CONFIG.footer.heading_color)
              }
            >
              {t("faq")}
            </a>
          </div>

          {/* Gaming License & Brand Partner */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 py-6"
            style={{
              borderTop: `1px solid ${THEME_CONFIG.footer.divider_color}`,
              borderBottom: `1px solid ${THEME_CONFIG.footer.divider_color}`,
            }}
          >
            <div>
              <h4
                className="text-sm font-bold mb-3"
                style={{ color: THEME_CONFIG.footer.heading_color }}
              >
                {t("gamingLicense")}
              </h4>
              <div className="flex items-center gap-4">
                <img
                  src="/images/anjouan-egaming.png"
                  alt="Gaming License"
                  className="h-8 opacity-80"
                />
                <img
                  src="/images/gaming_license.png"
                  alt="Anjouan eGaming"
                  className="h-8 opacity-80"
                />
              </div>
            </div>
            <div>
              <h4
                className="text-sm font-bold mb-3"
                style={{ color: THEME_CONFIG.footer.heading_color }}
              >
                {t("officialBrandPartner")}
              </h4>
              <img
                src="/images/partner1.png"
                alt="Official Brand Partner"
                className="h-8 opacity-80"
              />
            </div>
          </div>

          {/* Copyright & Description */}
          <div
            className="space-y-4 pt-6"
            style={{
              borderTop: `1px solid ${THEME_CONFIG.footer.divider_color}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="text-2xl font-bold"
                style={{ color: THEME_CONFIG.footer.heading_color }}
              >
                {THEME_CONFIG.brand.site_name.charAt(0)}
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: THEME_CONFIG.footer.text_color }}
                >
                  {t("bestQualityPlatform")}
                </p>
                <p
                  className="text-xs"
                  style={{ color: THEME_CONFIG.footer.muted_text }}
                >
                  {t("allRightsReserved")}
                </p>
              </div>
            </div>

            <div
              className="space-y-3 text-sm leading-relaxed"
              style={{ color: THEME_CONFIG.footer.muted_text }}
            >
              <h3
                className="text-lg font-bold"
                style={{ color: THEME_CONFIG.footer.heading_color }}
              >
                {t("footerTitle")}
              </h3>
              <p>{t("footerPara1")}</p>
              <p>{t("footerPara2")}</p>
              <p>{t("footerPara3")}</p>
              <p>{t("footerPara4")}</p>
              <p>{t("footerPara5")}</p>
              <p>{t("footerPara6")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
