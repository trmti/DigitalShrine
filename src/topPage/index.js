import './index.css';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

function Top() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const movePage = () => {
    navigate('/NFTList');
  };

  const onClick = async () => {
    if (isConnected) {
      navigate('/mintNFT');
      return;
    } else {
      open();
    }
  };
  return (
    <div id="Top">
      <header>
        <img id="logo" src="/logo.png" />
        <p id="JapName">出路樽神社</p>
        <p>Digital Shrine</p>
      </header>
      <div id="saisen" onClick={onClick}>
        <h1>↓ Click!</h1>
        <img className="coin" src="/coin.png" />
        <img id="saisenBox" src="/saisen.png" />
      </div>
      <div id="leftPage" onClick={movePage}>
        <p>みんなの絵馬</p>
        <img src="/arrow.svg" alt="" />
      </div>
    </div>
  );
}

export default Top;
