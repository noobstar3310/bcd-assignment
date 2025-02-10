// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./SupplyChainAccess.sol";

contract TrackingNFT is ERC721, ERC721URIStorage {
    uint256 private _currentTokenId;
    SupplyChainAccess private accessControl;

    enum OrderStatus {
        Created,
        InTransit,
        Delayed,
        Delivered
    }

    struct TrackingDetails {
        uint256 tokenId;
        address creator;
        OrderStatus status;
        uint256 creationTime;
        string metadata;
        TrackingUpdate[] updates;
    }

    struct TrackingUpdate {
        OrderStatus status;
        uint256 timestamp;
        string notes;
    }

    mapping(uint256 => TrackingDetails) public trackingDetails;

    event TrackingCreated(uint256 indexed tokenId, address indexed creator);
    event StatusUpdated(
        uint256 indexed tokenId,
        OrderStatus status,
        string notes
    );

    constructor(address accessControlAddress) ERC721("Tracking NFT", "TRACK") {
        accessControl = SupplyChainAccess(accessControlAddress);
    }

    modifier onlyRegisteredUser() {
        require(
            accessControl.isRegisteredUser(msg.sender),
            "Caller is not a registered user"
        );
        _;
    }

    function createTracking(
        string memory metadata
    ) external onlyRegisteredUser returns (uint256) {
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadata);

        trackingDetails[newTokenId] = TrackingDetails({
            tokenId: newTokenId,
            creator: msg.sender,
            status: OrderStatus.Created,
            creationTime: block.timestamp,
            metadata: metadata,
            updates: new TrackingUpdate[](0)
        });

        emit TrackingCreated(newTokenId, msg.sender);
        return newTokenId;
    }

    function updateStatus(
        uint256 tokenId,
        OrderStatus newStatus,
        string memory notes
    ) external onlyRegisteredUser {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender ||
                accessControl.hasRole(accessControl.ADMIN_ROLE(), msg.sender),
            "Not authorized"
        );

        TrackingDetails storage tracking = trackingDetails[tokenId];
        tracking.status = newStatus;

        tracking.updates.push(
            TrackingUpdate({
                status: newStatus,
                timestamp: block.timestamp,
                notes: notes
            })
        );

        emit StatusUpdated(tokenId, newStatus, notes);
    }

    function getTrackingHistory(
        uint256 tokenId
    ) external view returns (TrackingUpdate[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return trackingDetails[tokenId].updates;
    }

    // Override required functions
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
