import { StacksMainnet } from '@stacks/network';

export const CITYCOIN_DEPLOYER = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27';
export const CITYCOIN_VRF = 'citycoin-vrf';

export const STACKS_API_URL = 'https://stacks-node-api.mainnet.stacks.co';
export const STACKS_API_V2_INFO = `${STACKS_API_URL}/v2/info`;
export const STACKS_API_ACCOUNTS_URL = `${STACKS_API_URL}/v2/accounts`;
export const STACKS_API_MEMPOOL = `${STACKS_API_URL}/extended/v1/tx/mempool`;
export const STACKS_API_FEE_URL = `${STACKS_API_URL}/v2/fees/transfer`;

export const NETWORK = new StacksMainnet();
NETWORK.coreApiUrl = STACKS_API_URL;

// return the current Stacks block height
export const getCurrentBlockHeight = async () => {
  const response = await fetch(STACKS_API_V2_INFO);
  const json = await response.json();
  console.log(`currentBlockHeight result: ${json.stacks_tip_height}`);
  return json.stacks_tip_height;
};

export async function getEstimatedStxFee() {
  // get estimated fee from API, returns integer
  const result = await fetch(STACKS_API_FEE_URL);
  const feeValue = await result.json();
  console.log(`getEstimatedStxFee result: ${feeValue}`);
  return feeValue;
}

// return the average fee of the first 200 transactions in mempool
export const getMempoolFeeAvg = async () => {
  const response = await fetch(STACKS_API_MEMPOOL);
  const json = await response.json();
  const txs = json.results;
  const sum = txs.map(fee => parseInt(fee.fee_rate)).reduce((a, b) => a + b, 0);
  console.log(`getMempoolFeeAvg result: ${sum / txs.length}`);
  return sum / txs.length;
};

// return the median fee of the first 200 transactions in mempool
export const getMempoolFeeMedian = async () => {
  const response = await fetch(STACKS_API_MEMPOOL);
  const json = await response.json();
  const txs = json.results;
  const fees = txs.map(fee => parseInt(fee.fee_rate));
  fees.sort((a, b) => a - b);
  const median = fees[Math.floor(fees.length / 2)];
  console.log(`getMempoolFeeMedian result: ${median}`);
  return median;
};
