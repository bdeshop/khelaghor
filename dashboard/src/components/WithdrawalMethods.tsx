import { useState, useEffect } from "react";
import { getWithdrawalMethods, deleteWithdrawalMethod } from "../config/api";
import { Wallet, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import AddWithdrawalMethodModal from "./AddWithdrawalMethodModal";
import EditWithdrawalMethodModal from "./EditWithdrawalMethodModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./DepositMethods.css";

interface UserInputField {
  fieldLabelEn: string;
  fieldLabelBn: string;
  fieldType: string;
  required: boolean;
}

interface WithdrawalMethod {
  id: string;
  methodNameEn: string;
  methodNameBn: string;
  minimumWithdrawal: number;
  maximumWithdrawal: number;
  processingTime: string;
  status: string;
  withdrawalFee: number;
  feeType: string;
  methodImage?: string;
  withdrawPageImage?: string;
  colors: {
    textColor: string;
    backgroundColor: string;
    buttonColor: string;
  };
  instructionEn: string;
  instructionBn: string;
  userInputFields: UserInputField[];
  createdAt: string;
  updatedAt: string;
}

function WithdrawalMethods() {
  const [withdrawalMethods, setWithdrawalMethods] = useState<
    WithdrawalMethod[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchWithdrawalMethods = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getWithdrawalMethods();
      const methodsData =
        response.withdrawMethods || response.withdrawalMethods || response;
      setWithdrawalMethods(Array.isArray(methodsData) ? methodsData : []);
      console.log("Withdrawal methods fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch withdrawal methods";
      setError(errorMessage);
      console.error("Error fetching withdrawal methods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalMethods();
  }, []);

  const handleEdit = (method: WithdrawalMethod) => {
    setSelectedMethod(method);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchWithdrawalMethods();
  };

  const handleDelete = (method: WithdrawalMethod) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMethod) return;

    setIsDeleting(true);
    try {
      await deleteWithdrawalMethod(selectedMethod.id);
      console.log("Withdrawal method deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedMethod(null);
      fetchWithdrawalMethods();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete withdrawal method";
      setError(errorMessage);
      console.error("Error deleting withdrawal method:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchWithdrawalMethods();
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
      <AddWithdrawalMethodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedMethod && (
        <EditWithdrawalMethodModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMethod(null);
          }}
          onSuccess={handleEditSuccess}
          withdrawalMethod={selectedMethod}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMethod(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Withdrawal Method?"
        message={`Are you sure you want to delete "${selectedMethod?.methodNameEn}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      <div className="deposit-methods-container">
        <div className="deposit-methods-header">
          <div className="deposit-methods-header-content">
            <div className="deposit-methods-header-icon">
              <Wallet size={32} />
            </div>
            <div>
              <h1 className="deposit-methods-title">Withdrawal Methods</h1>
              <p className="deposit-methods-subtitle">
                Manage withdrawal methods and settings
              </p>
            </div>
          </div>
          <div className="deposit-methods-actions">
            <button
              className="refresh-btn"
              onClick={fetchWithdrawalMethods}
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

        {error && (
          <div className="deposit-methods-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="deposit-methods-loading">
            <div className="spinner"></div>
            <p>Loading withdrawal methods...</p>
          </div>
        ) : (
          <>
            <div className="deposit-methods-grid">
              {withdrawalMethods.length === 0 ? (
                <div className="no-deposit-methods">
                  <Wallet size={64} />
                  <h3>No withdrawal methods found</h3>
                  <p>
                    Click "Add Method" to create your first withdrawal method
                  </p>
                </div>
              ) : (
                withdrawalMethods.map((method) => (
                  <div key={method.id} className="deposit-method-card">
                    <div className="deposit-method-image-container">
                      {method.methodImage ? (
                        <img
                          src={`http://localhost:8000${method.methodImage}`}
                          alt={method.methodNameEn}
                          className="deposit-method-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x200?text=Method+Image";
                          }}
                        />
                      ) : (
                        <div className="deposit-method-placeholder">
                          <Wallet size={48} />
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
                        {method.methodNameEn}
                        {method.methodNameBn && (
                          <span className="method-name-bd">
                            {" "}
                            ({method.methodNameBn})
                          </span>
                        )}
                      </h3>

                      <div className="deposit-method-info">
                        <div className="info-row">
                          <span className="info-label">Min/Max:</span>
                          <span className="info-value">
                            ${method.minimumWithdrawal} - $
                            {method.maximumWithdrawal}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Fee:</span>
                          <span className="info-value">
                            {method.withdrawalFee} {method.feeType}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Processing:</span>
                          <span className="info-value">
                            {method.processingTime}
                          </span>
                        </div>
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
                          title="Edit withdrawal method"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="deposit-method-action-btn delete"
                          onClick={() => handleDelete(method)}
                          title="Delete withdrawal method"
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

            {withdrawalMethods.length > 0 && (
              <div className="deposit-methods-footer">
                <p className="results-count">
                  Showing {withdrawalMethods.length} withdrawal method
                  {withdrawalMethods.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default WithdrawalMethods;
