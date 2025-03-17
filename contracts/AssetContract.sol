// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AssetTrackingContract {
    address private immutable OWNER;
    uint256 private s_assetId = 1;
    uint256 private s_userId = 1;

    struct Asset {
        address assetSender;
        address assetRecipient;
        string assetRecipientName;
        string assetName;
        string assetDescription;
        string assetType;
        string assetLocation;
        string assetStatus;
        string assetDistanceTravel;
        uint256 lastUpdatedTimeStamp;
    }

    struct User {
        address userWalletAddress;
        string userName;
        uint256 dateAddedTimeStamp;
    }

    mapping (uint256 => Asset) public assetId;
    mapping (uint256 => User) public userId;
    mapping (address => bool) public authorizedUser;


    modifier onlyOwner() {
        require(msg.sender == OWNER, "must be admin");
        _;
    }

    modifier isAuthorizedUser() {
        require(authorizedUser[msg.sender] == true, "not authorized");
        _;
    }

    constructor(string memory _userName) {
        OWNER = msg.sender;
        authorizedUser[OWNER] = true;
        userId[s_userId] = User(msg.sender, _userName, block.timestamp);
        s_userId++;
    }

    function createAssetTracking(
        address _assetRecipient,
        string memory _assetRecipientName,
        string memory _assetName,
        string memory _assetDescription,
        string memory _assetType,
        string memory _assetLocation,
        string memory _assetStatus,
        string memory _assetDistanceTravel
    ) public isAuthorizedUser {
        
        Asset memory newAsset = Asset({
            assetSender: msg.sender,
            assetRecipient: _assetRecipient,
            assetRecipientName: _assetRecipientName,
            assetName: _assetName,
            assetDescription: _assetDescription,
            assetType: _assetType,
            assetLocation: _assetLocation,
            assetStatus: _assetStatus,
            assetDistanceTravel: _assetDistanceTravel,
            lastUpdatedTimeStamp: block.timestamp
        });
        assetId[s_assetId] = newAsset;
        s_assetId++;
    }

    function transferAssetTrackingOwnership(
        uint256 _assetId, 
        address _newRecipient,
        string memory _newRecipientName
    ) public isAuthorizedUser {
        require(_assetId <= s_assetId && _assetId > 0, "Asset does not exist");
        assetId[_assetId].assetRecipient = _newRecipient;
        assetId[_assetId].assetRecipientName = _newRecipientName;
        assetId[_assetId].lastUpdatedTimeStamp = block.timestamp;
    }

    function updateAssetStatus(uint256 _assetId, string memory _newStatus) public isAuthorizedUser {
        require(_assetId <= s_assetId && _assetId > 0, "Asset does not exist");
        assetId[_assetId].assetStatus = _newStatus;
    }

    function authorizeAndCreateNewUser(address _userAddress, string memory _userName) public onlyOwner {
        userId[s_userId] = User(_userAddress, _userName, block.timestamp);
        s_userId++;
        authorizedUser[_userAddress] = true;
    }

    function findUserId(address _userAddress) private view returns (uint256) {
        for (uint256 i = 1; i < s_userId; i++) {
            if (userId[i].userWalletAddress == _userAddress) {
                return i;
            }
        }
        return 0; // Return 0 if user not found
    }

    function revokeUserAuth(address user) public onlyOwner {
        require(user != OWNER, "Cannot revoke owner's authorization");
        require(authorizedUser[user], "User is not authorized");
        
        // Find user ID
        uint256 userIdToRemove = findUserId(user);
        require(userIdToRemove != 0, "User record not found");

        // Remove user from authorization
        authorizedUser[user] = false;

        // Remove user record by setting it to empty values
        delete userId[userIdToRemove];
    }

    function getAssetSpecificDetails(uint256 _assetID) public view returns (
        address,
        address,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        uint256
    ) {
        require(_assetID <= s_assetId && _assetID > 0, "Asset does not exist");
        Asset memory asset = assetId[_assetID];
        uint256 assetid = _assetID;
        return (
            asset.assetSender,
            asset.assetRecipient,
            asset.assetRecipientName,
            asset.assetName,
            asset.assetDescription,
            asset.assetType,
            asset.assetLocation,
            asset.assetStatus,
            asset.assetDistanceTravel,
            asset.lastUpdatedTimeStamp,
            assetid
        );
    }

    function getAllAssetDetails() public view returns (
        uint256[] memory ids,
        address[] memory senders,
        address[] memory recipients,
        string[] memory names,
        string[] memory types,
        string[] memory locations,
        string[] memory statuses,
        string[] memory distances
    ) {
        uint256 totalAssets = s_assetId - 1;
        ids = new uint256[](totalAssets);
        senders = new address[](totalAssets);
        recipients = new address[](totalAssets);
        names = new string[](totalAssets);
        types = new string[](totalAssets);
        locations = new string[](totalAssets);
        statuses = new string[](totalAssets);
        distances = new string[](totalAssets);

        for (uint256 i = 1; i <= totalAssets; i++) {
            Asset memory asset = assetId[i];
            ids[i-1] = i;
            senders[i-1] = asset.assetSender;
            recipients[i-1] = asset.assetRecipient;
            names[i-1] = asset.assetName;
            types[i-1] = asset.assetType;
            locations[i-1] = asset.assetLocation;
            statuses[i-1] = asset.assetStatus;
            distances[i-1] = asset.assetDistanceTravel;
        }

        return (ids, senders, recipients, names, types, locations, statuses, distances);
    }

    function getAllUserDetails() public view returns (
        uint256[] memory userIds,
        address[] memory walletAddresses,
        string[] memory userNames,
        uint256[] memory timestamps
    ) {
        uint256 totalUsers = s_userId - 1;
        userIds = new uint256[](totalUsers);
        walletAddresses = new address[](totalUsers);
        userNames = new string[](totalUsers);
        timestamps = new uint256[](totalUsers);

        for (uint256 i = 1; i <= totalUsers; i++) {
            User memory user = userId[i];
            userIds[i-1] = i;
            walletAddresses[i-1] = user.userWalletAddress;
            userNames[i-1] = user.userName;
            timestamps[i-1] = user.dateAddedTimeStamp;
        }

        return (userIds, walletAddresses, userNames, timestamps);
    }
}