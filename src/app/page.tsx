import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-16 pb-32 flex flex-col items-center">
          {/* Hero section */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl mb-8">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Asset Tracker
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Track your assets securely on the Ethereum blockchain. Experience real-time tracking, transparent ownership, and seamless asset management.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150 ease-in-out shadow-sm"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center px-8 py-3 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150 ease-in-out"
              >
                Create Asset
              </Link>
            </div>

            {/* Features Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Tracking</h3>
                <p className="text-gray-600">Track your assets with blockchain-level security and transparency</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Get instant updates on asset status and location changes</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Transfers</h3>
                <p className="text-gray-600">Transfer asset ownership seamlessly between authorized users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
