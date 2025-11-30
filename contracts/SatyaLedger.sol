// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title SatyaLedger
 * @dev Decentralized Digital Receipt System for Government Transactions
 * 
 * Implements multi-ministry consensus mechanism for transparent subsidy disbursement
 * Requires ALL 3 eligible ministries to approve (creator excluded from voting)
 * Ministry Roles:
 * - Finance Ministry (0xdeF7c520781D097D23f20563111C266630e8Fe7f)
 * - Welfare Ministry (0xb2eA23Ad706B701a359aDc5DAC5A7E7a8FEe96b0)
 * - Education Ministry (0x76F52BE2B49cc3466897865fa488dCa8B5cBa33b)
 * - Auditor General (0xE7C431244397bc4DB389806d4931e16B978fC23F)
 */
contract SatyaLedger {
    
    // ============ State Variables ============
    
    uint8 public constant MIN_QUORUM = 3;  // Minimum approvals required (ALL eligible voters)
    uint8 public constant TOTAL_MINISTRIES = 4;
    uint8 public constant ELIGIBLE_VOTERS = 3;  // Excluding creator
    
    address public financeMinistry;
    address public welfareMinistry;
    address public educationMinistry;
    address public auditorGeneral;
    
    // Transaction structure
    struct Transaction {
        string schemeName;
        string beneficiaryId;
        string receiptHash;       // SHA-256 hash of off-chain receipt
        uint amount;
        uint8 approvals;
        bool finalized;
        string status;            // "Pending" or "Approved"
        address createdBy;
        uint timestamp;
    }
    
    // Mappings
    mapping(bytes32 => Transaction) public transactions;
    mapping(bytes32 => mapping(address => bool)) public votes;
    mapping(bytes32 => uint8) public voteCount;
    
    bytes32[] public transactionIds;
    
    // ============ Events ============
    
    event TransactionCreated(
        bytes32 indexed txId, 
        string schemeName, 
        address indexed createdBy,
        uint timestamp
    );
    
    event TransactionApproved(
        bytes32 indexed txId, 
        address indexed approver,
        uint8 currentApprovals
    );
    
    event TransactionFinalized(
        bytes32 indexed txId, 
        string status,
        uint timestamp
    );
    
    // ============ Modifiers ============
    
    modifier onlyMinistry() {
        require(
            msg.sender == financeMinistry || 
            msg.sender == welfareMinistry || 
            msg.sender == educationMinistry || 
            msg.sender == auditorGeneral,
            "Only authorized ministries can call this function"
        );
        _;
    }
    
    modifier transactionExists(bytes32 txId) {
        require(
            bytes(transactions[txId].schemeName).length > 0,
            "Transaction does not exist"
        );
        _;
    }
    
    modifier notFinalized(bytes32 txId) {
        require(
            !transactions[txId].finalized,
            "Transaction already finalized"
        );
        _;
    }
    
    modifier notVoted(bytes32 txId) {
        require(
            !votes[txId][msg.sender],
            "Ministry already voted for this transaction"
        );
        _;
    }
    
    modifier notCreator(bytes32 txId) {
        require(
            transactions[txId].createdBy != msg.sender,
            "Transaction creator cannot approve their own transaction"
        );
        _;
    }
    
    // ============ Constructor ============
    
    constructor(
        address _financeMinistry,
        address _welfareMinistry,
        address _educationMinistry,
        address _auditorGeneral
    ) {
        require(_financeMinistry != address(0), "Invalid finance address");
        require(_welfareMinistry != address(0), "Invalid welfare address");
        require(_educationMinistry != address(0), "Invalid education address");
        require(_auditorGeneral != address(0), "Invalid auditor address");
        
        financeMinistry = _financeMinistry;
        welfareMinistry = _welfareMinistry;
        educationMinistry = _educationMinistry;
        auditorGeneral = _auditorGeneral;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev Create a new transaction
     * @param _beneficiaryId Unique identifier for the beneficiary
     * @param _schemeName Name of the government scheme
     * @param _amount Amount to be disbursed
     * @param _receiptHash Hash of the off-chain receipt document
     * Note: Creator is automatically excluded from voting on this transaction
     */
    function createTransaction(
        string memory _beneficiaryId,
        string memory _schemeName,
        uint _amount,
        string memory _receiptHash
    ) public onlyMinistry returns (bytes32) {
        // Generate unique transaction ID
        bytes32 txId = keccak256(
            abi.encodePacked(
                _beneficiaryId,
                _schemeName,
                _amount,
                block.timestamp,
                msg.sender
            )
        );
        
        require(
            bytes(transactions[txId].schemeName).length == 0,
            "Transaction already exists"
        );
        
        // Create transaction
        transactions[txId] = Transaction({
            schemeName: _schemeName,
            beneficiaryId: _beneficiaryId,
            receiptHash: _receiptHash,
            amount: _amount,
            approvals: 0,
            finalized: false,
            status: "Pending",
            createdBy: msg.sender,
            timestamp: block.timestamp
        });
        
        transactionIds.push(txId);
        
        emit TransactionCreated(txId, _schemeName, msg.sender, block.timestamp);
        
        return txId;
    }
    
    /**
     * @dev Approve a transaction (ministry voting)
     * @param txId Transaction ID to approve
     * Requires ALL 3 eligible ministries to approve (excluding creator)
     */
    function approveTransaction(bytes32 txId) 
        public 
        onlyMinistry 
        transactionExists(txId)
        notFinalized(txId)
        notVoted(txId)
        notCreator(txId)
    {
        // Record vote
        votes[txId][msg.sender] = true;
        voteCount[txId]++;
        transactions[txId].approvals++;
        
        emit TransactionApproved(txId, msg.sender, transactions[txId].approvals);
        
        // Check if quorum reached
        if (transactions[txId].approvals >= MIN_QUORUM) {
            transactions[txId].finalized = true;
            transactions[txId].status = "Approved";
            
            emit TransactionFinalized(txId, "Approved", block.timestamp);
        }
    }
    
    /**
     * @dev Get transaction details
     * @param txId Transaction ID
     */
    function getTransaction(bytes32 txId) 
        public 
        view 
        transactionExists(txId)
        returns (
            string memory schemeName,
            string memory beneficiaryId,
            string memory receiptHash,
            uint amount,
            uint8 approvals,
            bool finalized,
            string memory status,
            address createdBy,
            uint timestamp
        )
    {
        Transaction memory txn = transactions[txId];
        return (
            txn.schemeName,
            txn.beneficiaryId,
            txn.receiptHash,
            txn.amount,
            txn.approvals,
            txn.finalized,
            txn.status,
            txn.createdBy,
            txn.timestamp
        );
    }
    
    /**
     * @dev Get total number of transactions
     */
    function getTransactionCount() public view returns (uint) {
        return transactionIds.length;
    }
    
    /**
     * @dev Get transaction ID by index
     */
    function getTransactionIdByIndex(uint index) public view returns (bytes32) {
        require(index < transactionIds.length, "Index out of bounds");
        return transactionIds[index];
    }
    
    /**
     * @dev Check if an address has voted for a transaction
     */
    function hasVoted(bytes32 txId, address ministry) 
        public 
        view 
        returns (bool) 
    {
        return votes[txId][ministry];
    }
    
    /**
     * @dev Check if an address is an authorized ministry
     */
    function isMinistry(address _address) public view returns (bool) {
        return (
            _address == financeMinistry || 
            _address == welfareMinistry || 
            _address == educationMinistry || 
            _address == auditorGeneral
        );
    }
    
    /**
     * @dev Get all ministry addresses
     */
    function getMinistries() 
        public 
        view 
        returns (
            address finance,
            address welfare,
            address education,
            address auditor
        )
    {
        return (financeMinistry, welfareMinistry, educationMinistry, auditorGeneral);
    }
}
