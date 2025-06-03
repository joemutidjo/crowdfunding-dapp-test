import { ethers } from "ethers";
import abi from "./CrowdfundABI.json";

const CONTRACT_ADDRESS = "0x7fee8FBb958BEe4513853B8B84422c74B70EA98F";

export function getCrowdfundContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signerOrProvider);
}
