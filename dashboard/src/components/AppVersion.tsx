import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  CheckCircle,
  X,
  Save,
  Package,
  RefreshCw,
} from "lucide-react";
import { uploadAppVersion, getAppVersion } from "../config/api";
import "./AppVersion.css";

interface AppVersionData {
  _id: string;
  version: string;
  apkUrl?: string;
  fileSize?: string;
  releaseNotes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function AppVersion() {
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("url");
  const [loading, setLoading] = useState(false);
  const [fetchingVersion, setFetchingVersion] = useState(true);
  const [currentVersion, setCurrentVersion] = useState<AppVersionData | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    version: "",
    apkFile: null as File | null,
    apkUrl: "",
    fileSize: "",
    releaseNotes: "",
    isActive: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        apkFile: file,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      });
    }
  };

  const fetchCurrentVersion = useCallback(async () => {
    setFetchingVersion(true);
    setMessage(null);
    try {
      const response = await getAppVersion();
      if (response.success && response.appVersion) {
        const version = response.appVersion;
        setCurrentVersion(version);
        // Pre-fill form with current version data
        setFormData({
          version: version.version || "",
          apkFile: null,
          apkUrl: version.apkUrl || "",
          fileSize: version.fileSize || "",
          releaseNotes: version.releaseNotes || "",
          isActive: version.isActive ?? true,
        });
        // Set upload method based on whether there's a URL
        if (version.apkUrl) {
          setUploadMethod("url");
        }
      }
    } catch (error) {
      console.error("Failed to fetch app version:", error);
      setMessage({
        type: "error",
        text: "Failed to load current version",
      });
    } finally {
      setFetchingVersion(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentVersion();
  }, [fetchCurrentVersion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("version", formData.version);

      if (uploadMethod === "file" && formData.apkFile) {
        data.append("apkFile", formData.apkFile);
      } else if (uploadMethod === "url" && formData.apkUrl) {
        data.append("apkUrl", formData.apkUrl);
      }

      if (formData.fileSize) {
        data.append("fileSize", formData.fileSize);
      }
      if (formData.releaseNotes) {
        data.append("releaseNotes", formData.releaseNotes);
      }
      data.append("isActive", formData.isActive.toString());

      await uploadAppVersion(data);
      setMessage({
        type: "success",
        text: "App version uploaded successfully!",
      });

      // Refresh the current version
      await fetchCurrentVersion();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to upload app version",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (currentVersion) {
      // Reset to current version data
      setFormData({
        version: currentVersion.version || "",
        apkFile: null,
        apkUrl: currentVersion.apkUrl || "",
        fileSize: currentVersion.fileSize || "",
        releaseNotes: currentVersion.releaseNotes || "",
        isActive: currentVersion.isActive ?? true,
      });
    } else {
      // Reset to empty
      setFormData({
        version: "",
        apkFile: null,
        apkUrl: "",
        fileSize: "",
        releaseNotes: "",
        isActive: true,
      });
    }
    setMessage(null);
  };

  return (
    <div className="app-version-container">
      <div className="app-version-content">
        <div className="content-header">
          <h1 className="content-title">App Version Management</h1>
          <p className="content-subtitle">
            Manage your application versions and updates
          </p>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon blue">
              <Package size={24} />
            </div>
            <div className="info-content">
              <h3>Version Control</h3>
              <p>
                Upload new APK versions to keep your app up to date. Users will
                be notified of available updates.
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon green">
              <CheckCircle size={24} />
            </div>
            <div className="info-content">
              <h3>Active Version</h3>
              <p>
                Mark a version as active to make it available for download. Only
                one version can be active at a time.
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon orange">
              <FileText size={24} />
            </div>
            <div className="info-content">
              <h3>Release Notes</h3>
              <p>
                Add release notes to inform users about new features, bug fixes,
                and improvements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="app-version-form-section">
        <div className="form-section-header">
          <div className="form-header-content">
            <div className="form-header-icon">
              <Package size={28} />
            </div>
            <div>
              <h2 className="form-section-title">
                {currentVersion ? "Update App Version" : "Upload App Version"}
              </h2>
              <p className="form-section-subtitle">
                {currentVersion
                  ? `Current version: ${
                      currentVersion.version
                    } • Last updated: ${new Date(
                      currentVersion.updatedAt
                    ).toLocaleDateString()}`
                  : "Upload a new APK file or provide a download URL"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={fetchCurrentVersion}
            disabled={fetchingVersion}
            title="Refresh version"
          >
            <RefreshCw
              size={20}
              className={fetchingVersion ? "spinning" : ""}
            />
          </button>
        </div>

        {message && (
          <div className={`version-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {fetchingVersion ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading current version...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="version-form">
            <div className="form-grid">
              {/* Version */}
              <div className="form-group">
                <label htmlFor="version">
                  Version <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="version"
                  placeholder="e.g., 1.0.0"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  required
                />
              </div>

              {/* Upload Method Toggle */}
              <div className="form-group">
                <label>Upload Method</label>
                <div className="method-toggle">
                  <button
                    type="button"
                    className={`method-btn ${
                      uploadMethod === "file" ? "active" : ""
                    }`}
                    onClick={() => setUploadMethod("file")}
                  >
                    <Upload size={18} />
                    Upload File
                  </button>
                  <button
                    type="button"
                    className={`method-btn ${
                      uploadMethod === "url" ? "active" : ""
                    }`}
                    onClick={() => setUploadMethod("url")}
                  >
                    <LinkIcon size={18} />
                    Paste URL
                  </button>
                </div>
              </div>

              {/* File Upload */}
              {uploadMethod === "file" && (
                <div className="form-group form-group-full">
                  <label htmlFor="apkFile">
                    APK File <span className="required">*</span>
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="apkFile"
                      accept=".apk"
                      onChange={handleFileChange}
                      required={uploadMethod === "file"}
                    />
                    <label htmlFor="apkFile" className="file-upload-label">
                      <Upload size={24} />
                      <div className="file-upload-text">
                        <span className="file-upload-main">
                          {formData.apkFile
                            ? formData.apkFile.name
                            : "Choose APK file or drag and drop here"}
                        </span>
                        <span className="file-upload-hint">
                          Supported format: .apk
                        </span>
                      </div>
                    </label>
                  </div>
                  {formData.apkFile && (
                    <div className="file-info">
                      <FileText size={16} />
                      <span>{formData.fileSize}</span>
                    </div>
                  )}
                </div>
              )}

              {/* URL Input */}
              {uploadMethod === "url" && (
                <>
                  <div className="form-group form-group-full">
                    <label htmlFor="apkUrl">
                      APK URL <span className="required">*</span>
                    </label>
                    <input
                      type="url"
                      id="apkUrl"
                      placeholder="https://example.com/app.apk"
                      value={formData.apkUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, apkUrl: e.target.value })
                      }
                      required={uploadMethod === "url"}
                    />
                  </div>

                  {/* File Size (Manual for URL) */}
                  <div className="form-group">
                    <label htmlFor="fileSize">File Size (Optional)</label>
                    <input
                      type="text"
                      id="fileSize"
                      placeholder="e.g., 25.5 MB"
                      value={formData.fileSize}
                      onChange={(e) =>
                        setFormData({ ...formData, fileSize: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* Release Notes */}
              <div className="form-group form-group-full">
                <label htmlFor="releaseNotes">Release Notes (Optional)</label>
                <textarea
                  id="releaseNotes"
                  rows={5}
                  placeholder="What's new in this version...&#10;• New features&#10;• Bug fixes&#10;• Improvements"
                  value={formData.releaseNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseNotes: e.target.value })
                  }
                />
              </div>

              {/* Is Active */}
              <div className="form-group form-group-full">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <CheckCircle size={20} />
                  <span>Set as active version</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
                disabled={loading}
              >
                <X size={18} />
                Reset
              </button>
              <button type="submit" className="btn-upload" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Upload Version
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AppVersion;
