const hre = require("hardhat");

async function main() {
  const goal = hre.ethers.parseEther("5");
  const fixedDeadline = 1764545940; // 12/31/2025 11:59 PM ET = 1/1/2026 04:59:00 UTC

  const Crowdfund = await hre.ethers.getContractFactory("Crowdfund");
  const contract = await Crowdfund.deploy(fixedDeadline, goal);
  await contract.waitForDeployment();

  console.log(`Crowdfund deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
