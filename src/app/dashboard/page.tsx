'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useContract } from '@/hooks/useContract';

export default function Dashboard() {
    const { isConnected } = useAccount();
    const router = useRouter();
    const { allAssets, isLoadingAssets } = useContract();

    useEffect(() => {
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    if (!isConnected) {
        return null;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900">Assets Dashboard</h1>
                    {isLoadingAssets ? (
                        <div className="mt-4 text-center">Loading assets...</div>
                    ) : (
                        <div className="mt-4 flex flex-col">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Asset Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Location
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Distance
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {allAssets && allAssets[2].map((name: string, index: number) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {allAssets[3][index]}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {allAssets[4][index]}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {allAssets[5][index]}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {allAssets[6][index].toString()} km
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 