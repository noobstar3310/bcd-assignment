import { useContractRead, useContractWrite } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

export function useContract() {
    const { data: allAssets, isLoading: isLoadingAssets } = useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getAllAssetDetails',
    });

    const { writeAsync: createAsset } = useContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createAssetTracking',
    });

    const { writeAsync: updateStatus } = useContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'updateAssetStatus',
    });

    const { writeAsync: transferOwnership } = useContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'transferAssetTrackingOwnership',
    });

    return {
        allAssets,
        isLoadingAssets,
        createAsset,
        updateStatus,
        transferOwnership,
    };
} 