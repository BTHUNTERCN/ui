import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { noneCV, uintCV } from '@stacks/transactions';

export function CityCoinMining({ ownerStxAddress }) {
  const amountRefMining = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  // TODO: add onCancel state for loading that works ?
  // TODO: add logic for wallet not enabled (aka not installed)
  // TODO: consider state for when mining is active

  const mineAction = async () => {
    setLoading(true);
    if (amountRefMining.current.value === '') {
      console.log('positive number required to mine');
      setLoading(false);
    } else {
      const amountUstxCV = uintCV(amountRefMining.current.value.trim());
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CITYCOIN_CONTRACT_NAME,
        functionName: 'mine-tokens',
        functionArgs: [amountUstxCV, noneCV()],
        network: NETWORK,
        onCancel: () => {
          setLoading(false);
        },
        onFinish: result => {
          setLoading(false);
          setTxId(result.txId);
        },
      });
    }
  };

  return (
    <>
      <h3>Mine CityCoins</h3>
      <p>
        Mining CityCoins is done by spending STX in a given Stacks block. A winner is selected
        randomly weighted by the miners' proportion of contributions of that block. Rewards can be
        withdrawn after a 100 block maturity window.
      </p>
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRefMining}
            aria-label="Amount in STX"
            placeholder="Amount in STX"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">STX</span>
          </div>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="mine30Blocks" />
          <label className="form-check-label" htmlFor="mine30Blocks">
            Mine for 30 blocks
          </label>
        </div>
        <br />
        <button
          className="btn btn-block btn-primary"
          type="button"
          disabled={txId}
          onClick={mineAction}
        >
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          Mine
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
