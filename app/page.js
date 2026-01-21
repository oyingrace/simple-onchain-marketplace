import ItemsCard from './components/ItemsCard';
import SellerDashboard from './components/SellerDashboard';
import ItemManagement from './components/ItemManagement';

export default function Home() {
  return (
    <div className="space-y-10">
      <ItemsCard />
      <SellerDashboard />
      <ItemManagement />
    </div>
  );
}