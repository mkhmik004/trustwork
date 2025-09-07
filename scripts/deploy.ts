import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying Escrow contract...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the Escrow contract
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();

  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();

  console.log("Escrow contract deployed to:", escrowAddress);
  console.log("Transaction hash:", escrow.deploymentTransaction()?.hash);

  // Save the contract address and ABI
  const contractInfo = {
    address: escrowAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
  };

  // Create lib directory if it doesn't exist
  const libDir = path.join(__dirname, "..", "src", "lib");
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // Save contract info
  fs.writeFileSync(
    path.join(libDir, "contract-info.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  // Save ABI
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "Escrow.sol", "Escrow.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    fs.writeFileSync(
      path.join(libDir, "escrow-abi.json"),
      JSON.stringify(artifact.abi, null, 2)
    );
    console.log("Contract ABI saved to src/lib/escrow-abi.json");
  }

  console.log("Contract info saved to src/lib/contract-info.json");
  console.log("\nDeployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Add the contract address to your .env file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log("2. Update your frontend to use the deployed contract");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});