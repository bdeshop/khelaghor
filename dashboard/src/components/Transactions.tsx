import { useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import "./Transactions.css";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h2 className="transactions-title">Transactions</h2>
        <p className="transactions-subtitle">
          Manage your deposits and withdrawals
        </p>
      </div>

      <div className="transactions-tabs">
        <button
          className={`tab-button ${activeTab === "deposit" ? "active" : ""}`}
          onClick={() => setActiveTab("deposit")}
        >
          Deposit
        </button>
        <button
          className={`tab-button ${activeTab === "withdraw" ? "active" : ""}`}
          onClick={() => setActiveTab("withdraw")}
        >
          Withdraw
        </button>
      </div>

      <div className="transactions-content">
        {activeTab === "deposit" ? <Deposit /> : <Withdraw />}
      </div>
    </div>
  );
};

export default Transactions;
