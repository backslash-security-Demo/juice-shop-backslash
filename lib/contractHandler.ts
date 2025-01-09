const ethers = require('ethers')
import challengeUtils = require('../lib/challengeUtils');
import * as utils from '../lib/utils';

const web3WalletABI = require('../data/static/contractABIs').web3WalletABI;
const challenges = require('../data/datacache').challenges;

const web3WalletAddress = '0x413744D59d31AFDC2889aeE602636177805Bd7b0';
const walletsConnected = new Set();
let isEventListenerCreated = false;

/**
 * Function to handle contract interaction and event listening.
 * @param metamaskAddress - The wallet address from the request.
 * @returns A promise that resolves on success or throws an error.
 */
export const contractExploitHandler = async (metamaskAddress: string): Promise<string> => {

  try {
    const provider = new ethers.WebSocketProvider(
      'wss://eth-sepolia.g.alchemy.com/v2/FZDapFZSs1l6yhHW4VnQqsi18qSd-3GJ'
    );

    const contract = new ethers.Contract(metamaskAddress, web3WalletABI, provider);
    

    const user = await models.sequelize.query(
      `SELECT * FROM Users WHERE address = '${metamaskAddress}' AND deletedAt IS NULL`,
      { model: models.UserModel, plain: true }
    );

    if (!isEventListenerCreated) {
      contract.on('ContractExploited', (exploiter: string) => {
        if (walletsConnected.has(exploiter)) {
          walletsConnected.delete(exploiter);
          challengeUtils.solveIf(challenges.web3WalletChallenge, () => true);
        }
      });
      isEventListenerCreated = true;
    }

    return 'Event Listener Created';
  } catch (error) {
    throw utils.getErrorMessage(error);
  }
};
