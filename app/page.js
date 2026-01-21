import ItemsCard from './components/ItemsCard';
import SellerDashboard from './components/SellerDashboard';

export default function Home() {
  return (
    <div className="space-y-10">
      <ItemsCard />
      <SellerDashboard />
    </div>
  );
}