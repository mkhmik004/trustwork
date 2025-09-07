// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Escrow
 * @dev A smart contract for managing escrow transactions between clients and freelancers
 */
contract Escrow {
    struct EscrowContract {
        address client;
        address freelancer;
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 milestoneCount;
        mapping(uint256 => Milestone) milestones;
        bool isActive;
        bool isCompleted;
        uint256 createdAt;
    }

    struct Milestone {
        uint256 amount;
        string description;
        bool isReleased;
        bool isDisputed;
        uint256 createdAt;
    }

    mapping(uint256 => EscrowContract) public contracts;
    uint256 public contractCount;
    
    // Events
    event ContractCreated(
        uint256 indexed contractId,
        address indexed client,
        address indexed freelancer,
        uint256 totalAmount,
        uint256 milestoneCount
    );
    
    event ContractFunded(
        uint256 indexed contractId,
        uint256 amount
    );
    
    event MilestoneReleased(
        uint256 indexed contractId,
        uint256 indexed milestoneId,
        uint256 amount,
        address indexed freelancer
    );
    
    event ContractRefunded(
        uint256 indexed contractId,
        uint256 amount,
        address indexed client
    );
    
    event DisputeRaised(
        uint256 indexed contractId,
        uint256 indexed milestoneId,
        address indexed initiator
    );

    modifier onlyClient(uint256 _contractId) {
        require(contracts[_contractId].client == msg.sender, "Only client can call this function");
        _;
    }

    modifier onlyFreelancer(uint256 _contractId) {
        require(contracts[_contractId].freelancer == msg.sender, "Only freelancer can call this function");
        _;
    }

    modifier onlyParties(uint256 _contractId) {
        require(
            contracts[_contractId].client == msg.sender || 
            contracts[_contractId].freelancer == msg.sender,
            "Only contract parties can call this function"
        );
        _;
    }

    modifier contractExists(uint256 _contractId) {
        require(_contractId < contractCount, "Contract does not exist");
        _;
    }

    modifier contractActive(uint256 _contractId) {
        require(contracts[_contractId].isActive, "Contract is not active");
        require(!contracts[_contractId].isCompleted, "Contract is already completed");
        _;
    }

    /**
     * @dev Create a new escrow contract
     * @param _freelancer Address of the freelancer
     * @param _milestoneAmounts Array of milestone amounts
     * @param _milestoneDescriptions Array of milestone descriptions
     * @return contractId The ID of the created contract
     */
    function createContract(
        address _freelancer,
        uint256[] memory _milestoneAmounts,
        string[] memory _milestoneDescriptions
    ) external payable returns (uint256 contractId) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_freelancer != msg.sender, "Client and freelancer cannot be the same");
        require(_milestoneAmounts.length > 0, "At least one milestone required");
        require(_milestoneAmounts.length == _milestoneDescriptions.length, "Mismatched arrays length");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Milestone amount must be greater than 0");
            totalAmount += _milestoneAmounts[i];
        }
        
        require(msg.value == totalAmount, "Sent value must equal total milestone amounts");
        
        contractId = contractCount++;
        
        EscrowContract storage newContract = contracts[contractId];
        newContract.client = msg.sender;
        newContract.freelancer = _freelancer;
        newContract.totalAmount = totalAmount;
        newContract.releasedAmount = 0;
        newContract.milestoneCount = _milestoneAmounts.length;
        newContract.isActive = true;
        newContract.isCompleted = false;
        newContract.createdAt = block.timestamp;
        
        // Create milestones
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            newContract.milestones[i] = Milestone({
                amount: _milestoneAmounts[i],
                description: _milestoneDescriptions[i],
                isReleased: false,
                isDisputed: false,
                createdAt: block.timestamp
            });
        }
        
        emit ContractCreated(contractId, msg.sender, _freelancer, totalAmount, _milestoneAmounts.length);
        emit ContractFunded(contractId, totalAmount);
        
        return contractId;
    }

    /**
     * @dev Release a specific milestone to the freelancer
     * @param _contractId The contract ID
     * @param _milestoneId The milestone ID to release
     */
    function releaseMilestone(uint256 _contractId, uint256 _milestoneId) 
        external 
        contractExists(_contractId)
        contractActive(_contractId)
        onlyClient(_contractId)
    {
        EscrowContract storage escrowContract = contracts[_contractId];
        require(_milestoneId < escrowContract.milestoneCount, "Invalid milestone ID");
        
        Milestone storage milestone = escrowContract.milestones[_milestoneId];
        require(!milestone.isReleased, "Milestone already released");
        require(!milestone.isDisputed, "Milestone is disputed");
        
        milestone.isReleased = true;
        escrowContract.releasedAmount += milestone.amount;
        
        // Check if all milestones are released
        if (escrowContract.releasedAmount == escrowContract.totalAmount) {
            escrowContract.isCompleted = true;
            escrowContract.isActive = false;
        }
        
        // Transfer funds to freelancer
        payable(escrowContract.freelancer).transfer(milestone.amount);
        
        emit MilestoneReleased(_contractId, _milestoneId, milestone.amount, escrowContract.freelancer);
    }

    /**
     * @dev Refund the remaining funds to the client (emergency function)
     * @param _contractId The contract ID
     */
    function refund(uint256 _contractId) 
        external 
        contractExists(_contractId)
        contractActive(_contractId)
        onlyClient(_contractId)
    {
        EscrowContract storage escrowContract = contracts[_contractId];
        uint256 refundAmount = escrowContract.totalAmount - escrowContract.releasedAmount;
        
        require(refundAmount > 0, "No funds to refund");
        
        escrowContract.isActive = false;
        escrowContract.isCompleted = true;
        
        // Transfer remaining funds back to client
        payable(escrowContract.client).transfer(refundAmount);
        
        emit ContractRefunded(_contractId, refundAmount, escrowContract.client);
    }

    /**
     * @dev Raise a dispute for a milestone
     * @param _contractId The contract ID
     * @param _milestoneId The milestone ID to dispute
     */
    function raiseDispute(uint256 _contractId, uint256 _milestoneId)
        external
        contractExists(_contractId)
        contractActive(_contractId)
        onlyParties(_contractId)
    {
        EscrowContract storage escrowContract = contracts[_contractId];
        require(_milestoneId < escrowContract.milestoneCount, "Invalid milestone ID");
        
        Milestone storage milestone = escrowContract.milestones[_milestoneId];
        require(!milestone.isReleased, "Cannot dispute released milestone");
        require(!milestone.isDisputed, "Milestone already disputed");
        
        milestone.isDisputed = true;
        
        emit DisputeRaised(_contractId, _milestoneId, msg.sender);
    }

    /**
     * @dev Get contract details
     * @param _contractId The contract ID
     * @return client Client address
     * @return freelancer Freelancer address
     * @return totalAmount Total contract amount
     * @return releasedAmount Amount already released
     * @return milestoneCount Number of milestones
     * @return isActive Whether contract is active
     * @return isCompleted Whether contract is completed
     * @return createdAt Contract creation timestamp
     */
    function getContract(uint256 _contractId) 
        external 
        view 
        contractExists(_contractId)
        returns (
            address client,
            address freelancer,
            uint256 totalAmount,
            uint256 releasedAmount,
            uint256 milestoneCount,
            bool isActive,
            bool isCompleted,
            uint256 createdAt
        )
    {
        EscrowContract storage escrowContract = contracts[_contractId];
        return (
            escrowContract.client,
            escrowContract.freelancer,
            escrowContract.totalAmount,
            escrowContract.releasedAmount,
            escrowContract.milestoneCount,
            escrowContract.isActive,
            escrowContract.isCompleted,
            escrowContract.createdAt
        );
    }

    /**
     * @dev Get milestone details
     * @param _contractId The contract ID
     * @param _milestoneId The milestone ID
     * @return amount Milestone amount
     * @return description Milestone description
     * @return isReleased Whether milestone is released
     * @return isDisputed Whether milestone is disputed
     * @return createdAt Milestone creation timestamp
     */
    function getMilestone(uint256 _contractId, uint256 _milestoneId)
        external
        view
        contractExists(_contractId)
        returns (
            uint256 amount,
            string memory description,
            bool isReleased,
            bool isDisputed,
            uint256 createdAt
        )
    {
        require(_milestoneId < contracts[_contractId].milestoneCount, "Invalid milestone ID");
        
        Milestone storage milestone = contracts[_contractId].milestones[_milestoneId];
        return (
            milestone.amount,
            milestone.description,
            milestone.isReleased,
            milestone.isDisputed,
            milestone.createdAt
        );
    }

    /**
     * @dev Get contract balance
     * @param _contractId The contract ID
     * @return balance Remaining balance in the contract
     */
    function getContractBalance(uint256 _contractId)
        external
        view
        contractExists(_contractId)
        returns (uint256 balance)
    {
        EscrowContract storage escrowContract = contracts[_contractId];
        return escrowContract.totalAmount - escrowContract.releasedAmount;
    }
}