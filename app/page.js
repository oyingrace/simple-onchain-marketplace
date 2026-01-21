import ItemsCard from './components/ItemsCard';
import SellerDashboard from './components/SellerDashboard';
import ItemManagement from './components/ItemManagement';
import WalletStatusBar from './components/WalletStatusBar';
import ActiveItemsList from './components/ActiveItemsList';
import PurchaseHistory from './components/PurchaseHistory';

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Wallet Status Bar - Shows connection status, network, balance */}
      <WalletStatusBar />
      
      {/* Active Items List - Fetches items from blockchain */}
      <ActiveItemsList />
      
      {/* Original Items Card (with hardcoded items) */}
      <ItemsCard />
      
      {/* Purchase History - Shows buyer's purchase history */}
      <PurchaseHistory />
      
      {/* Seller Dashboard - Seller stats and management */}
      <SellerDashboard />
      
      {/* Item Management - CRUD for sellers */}
      <ItemManagement />
    </div>
  );
}