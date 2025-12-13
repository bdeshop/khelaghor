import { useState, useEffect } from "react";
import { getDepositMethods, deleteDepositMethod } from "../config/api";
import { CreditCard, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import AddDepositMethodModal from "./AddDepositMethodModal";
import EditDepositMethodModal from "./EditDepositMethodModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./DepositMethods.css";

interface UserInputField {
  name: string;
  type: string;
  isRequired: boolean;
  label_en: string;
  label_bd: string;
  instruction_en: string;
  instruction_bd: string;
}

interface DepositMethod {
  id: string;
  method_name_en: string;
  method_name_bd: string;
  agent_wallet_number: string;
  agent_wallet_text: string;
  gateways: string[];
  method_image?: string;
  payment_page_image?: string;
  text_color: string;
  background_color: string;
  button_color: string;
  status: string;
  instruction_en: string;
  instruction_bd: string;
  user_input_fields: UserInputField[];
  createdAt: string;
  updatedAt: string;
}

function DepositMethods() {
  const [depositMethods, setDepositMethods] = useState<DepositMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDepositMethods = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getDepositMethods();
      const methodsData = response.depositMethods || response;
      setDepositMethods(methodsData);
      console.log("Deposit methods fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch deposit methods";
      setError(errorMessage);
      console.error("Error fetching deposit methods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositMethods();
  }, []);

  const handleEdit = (method: DepositMethod) => {
    setSelectedMethod(method);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchDepositMethods();
  };

  const handleDelete = (method: DepositMethod) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMethod) return;

    setIsDeleting(true);
    try {
      await deleteDepositMethod(selectedMethod.id);
      console.log("Deposit method deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedMethod(null);
      fetchDepositMethods();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete deposit method";
      setError(errorMessage);
      console.error("Error deleting deposit method:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchDepositMethods();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <AddDepositMethodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedMethod && (
        <EditDepositMethodModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMethod(null);
          }}
          onSuccess={handleEditSuccess}
          depositMethod={selectedMethod}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMethod(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Deposit Method?"
        message={`Are you sure you want to delete "${selectedMethod?.method_name_en}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      <div className="deposit-methods-container">
        {/* Header */}
        <div className="deposit-methods-header">
          <div className="deposit-methods-header-content">
            <div className="deposit-methods-header-icon">
              <CreditCard size={32} />
            </div>
            <div>
              <h1 className="deposit-methods-title">Deposit Methods</h1>
              <p className="deposit-methods-subtitle">
                Manage payment deposit methods and accounts
              </p>
            </div>
          </div>
          <div className="deposit-methods-actions">
            <button
              className="refresh-btn"
              onClick={fetchDepositMethods}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button className="add-deposit-method-btn" onClick={handleAdd}>
              <Plus size={18} />
              <span>Add Method</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="deposit-methods-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="deposit-methods-loading">
            <div className="spinner"></div>
            <p>Loading deposit methods...</p>
          </div>
        ) : (
          <>
            {/* Deposit Methods Grid */}
            <div className="deposit-methods-grid">
              {depositMethods.length === 0 ? (
                <div className="no-deposit-methods">
                  <CreditCard size={64} />
                  <h3>No deposit methods found</h3>
                  <p>Click "Add Method" to create your first deposit method</p>
                </div>
              ) : (
                depositMethods.map((method) => (
                  <div key={method.id} className="deposit-method-card">
                    <div className="deposit-method-image-container">
                      {method.method_image ? (
                        <img
                          src={`http://localhost:8000${method.method_image}`}
                          alt={method.method_name_en}
                          className="deposit-method-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x200?text=Method+Image";
                          }}
                        />
                      ) : (
                        <div className="deposit-method-placeholder">
                          <CreditCard size={48} />
                        </div>
                      )}
                      <div
                        className={`deposit-method-status ${
                          method.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {method.status}
                      </div>
                    </div>

                    <div className="deposit-method-content">
                      <h3 className="deposit-method-title">
                        {method.method_name_en}
                        {method.method_name_bd && (
                          <span className="method-name-bd">
                            {" "}
                            ({method.method_name_bd})
                          </span>
                        )}
                      </h3>

                      <div className="deposit-method-info">
                        <div className="info-row">
                          <span className="info-label">Wallet Number:</span>
                          <span className="info-value">
                            {method.agent_wallet_number}
                          </span>
                        </div>
                        {method.gateways && method.gateways.length > 0 && (
                          <div className="info-row">
                            <span className="info-label">Gateways:</span>
                            <span className="info-value">
                              {method.gateways.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="deposit-method-meta">
                        <span className="deposit-method-date">
                          Created: {formatDate(method.createdAt)}
                        </span>
                      </div>

                      <div className="deposit-method-actions">
                        <button
                          className="deposit-method-action-btn edit"
                          onClick={() => handleEdit(method)}
                          title="Edit deposit method"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="deposit-method-action-btn delete"
                          onClick={() => handleDelete(method)}
                          title="Delete deposit method"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Results Count */}
            {depositMethods.length > 0 && (
              <div className="deposit-methods-footer">
                <p className="results-count">
                  Showing {depositMethods.length} deposit method
                  {depositMethods.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DepositMethods;
