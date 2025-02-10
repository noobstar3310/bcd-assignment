// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SupplyChainTracker is Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _assetIds;
    Counters.Counter private _locationIds;
    Counters.Counter private _historyIds;

    struct Asset {
        uint256 id;
        string assetType;
        address currentOwner;
        uint256 currentLocationId;
        uint256[] historyIds;
    }

    struct AssetHistory {
        uint256 timestamp;
        address owner;
        uint256 locationId;
    }

    struct Location {
        uint256 id;
        string name;
        string details;
    }

    // Mappings
    mapping(address => bool) public registeredUsers;
    mapping(uint256 => Asset) public assets;
    mapping(uint256 => AssetHistory) public assetHistory;
    mapping(uint256 => Location) public locations;

    // Events
    event UserRegistered(address user);
    event AssetRegistered(uint256 indexed assetId, string assetType, address owner);
    event OwnershipTransferred(uint256 indexed assetId, address indexed previousOwner, address indexed newOwner);
    event LocationUpdated(uint256 indexed assetId, uint256 indexed locationId);
    event LocationAdded(uint256 indexed locationId, string name);

    // Modifiers
    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "User is not registered");
        _;
    }

    modifier assetExists(uint256 assetId) {
        require(assets[assetId].id == assetId, "Asset does not exist");
        _;
    }

    modifier locationExists(uint256 locationId) {
        require(locations[locationId].id == locationId, "Location does not exist");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
        registeredUsers[msg.sender] = true; // Register contract deployer as first user
    }

    // User Management Functions
    function registerUser(address user) external onlyOwner {
        require(!registeredUsers[user], "User already registered");
        registeredUsers[user] = true;
        emit UserRegistered(user);
    }

    // Asset Management Functions
    function registerAsset(string memory assetType, uint256 locationId) 
        external 
        onlyRegisteredUser 
        locationExists(locationId) 
        returns (uint256)
    {
        _assetIds.increment();
        uint256 newAssetId = _assetIds.current();

        uint256[] memory initialHistory;
        assets[newAssetId] = Asset({
            id: newAssetId,
            assetType: assetType,
            currentOwner: msg.sender,
            currentLocationId: locationId,
            historyIds: initialHistory
        });

        // Create first history entry
        _recordHistory(newAssetId, msg.sender, locationId);

        emit AssetRegistered(newAssetId, assetType, msg.sender);
        return newAssetId;
    }

    // Location Management Functions
    function addLocation(string memory name, string memory details) 
        external 
        onlyRegisteredUser 
        returns (uint256)
    {
        _locationIds.increment();
        uint256 newLocationId = _locationIds.current();

        locations[newLocationId] = Location({
            id: newLocationId,
            name: name,
            details: details
        });

        emit LocationAdded(newLocationId, name);
        return newLocationId;
    }

    // Ownership Management Functions
    function transferOwnership(uint256 assetId, address newOwner) 
        external 
        onlyRegisteredUser 
        assetExists(assetId)
    {
        require(registeredUsers[newOwner], "New owner is not registered");
        require(assets[assetId].currentOwner == msg.sender, "Not the current owner");
        
        address previousOwner = assets[assetId].currentOwner;
        assets[assetId].currentOwner = newOwner;
        
        _recordHistory(assetId, newOwner, assets[assetId].currentLocationId);
        
        emit OwnershipTransferred(assetId, previousOwner, newOwner);
    }

    // Location Tracking Functions
    function updateLocation(uint256 assetId, uint256 newLocationId) 
        external 
        onlyRegisteredUser 
        assetExists(assetId)
        locationExists(newLocationId)
    {
        require(assets[assetId].currentOwner == msg.sender, "Not the current owner");
        
        assets[assetId].currentLocationId = newLocationId;
        _recordHistory(assetId, msg.sender, newLocationId);
        
        emit LocationUpdated(assetId, newLocationId);
    }

    // History Recording (Internal)
    function _recordHistory(uint256 assetId, address owner, uint256 locationId) internal {
        _historyIds.increment();
        uint256 historyId = _historyIds.current();

        assetHistory[historyId] = AssetHistory({
            timestamp: block.timestamp,
            owner: owner,
            locationId: locationId
        });

        assets[assetId].historyIds.push(historyId);
    }

    // View Functions
    function getAssetHistory(uint256 assetId) 
        external 
        view 
        assetExists(assetId) 
        returns (AssetHistory[] memory)
    {
        uint256[] memory historyIds = assets[assetId].historyIds;
        AssetHistory[] memory history = new AssetHistory[](historyIds.length);
        
        for (uint256 i = 0; i < historyIds.length; i++) {
            history[i] = assetHistory[historyIds[i]];
        }
        
        return history;
    }
}