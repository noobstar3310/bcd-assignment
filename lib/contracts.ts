import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x52fdfC63e202c1A337444E49B76c436A8A6C05C5";

export interface Asset {
  id: string;
  sender: string;
  recipient: string;
  recipientName: string;
  name: string;
  description: string;
  type: string;
  location: string;
  status: string;
  distance: string;
  lastUpdatedTimeStamp: number;
}

export interface User {
  id: string;
  walletAddress: string;
  userName: string;
  dateAdded: number;
}

export const CONTRACT_ABI = [
  {"inputs":[{"internalType":"string","name":"_userName","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"assetId","outputs":[{"internalType":"address","name":"assetSender","type":"address"},{"internalType":"address","name":"assetRecipient","type":"address"},{"internalType":"string","name":"assetRecipientName","type":"string"},{"internalType":"string","name":"assetName","type":"string"},{"internalType":"string","name":"assetDescription","type":"string"},{"internalType":"string","name":"assetType","type":"string"},{"internalType":"string","name":"assetLocation","type":"string"},{"internalType":"string","name":"assetStatus","type":"string"},{"internalType":"string","name":"assetDistanceTravel","type":"string"},{"internalType":"uint256","name":"lastUpdatedTimeStamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"string","name":"_userName","type":"string"}],"name":"authorizeAndCreateNewUser","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"authorizedUser","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"_assetRecipient","type":"address"},{"internalType":"string","name":"_assetRecipientName","type":"string"},{"internalType":"string","name":"_assetName","type":"string"},{"internalType":"string","name":"_assetDescription","type":"string"},{"internalType":"string","name":"_assetType","type":"string"},{"internalType":"string","name":"_assetLocation","type":"string"},{"internalType":"string","name":"_assetStatus","type":"string"},{"internalType":"string","name":"_assetDistanceTravel","type":"string"}],"name":"createAssetTracking","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getAllAssetDetails","outputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address[]","name":"senders","type":"address[]"},{"internalType":"address[]","name":"recipients","type":"address[]"},{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"string[]","name":"types","type":"string[]"},{"internalType":"string[]","name":"locations","type":"string[]"},{"internalType":"string[]","name":"statuses","type":"string[]"},{"internalType":"string[]","name":"distances","type":"string[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAllUserDetails","outputs":[{"internalType":"uint256[]","name":"userIds","type":"uint256[]"},{"internalType":"address[]","name":"walletAddresses","type":"address[]"},{"internalType":"string[]","name":"userNames","type":"string[]"},{"internalType":"uint256[]","name":"timestamps","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_assetID","type":"uint256"}],"name":"getAssetSpecificDetails","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"revokeUserAuth","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"address","name":"_newRecipient","type":"address"},{"internalType":"string","name":"_newRecipientName","type":"string"}],"name":"transferAssetTrackingOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_assetId","type":"uint256"},{"internalType":"string","name":"_newStatus","type":"string"}],"name":"updateAssetStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"userId","outputs":[{"internalType":"address","name":"userWalletAddress","type":"address"},{"internalType":"string","name":"userName","type":"string"},{"internalType":"uint256","name":"dateAddedTimeStamp","type":"uint256"}],"stateMutability":"view","type":"function"}
];

export async function getContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  return contract;
}

export async function getAllAssets() {
  try {
    const contract = await getContract();
    const result = await contract.getAllAssetDetails();
    
    // Organize the data into an array of asset objects
    const assets: Asset[] = result.ids.map((id: ethers.BigNumber, index: number) => ({
      id: id.toString(),
      sender: result.senders[index],
      recipient: result.recipients[index],
      name: result.names[index],
      type: result.types[index],
      location: result.locations[index],
      status: result.statuses[index],
      distance: result.distances[index],
      // These fields will be populated when getting specific asset details
      recipientName: "",
      description: "",
      lastUpdatedTimeStamp: 0
    }));

    // Log the organized data
    console.group("Asset Details");
    assets.forEach((asset: Asset, index: number) => {
      console.group(`Asset ${index + 1}`);
      console.log("ID:", asset.id);
      console.log("Sender:", asset.sender);
      console.log("Recipient:", asset.recipient);
      console.log("Name:", asset.name);
      console.log("Type:", asset.type);
      console.log("Location:", asset.location);
      console.log("Status:", asset.status);
      console.log("Distance:", asset.distance);
      console.groupEnd();
    });
    console.groupEnd();

    return assets;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const contract = await getContract();
    const result = await contract.getAllUserDetails();
    
    // Organize the data into an array of user objects and filter out deleted users
    const users: User[] = result.userIds.map((id: ethers.BigNumber, index: number) => ({
      id: id.toString(),
      walletAddress: result.walletAddresses[index],
      userName: result.userNames[index],
      dateAdded: result.timestamps[index].toNumber()
    })).filter(user => 
      // Filter out users with empty addresses (deleted users)
      user.walletAddress !== "0x0000000000000000000000000000000000000000" &&
      user.userName !== "" // Also filter out empty names
    );

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function createAsset(data: {
  recipientAddress: string;
  recipientName: string;
  name: string;
  description: string;
  type: string;
  location: string;
  status: string;
  distance: string;
}) {
  try {
    const contract = await getContract();
    const tx = await contract.createAssetTracking(
      data.recipientAddress,
      data.recipientName,
      data.name,
      data.description,
      data.type,
      data.location,
      data.status,
      data.distance
    );
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
}

export async function authorizeUser(address: string, name: string) {
  try {
    const contract = await getContract();
    const tx = await contract.authorizeAndCreateNewUser(address, name);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error authorizing user:", error);
    throw error;
  }
}

export async function revokeUser(address: string) {
  try {
    // First check if user exists and is authorized
    const contract = await getContract();
    const isAuthorized = await contract.authorizedUser(address);
    if (!isAuthorized) {
      throw new Error("User is not authorized");
    }
    
    // Call the revokeUserAuth function
    const tx = await contract.revokeUserAuth(address);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error revoking user:", error);
    throw error;
  }
}

export async function getAssetById(id: string) {
  try {
    const contract = await getContract();
    const result = await contract.getAssetSpecificDetails(id);
    
    // Convert the array response into an Asset object
    const asset: Asset = {
      id: id,
      sender: result[0],
      recipient: result[1],
      recipientName: result[2],
      name: result[3],
      description: result[4],
      type: result[5],
      location: result[6],
      status: result[7],
      distance: result[8],
      lastUpdatedTimeStamp: result[9].toNumber()
    };

    return asset;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    throw error;
  }
}

export async function updateAssetStatus(assetId: string, newStatus: string) {
  try {
    const contract = await getContract();
    const tx = await contract.updateAssetStatus(assetId, newStatus);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error updating asset status:", error);
    throw error;
  }
}

export async function transferAssetOwnership(assetId: string, newRecipient: string, newRecipientName: string) {
  try {
    const contract = await getContract();
    const tx = await contract.transferAssetTrackingOwnership(assetId, newRecipient, newRecipientName);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error transferring asset ownership:", error);
    throw error;
  }
} 