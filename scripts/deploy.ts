import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  
  console.log("Starting deployment of contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Account balance: ${ethers.formatEther(await ethers.provider?.getBalance(deployer.address) || 0n)} ETH`);

  // Deploy SellerRegistry first
  console.log("\nDeploying SellerRegistry...");
  const SellerRegistry = await ethers.getContractFactory("SellerRegistry");
  const sellerRegistry = await SellerRegistry.deploy();
  await sellerRegistry.waitForDeployment();
  const sellerRegistryAddress = await sellerRegistry.getAddress();
  console.log("✅ SellerRegistry deployed successfully!");
  console.log(`📍 SellerRegistry address: ${sellerRegistryAddress}`);

  // Deploy SimpleMarketplace with SellerRegistry address
  console.log("\nDeploying SimpleMarketplace...");
  const SimpleMarketplace = await ethers.getContractFactory("SimpleMarketplace");
  const marketplace = await SimpleMarketplace.deploy(sellerRegistryAddress);
  
  // Wait for deployment to complete
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  
  console.log("✅ SimpleMarketplace deployed successfully!");
  console.log(`📍 Marketplace address: ${marketplaceAddress}`);
  console.log(`🔗 Network: ${(await ethers.provider.getNetwork()).name}`);

  // Log deployment summary
  console.log("\n Deployment Summary:");
  console.log("========================");
  console.log(`SellerRegistry: ${sellerRegistryAddress}`);
  console.log(`Marketplace: ${marketplaceAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
  
  // Save deployment info for frontend integration
  console.log("\n  Next steps:");
  console.log("1. Copy both contract addresses above");
  console.log("2. Update your frontend configuration with both addresses");
  console.log("3. Register sellers using the SellerRegistry");
  console.log("4. Assign items to sellers");
  console.log("5. Test the contract functions");
}

// Handle errors and exit
main()
  .then(() => {
    console.log("\n Deployment script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n Deployment failed with error:", error);
    process.exit(1);
  });
