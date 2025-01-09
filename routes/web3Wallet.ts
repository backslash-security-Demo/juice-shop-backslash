import { Request, Response } from 'express';
import { contractExploitHandler } from '../lib/contractHandler'

/**
 * Middleware to handle requests and invoke the contract exploit handler.
 */
export const contractExploitListener = () => {
  return async (req: Request, res: Response) => {
    const metamaskAddress = req.body.walletAddress;

    if (!metamaskAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }

    try {
      const result = await contractExploitHandler(metamaskAddress);
      res.status(200).json({ success: true, message: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  };
};
