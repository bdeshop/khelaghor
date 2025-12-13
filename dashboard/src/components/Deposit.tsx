import { useState } from "react";
import { CreditCard, Wallet, Building2, Smartphone } from "lucide-react";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  const depositMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, fee: "2.5%" },
    { id: "wallet", name: "E-Wallet", icon: Wallet, fee: "Free" },
    { id: "bank", name: "Bank Transfer", icon: Building2, fee: "Free" },
    { id: "mobile", name: "Mobile Payment", icon: Smartphone, fee: "1%" },
  ];

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleDeposit = () => {
    if (!amount || !selectedMethod) {
      alert("Please select an amount and payment method");
      return;
    }
    alert(`Depositing $${amount} via ${selectedMethod}`);
  };

  return (
    <div className="transaction-form">
      <div className="form-section">
        <label className="form-label">Select Amount</label>
        <div className="quick-amounts">
          {quickAmounts.map((value) => (
            <button
              key={value}
              className={`quick-amount-btn ${
                amount === value.toString() ? "active" : ""
              }`}
              onClick={() => setAmount(value.toString())}
            >
              ${value}
            </button>
          ))}
        </div>
        <input
          type="number"
          className="amount-input"
          placeholder="Enter custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="form-section">
        <label className="form-label">Payment Method</label>
        <div className="payment-methods">
          {depositMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`payment-method ${
                  selectedMethod === method.id ? "active" : ""
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="method-icon">
                  <Icon size={24} />
                </div>
                <div className="method-info">
                  <div className="method-name">{method.name}</div>
                  <div className="method-fee">Fee: {method.fee}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-summary">
        <div className="summary-row">
          <span>Amount:</span>
          <span className="summary-value">${amount || "0.00"}</span>
        </div>
        <div className="summary-row">
          <span>Fee:</span>
          <span className="summary-value">$0.00</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span className="summary-value">${amount || "0.00"}</span>
        </div>
      </div>

      <button className="submit-btn" onClick={handleDeposit}>
        Deposit Now
      </button>
    </div>
  );
};

export default Deposit;
