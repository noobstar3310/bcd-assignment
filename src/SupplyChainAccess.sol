// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AccessControl} from "./AccessControl.sol";

contract SupplyChainAccess is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    struct UserProfile {
        string name;
        bool isActive;
        uint256 registrationDate;
        string[] permissions;
    }

    mapping(address => UserProfile) public users;

    event UserRegistered(address indexed user, string name);
    event UserUpdated(address indexed user, string name);
    event UserDeactivated(address indexed user);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyRegisteredUser() {
        require(
            hasRole(USER_ROLE, msg.sender) && users[msg.sender].isActive,
            "Caller is not a registered user"
        );
        _;
    }

    function registerUser(
        address user,
        string memory name,
        string[] memory permissions
    ) external onlyAdmin {
        require(!hasRole(USER_ROLE, user), "User already registered");

        _grantRole(USER_ROLE, user);
        users[user] = UserProfile({
            name: name,
            isActive: true,
            registrationDate: block.timestamp,
            permissions: permissions
        });

        emit UserRegistered(user, name);
    }

    function updateUserProfile(
        address user,
        string memory name,
        string[] memory permissions
    ) external onlyAdmin {
        require(hasRole(USER_ROLE, user), "User not registered");

        UserProfile storage profile = users[user];
        profile.name = name;
        profile.permissions = permissions;

        emit UserUpdated(user, name);
    }

    function deactivateUser(address user) external onlyAdmin {
        require(hasRole(USER_ROLE, user), "User not registered");
        users[user].isActive = false;
        emit UserDeactivated(user);
    }

    function isRegisteredUser(address user) public view returns (bool) {
        return hasRole(USER_ROLE, user) && users[user].isActive;
    }
}
