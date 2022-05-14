import {useContract} from './useContract';
import LandNFTAbi from '../contracts/Land.json';
import LandContractAddress from '../contracts/LandAddress.json';


// export interface for NFT contract
export const useMinterContract = () => useContract(LandNFTAbi.abi, LandContractAddress.Land);