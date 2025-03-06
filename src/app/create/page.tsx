'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useContract } from '@/hooks/useContract';

export default function CreateAsset() {
    const { isConnected } = useAccount();
    const router = useRouter();
    const { createAsset } = useContract();

    const [formData, setFormData] = useState({
        recipient: '',
        name: '',
        type: '',
        location: '',
        status: '0',
        distance: '0'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createAsset({
                args: [
                    formData.recipient,
                    formData.name,
                    formData.type,
                    formData.location,
                    BigInt(formData.status),
                    BigInt(formData.distance)
                ]
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating asset:', error);
            alert('Failed to create asset. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isConnected) {
        router.push('/');
        return null;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Asset</h1>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                                    Recipient Address
                                </label>
                                <input
                                    type="text"
                                    id="recipient"
                                    value={formData.recipient}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Asset Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Asset Type
                                </label>
                                <input
                                    type="text"
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="0">Pending</option>
                                    <option value="1">Delivering</option>
                                    <option value="2">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                                    Distance (km)
                                </label>
                                <input
                                    type="number"
                                    id="distance"
                                    value={formData.distance}
                                    onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Asset'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 