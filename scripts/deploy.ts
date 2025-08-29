import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  
  console.log("Starting deployment of SimpleMarketplace contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract with account: ${deployer.address}`);
  console.log(`Account balance: ${ethers.formatEther(await ethers.provider?.getBalance(deployer.address) || 0n)} ETH`);

  // Deploy the SimpleMarketplace contract
  console.log("Deploying SimpleMarketplace...");
  const SimpleMarketplace = await ethers.getContractFactory("SimpleMarketplace");
  const marketplace = await SimpleMarketplace.deploy();
  
  // Wait for deployment to complete
  await marketplace.waitForDeployment();
  const contractAddress = await marketplace.getAddress();
  
  console.log("SimpleMarketplace deployed successfully!");
  console.log(`Contract address: ${contractAddress}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Gas used: ${marketplace.deploymentTransaction()?.gasLimit?.toString() || 'Unknown'}`);

  // Log deployment summary
  console.log("\n Deployment Summary:");
  console.log("========================");
  console.log(`Contract: SimpleMarketplace`);
  console.log(`Address: ${contractAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
  
  // Save deployment info for frontend integration
  console.log("\n  Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your frontend configuration");
  console.log("3. Test the contract functions");
  console.log("4. Consider verifying the contract on the block explorer");
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
