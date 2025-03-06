import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Asset Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/create" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Create Asset
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 