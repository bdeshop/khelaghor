import { useState } from "react";
import { Building2, Wallet, CreditCard } from "lucide-react";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [accountDetails, setAccountDetails] = useState("");

  const withdrawMethods = [
    { id: "bank", name: "Bank Transfer", icon: Building2, time: "1-3 days" },
    { id: "wallet", name: "E-Wallet", icon: Wallet, time: "Instant" },
    { id: "card", name: "Card", icon: CreditCard, time: "3-5 days" },
  ];

  const quickAmounts = [50, 100, 250, 500];
  const availableBalance = 2450;

  const handleWithdraw = () => {
    if (!amount || !selectedMethod || !accountDetails) {
      alert("Please fill in all fields");
      return;
    }
    if (parseFloat(amount) > availableBalance) {
      alert("Insufficient balance");
      return;
    }
    alert(`Withdrawing $${amount} via ${selectedMethod}`);
  };

  return (
    <div className="transaction-form">
      <div className="balance-info">
        <span className="balance-label">Available Balance:</span>
        <span className="balance-value">${availableBalance.toFixed(2)}</span>
      </div>

      <div className="form-section">
        <label className="form-label">Withdrawal Amount</label>
        <div className="quick-amounts">
          {quickAmounts.map((value) => (
            <button
              key={value}
              className={`quick-amount-btn ${
                amount === value.toString() ? "active" : ""
              }`}
              onClick={() => setAmount(value.toString())}
              disabled={value > availableBalance}
            >
              ${value}
            </button>
          ))}
        </div>
        <input
          type="number"
          className="amount-input"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={availableBalance}
        />
      </div>

      <div className="form-section">
        <label className="form-label">Withdrawal Method</label>
        <div className="payment-methods">
          {withdrawMethods.map((method) => {
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
                  <div className="method-fee">Time: {method.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Account Details</label>
        <input
          type="text"
          className="account-input"
          placeholder="Enter account number or wallet ID"
          value={accountDetails}
          onChange={(e) => setAccountDetails(e.target.value)}
        />
      </div>

      <div className="form-summary">
        <div className="summary-row">
          <span>Amount:</span>
          <span className="summary-value">${amount || "0.00"}</span>
        </div>
        <div className="summary-row">
          <span>Processing Fee:</span>
          <span className="summary-value">$0.00</span>
        </div>
        <div className="summary-row total">
          <span>You'll Receive:</span>
          <span className="summary-value">${amount || "0.00"}</span>
        </div>
      </div>

      <button className="submit-btn" onClick={handleWithdraw}>
        Withdraw Now
      </button>
    </div>
  );
};

export default Withdraw;
