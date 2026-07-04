// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
 
/// @title SimplePaymentContract
/// @notice Basic payment agreement: payer deposits funds, payer marks complete, payee withdraws. Supports refunds & cancellation.
/// @dev Uses a simple nonReentrant guard and checks for basic states.
contract SimplePaymentContract {
    // Parties
    address public payer;           // who pays (deployer by default)
    address payable public payee;   // who receives payment
 
    // Terms
    uint256 public totalAmount;     // agreed total (in wei)
    uint256 public dueDate;         // unix timestamp for completion/due date (optional)
    uint256 public deposited;       // total wei deposited to contract
 
    // States
    bool public isCompleted;        // payer marks work as completed
    bool public isCancelled;        // payer cancels contract
    bool public fundsWithdrawn;     // whether payee already withdrew
 
    // Simple reentrancy guard
    uint256 private _locked = 1;
 
    // Events
    event Funded(address indexed from, uint256 amount, uint256 deposited);
    event MarkedCompleted(address indexed by);
    event Withdrawn(address indexed payee, uint256 amount);
    event Refunded(address indexed payer, uint256 amount);
    event Cancelled(address indexed by);
 
    // Modifiers
    modifier onlyPayer() {
        require(msg.sender == payer, "Only payer");
        _;
    }
    modifier onlyPayee() {
        require(msg.sender == payee, "Only payee");
        _;
    }
    modifier notCancelled() {
        require(!isCancelled, "Contract cancelled");
        _;
    }
    modifier nonReentrant() {
        require(_locked == 1, "Reentrant");
        _locked = 2;
        _;
        _locked = 1;
    }
 
    /// @notice Create the payment contract
    /// @param _payee address that will receive payment
    /// @param _totalAmount total agreed amount in wei (0 allowed, but typically > 0)
    /// @param _dueDate unix timestamp for due date (0 if not used)
    constructor(address payable _payee, uint256 _totalAmount, uint256 _dueDate) {
        require(_payee != address(0), "Payee zero");
        payer = msg.sender;
        payee = _payee;
        totalAmount = _totalAmount;
        dueDate = _dueDate;
        deposited = 0;
        isCompleted = false;
        isCancelled = false;
        fundsWithdrawn = false;
    }
 
    /// @notice Fund the contract. Can be called multiple times (installments).
    /// @dev Accepts ETH (or native chain coin).
    function fund() external payable notCancelled {
        require(msg.value > 0, "Must send > 0");
        deposited += msg.value;
        emit Funded(msg.sender, msg.value, deposited);
    }
 
    /// @notice Payer may mark the work as completed, enabling payee to withdraw.
    function markCompleted() external onlyPayer notCancelled {
        require(!isCompleted, "Already completed");
        isCompleted = true;
        emit MarkedCompleted(msg.sender);
    }
 
    /// @notice Payee withdraws funds if contract is completed (or if full amount is deposited and payer allows).
    /// @dev Uses nonReentrant transfer pattern.
    function withdraw() external onlyPayee nonReentrant {
        require(!isCancelled, "Cancelled");
        require(!fundsWithdrawn, "Already withdrawn");
 
        // Allow withdrawal only if payer marked completion OR full amount deposited and payer trusts immediate release
        require(isCompleted || deposited >= totalAmount, "Not completed and not fully funded");
 
        uint256 amount = deposited;
        require(amount > 0, "No funds");
 
        // Zero out deposited first
        deposited = 0;
        fundsWithdrawn = true;
 
        // Transfer
        (bool sent, ) = payee.call{value: amount}("");
        require(sent, "Transfer failed");
 
        emit Withdrawn(payee, amount);
    }
 
    /// @notice Payer can request a refund of deposited funds if not yet completed and not cancelled.
    /// @dev Refunds all deposited funds back to payer.
    function refund() external onlyPayer nonReentrant {
        require(!isCancelled, "Cancelled");
        require(!isCompleted, "Already completed; cannot refund");
        uint256 amount = deposited;
        require(amount > 0, "No funds to refund");
 
        deposited = 0;
        // send back to payer
        (bool sent, ) = payable(payer).call{value: amount}("");
        require(sent, "Refund transfer failed");
 
        emit Refunded(payer, amount);
    }
 
    /// @notice Payer cancels the agreement. Deposited funds can be refunded (caller should call refund()).
    function cancel() external onlyPayer {
        require(!isCancelled, "Already cancelled");
        require(!isCompleted, "Already completed; cannot cancel");
        isCancelled = true;
        emit Cancelled(msg.sender);
    }
 
    /// @notice Helper: get current contract balance (should equal deposited)
    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
 
    // --- Admin helpers (non-essential) ---
 
    /// @notice Payer can change the payee before completion or cancellation.
    function changePayee(address payable _newPayee) external onlyPayer notCancelled {
        require(!isCompleted, "Already completed");
        require(_newPayee != address(0), "Zero address");
        payee = _newPayee;
    }
 
    /// @notice Payer can update total amount before completion.
    function updateTotalAmount(uint256 _newTotal) external onlyPayer notCancelled {
        require(!isCompleted, "Already completed");
        totalAmount = _newTotal;
    }
 
    // Fallbacks to accept ETH
    receive() external payable {
        deposited += msg.value;
        emit Funded(msg.sender, msg.value, deposited);
    }
    fallback() external payable {
        deposited += msg.value;
        emit Funded(msg.sender, msg.value, deposited);
    }
}