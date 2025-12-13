import { useState, useEffect } from "react";
import {
  getFooterSettings,
  updateFooterSettings,
  uploadFooterIcon,
} from "../config/api";
import {
  Layout,
  RefreshCw,
  Save,
  RotateCcw,
  Upload,
  X,
  Link2,
  FileText,
  Shield,
  Award,
  Users,
  Copyright,
  Plus,
  Trash2,
} from "lucide-react";
import "./FooterManagement.css";

interface SocialLink {
  platform: string;
  icon: string;
  url: string;
}

interface QuickLink {
  title: string;
  url: string;
}

interface ResponsibleGaming {
  title: string;
  icon: string;
}

interface GamingLicense {
  name: string;
  icon: string;
}

interface BrandPartner {
  name: string;
  logo: string;
}

interface DescriptionSection {
  title: string;
  content: string;
}

function FooterManagement() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [copyrightText, setCopyrightText] = useState("");

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [uploadingSocialIcon, setUploadingSocialIcon] = useState<number | null>(
    null
  );

  // Quick Links
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

  // Responsible Gaming
  const [responsibleGaming, setResponsibleGaming] = useState<
    ResponsibleGaming[]
  >([]);
  const [uploadingRGIcon, setUploadingRGIcon] = useState<number | null>(null);

  // Gaming Licenses
  const [gamingLicenses, setGamingLicenses] = useState<GamingLicense[]>([]);
  const [uploadingLicenseIcon, setUploadingLicenseIcon] = useState<
    number | null
  >(null);

  // Brand Partners
  const [brandPartners, setBrandPartners] = useState<BrandPartner[]>([]);
  const [uploadingPartnerLogo, setUploadingPartnerLogo] = useState<
    number | null
  >(null);

  // Description Section
  const [descriptionSection, setDescriptionSection] =
    useState<DescriptionSection>({ title: "", content: "" });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFooterSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getFooterSettings();
      const data = response.footer || response;

      if (data.logo) {
        setLogoPreview(`http://localhost:8000${data.logo}`);
      }

      setCopyrightText(data.copyrightText || "");
      setSocialLinks(data.socialLinks || []);
      setQuickLinks(data.quickLinks || []);
      setResponsibleGaming(data.responsibleGaming || []);
      setGamingLicenses(data.gamingLicenses || []);
      setBrandPartners(data.brandPartners || []);
      setDescriptionSection(
        data.descriptionSection || { title: "", content: "" }
      );

      console.log("Footer settings fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch footer settings";
      setError(errorMessage);
      console.error("Error fetching footer settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setLogoFile(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Social Links handlers
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", icon: "", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const handleSocialIconUpload = async (index: number, file: File) => {
    setUploadingSocialIcon(index);
    try {
      const iconUrl = await uploadFooterIcon(file);
      updateSocialLink(index, "icon", iconUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload icon");
    } finally {
      setUploadingSocialIcon(null);
    }
  };

  // Quick Links handlers
  const addQuickLink = () => {
    setQuickLinks([...quickLinks, { title: "", url: "" }]);
  };

  const removeQuickLink = (index: number) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== index));
  };

  const updateQuickLink = (
    index: number,
    field: keyof QuickLink,
    value: string
  ) => {
    const updated = [...quickLinks];
    updated[index][field] = value;
    setQuickLinks(updated);
  };

  // Responsible Gaming handlers
  const addResponsibleGaming = () => {
    setResponsibleGaming([...responsibleGaming, { title: "", icon: "" }]);
  };

  const removeResponsibleGaming = (index: number) => {
    setResponsibleGaming(responsibleGaming.filter((_, i) => i !== index));
  };

  const updateResponsibleGaming = (
    index: number,
    field: keyof ResponsibleGaming,
    value: string
  ) => {
    const updated = [...responsibleGaming];
    updated[index][field] = value;
    setResponsibleGaming(updated);
  };

  const handleRGIconUpload = async (index: number, file: File) => {
    setUploadingRGIcon(index);
    try {
      const iconUrl = await uploadFooterIcon(file);
      updateResponsibleGaming(index, "icon", iconUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload icon");
    } finally {
      setUploadingRGIcon(null);
    }
  };

  // Gaming Licenses handlers
  const addGamingLicense = () => {
    setGamingLicenses([...gamingLicenses, { name: "", icon: "" }]);
  };

  const removeGamingLicense = (index: number) => {
    setGamingLicenses(gamingLicenses.filter((_, i) => i !== index));
  };

  const updateGamingLicense = (
    index: number,
    field: keyof GamingLicense,
    value: string
  ) => {
    const updated = [...gamingLicenses];
    updated[index][field] = value;
    setGamingLicenses(updated);
  };

  const handleLicenseIconUpload = async (index: number, file: File) => {
    setUploadingLicenseIcon(index);
    try {
      const iconUrl = await uploadFooterIcon(file);
      updateGamingLicense(index, "icon", iconUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload icon");
    } finally {
      setUploadingLicenseIcon(null);
    }
  };

  // Brand Partners handlers
  const addBrandPartner = () => {
    setBrandPartners([...brandPartners, { name: "", logo: "" }]);
  };

  const removeBrandPartner = (index: number) => {
    setBrandPartners(brandPartners.filter((_, i) => i !== index));
  };

  const updateBrandPartner = (
    index: number,
    field: keyof BrandPartner,
    value: string
  ) => {
    const updated = [...brandPartners];
    updated[index][field] = value;
    setBrandPartners(updated);
  };

  const handlePartnerLogoUpload = async (index: number, file: File) => {
    setUploadingPartnerLogo(index);
    try {
      const logoUrl = await uploadFooterIcon(file);
      updateBrandPartner(index, "logo", logoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setUploadingPartnerLogo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      formData.append("socialLinks", JSON.stringify(socialLinks));
      formData.append("quickLinks", JSON.stringify(quickLinks));
      formData.append("responsibleGaming", JSON.stringify(responsibleGaming));
      formData.append("gamingLicenses", JSON.stringify(gamingLicenses));
      formData.append("brandPartners", JSON.stringify(brandPartners));
      formData.append("copyrightText", copyrightText);
      formData.append("descriptionSection", JSON.stringify(descriptionSection));

      const response = await updateFooterSettings(formData);
      console.log("Footer settings updated successfully:", response);

      setSuccess("Footer settings updated successfully!");
      setLogoFile(null);

      await fetchFooterSettings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update footer settings";
      setError(errorMessage);
      console.error("Error updating footer settings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    fetchFooterSettings();
    setLogoFile(null);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="footer-management-container">
        <div className="footer-management-loading">
          <div className="spinner"></div>
          <p>Loading footer settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="footer-management-container">
      <div className="footer-management-header">
        <div className="footer-management-header-content">
          <div className="footer-management-header-icon">
            <Layout size={32} />
          </div>
          <div>
            <h1 className="footer-management-title">Footer Management</h1>
            <p className="footer-management-subtitle">
              Configure footer content and settings
            </p>
          </div>
        </div>
        <div className="footer-management-actions">
          <button
            className="refresh-btn"
            onClick={fetchFooterSettings}
            disabled={isSubmitting}
          >
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="footer-management-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="footer-management-success">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      <div className="footer-form-container">
        <form onSubmit={handleSubmit} className="footer-form">
          {/* Logo Section */}
          <div className="form-section">
            <h3 className="form-section-title">
              <Upload size={20} />
              Footer Logo
            </h3>
            <div className="form-group">
              <label className="form-label">Logo Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={isSubmitting}
                className="form-input"
              />
              {logoPreview && (
                <div className="logo-preview-container">
                  <div className="logo-preview">
                    <img src={logoPreview} alt="Logo preview" />
                    <button
                      type="button"
                      className="remove-logo"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview("");
                      }}
                      disabled={isSubmitting}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="form-section-title">
                <Link2 size={20} />
                Social Links
              </h3>
              <button
                type="button"
                className="btn-add-item"
                onClick={addSocialLink}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Social Link
              </button>
            </div>
            {socialLinks.map((link, index) => (
              <div key={index} className="dynamic-item">
                <div className="item-fields">
                  <div className="form-group">
                    <label className="form-label">Platform</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Facebook"
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(index, "platform", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <div className="icon-upload-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSocialIconUpload(index, file);
                        }}
                        disabled={isSubmitting || uploadingSocialIcon === index}
                        className="form-input"
                      />
                      {uploadingSocialIcon === index && (
                        <span className="uploading-text">Uploading...</span>
                      )}
                      {link.icon && (
                        <span className="icon-url">{link.icon}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://facebook.com"
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, "url", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeSocialLink(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="form-section-title">
                <FileText size={20} />
                Quick Links
              </h3>
              <button
                type="button"
                className="btn-add-item"
                onClick={addQuickLink}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Quick Link
              </button>
            </div>
            {quickLinks.map((link, index) => (
              <div key={index} className="dynamic-item">
                <div className="item-fields">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="About Us"
                      value={link.title}
                      onChange={(e) =>
                        updateQuickLink(index, "title", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="/about"
                      value={link.url}
                      onChange={(e) =>
                        updateQuickLink(index, "url", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeQuickLink(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Responsible Gaming */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="form-section-title">
                <Shield size={20} />
                Responsible Gaming
              </h3>
              <button
                type="button"
                className="btn-add-item"
                onClick={addResponsibleGaming}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
            {responsibleGaming.map((item, index) => (
              <div key={index} className="dynamic-item">
                <div className="item-fields">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="18+"
                      value={item.title}
                      onChange={(e) =>
                        updateResponsibleGaming(index, "title", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <div className="icon-upload-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleRGIconUpload(index, file);
                        }}
                        disabled={isSubmitting || uploadingRGIcon === index}
                        className="form-input"
                      />
                      {uploadingRGIcon === index && (
                        <span className="uploading-text">Uploading...</span>
                      )}
                      {item.icon && (
                        <span className="icon-url">{item.icon}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeResponsibleGaming(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Gaming Licenses */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="form-section-title">
                <Award size={20} />
                Gaming Licenses
              </h3>
              <button
                type="button"
                className="btn-add-item"
                onClick={addGamingLicense}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add License
              </button>
            </div>
            {gamingLicenses.map((license, index) => (
              <div key={index} className="dynamic-item">
                <div className="item-fields">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Curaçao Gaming"
                      value={license.name}
                      onChange={(e) =>
                        updateGamingLicense(index, "name", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <div className="icon-upload-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLicenseIconUpload(index, file);
                        }}
                        disabled={
                          isSubmitting || uploadingLicenseIcon === index
                        }
                        className="form-input"
                      />
                      {uploadingLicenseIcon === index && (
                        <span className="uploading-text">Uploading...</span>
                      )}
                      {license.icon && (
                        <span className="icon-url">{license.icon}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeGamingLicense(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Brand Partners */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="form-section-title">
                <Users size={20} />
                Brand Partners
              </h3>
              <button
                type="button"
                className="btn-add-item"
                onClick={addBrandPartner}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Partner
              </button>
            </div>
            {brandPartners.map((partner, index) => (
              <div key={index} className="dynamic-item">
                <div className="item-fields">
                  <div className="form-group">
                    <label className="form-label">Partner Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Partner Name"
                      value={partner.name}
                      onChange={(e) =>
                        updateBrandPartner(index, "name", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Partner Logo</label>
                    <div className="icon-upload-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePartnerLogoUpload(index, file);
                        }}
                        disabled={
                          isSubmitting || uploadingPartnerLogo === index
                        }
                        className="form-input"
                      />
                      {uploadingPartnerLogo === index && (
                        <span className="uploading-text">Uploading...</span>
                      )}
                      {partner.logo && (
                        <span className="icon-url">{partner.logo}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeBrandPartner(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Copyright & Description */}
          <div className="form-section">
            <h3 className="form-section-title">
              <Copyright size={20} />
              Copyright & Description
            </h3>
            <div className="form-group">
              <label className="form-label">Copyright Text</label>
              <input
                type="text"
                className="form-input"
                placeholder="© 2024 Khelaghor. All rights reserved."
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="About"
                value={descriptionSection.title}
                onChange={(e) =>
                  setDescriptionSection({
                    ...descriptionSection,
                    title: e.target.value,
                  })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description Content</label>
              <textarea
                className="form-input"
                placeholder="Description text here"
                value={descriptionSection.content}
                onChange={(e) =>
                  setDescriptionSection({
                    ...descriptionSection,
                    content: e.target.value,
                  })
                }
                disabled={isSubmitting}
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FooterManagement;
