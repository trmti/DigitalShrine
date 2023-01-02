import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Top from './topPage';
import MintNFT from './MintNFT';
import NFTList from './NFTList';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const chains = [polygon];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: '88c15ee8907316cca7fe4adada9c3858' }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Top />,
  },
  {
    path: '/mintNFT',
    element: <MintNFT />,
  },
  { path: '/NFTList', element: <NFTList /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RouterProvider router={router} />
    </WagmiConfig>
    <Web3Modal
      projectId="88c15ee8907316cca7fe4adada9c3858"
      ethereumClient={ethereumClient}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
