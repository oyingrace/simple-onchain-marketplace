import { UniversalConnector } from '@reown/appkit-universal-connector'

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Configure Base Sepolia network
const baseSepolia = {
  id: 84532,
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:84532',
  name: 'Base Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: { 
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] }
  },
  blockExplorerUrls: { default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' } }
}

export const networks = [baseSepolia]

export async function getUniversalConnector() {
  const universalConnector = await UniversalConnector.init({
    projectId,
    metadata: {
      name: 'Simple Onchain Marketplace',
      description: 'A decentralized marketplace for buying items with ETH',
