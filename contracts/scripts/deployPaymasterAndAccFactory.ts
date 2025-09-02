import dotenv from 'dotenv';
import fs from 'fs';
import hre from "hardhat";

const EP_ADDRESS: string = process.env.ENTRY_POINT_ADDRESS || '';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

  const envConfig = dotenv.parse(fs.readFileSync('.env'));

  const signers = await hre.ethers.getSigners();
  const faucet = signers[2];

  // deploy paymaster
  const pm = await hre.ethers.deployContract("Paymaster", [], { signer: faucet });
  await pm.waitForDeployment();
  console.log(`PM: ${pm.target}`); 
  envConfig.PAYMASTER_ADDRESS = pm.target.toString();
  
  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS, faucet);
  await ep.depositTo(pm.target.toString(), { 
    value: hre.ethers.parseEther(".015"), // this is gonna take base-sep eth from our metamask wallet and deposit it into the paymaster
  }); 
  console.log("\nPM funded successfully"); 

  await delay(5000); // wait for 5 seconds to avoid nonce issues

  const af_v3_authority = await hre.ethers.deployContract("contracts/src/ProbabilisticCompliance/Authority.sol:AccountFactory", [], { signer: faucet });
  await af_v3_authority.waitForDeployment();
  console.log(`\nAF_V3_AUTHORITY: ${af_v3_authority.target}`);
  envConfig.ACCOUNT_FACTORY_V3_AUTHORITY_ADDRESS = af_v3_authority.target.toString();


  const af_v3_probabilistic = await hre.ethers.deployContract("contracts/src/ProbabilisticCompliance/AccountForV3Probabilistic.sol:AccountFactory", [], { signer: faucet });
  await af_v3_probabilistic.waitForDeployment();
  console.log(`\nAF_V3_PROBABILISTIC: ${af_v3_probabilistic.target}`);
  envConfig.ACCOUNT_FACTORY_V3_PROBABILISTIC_ADDRESS = af_v3_probabilistic.target.toString();

  const af_v3_relayer_probabilistic = await hre.ethers.deployContract("contracts/src/ProbabilisticCompliance/RelayerForV3Probabilistic.sol:AccountFactory", [], { signer: faucet });
  await af_v3_relayer_probabilistic.waitForDeployment();
  console.log(`\nAF_V3_RELAYER_PROBABILISTIC: ${af_v3_relayer_probabilistic.target}`);
  envConfig.ACCOUNT_FACTORY_V3_RELAYER_PROBABILISTIC_ADDRESS = af_v3_relayer_probabilistic.target.toString();

  // write new addresses to .env file
  const updatedEnv = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
  fs.writeFileSync('.env', updatedEnv);
  
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });