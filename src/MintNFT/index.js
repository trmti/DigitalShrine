import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useSigner,
  useContractRead,
} from 'wagmi';
import { polygon } from 'wagmi/chains';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import parse from 'html-react-parser';
import ABI from '../ABI.json';
import './index.css';

const approveNFT = async (address, id, signer) => {
  const contract = new ethers.Contract(address, ABI, signer);
  let tx = await contract.approve(process.env.REACT_APP_CONTRACT_ADDRESS, id);
  tx = await tx.wait();
  return tx;
};
const mintNFT = async (text, address, id, signer) => {
  const contract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    ABI,
    signer
  );
  let tx = await contract.mint(text, address, id);
  tx = await tx.wait();
  return tx;
};
const getNfts = async (address, setLoading, addressFilter = false) => {
  setLoading(true);
  let nfts;
  if (addressFilter) {
    nfts = await fetch(
      `https://polygon-mainnet.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCKEMY_API_KEY}/getNFTs?owner=${address}&pageSize=100&contractAddresses\[\]=${process.env.REACT_APP_CONTRACT_ADDRESS}&withMetadata=true`
    );
  } else {
    nfts = await fetch(
      `https://polygon-mainnet.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCKEMY_API_KEY}/getNFTs?owner=${address}&pageSize=100&withMetadata=true`
    );
  }
  let res = await nfts.json();
  const response = await Promise.all(
    res.ownedNfts.map(async (nft) => {
      let image;
      const uri = nft.tokenUri.gateway;
      if (uri.startsWith('https://') || uri.startsWith('http://')) {
        try {
          image = (await (await fetch(uri)).json()).image;
          if (image.startsWith('ipfs://')) {
            const res = await (
              await fetch(
                'https://alchemy.mypinata.cloud/ipfs/' + image.split('/')[2]
              )
            ).blob();
            image = window.URL.createObjectURL(res);
          } else if (image == '') {
            image = '/no_image.png';
          }
        } catch (e) {
          image = '/no_image.png';
        }
      } else if (uri.startsWith('<svg')) {
        image = nft.tokenUri.raw;
      } else {
        image = nft.tokenUri.raw;
      }
      return {
        image: image,
        title: nft.contractMetadata.name,
        description: nft.description,
        address: nft.contract.address,
        id: Number(nft.id.tokenId),
      };
    })
  );
  setLoading(false);
  return response;
};

function Card({ image, title, description, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {image.startsWith('<svg') ? parse(image) : <img src={image} />}
      <p className="title">{title}</p>
      <p className="desctiption">{description}</p>
    </div>
  );
}

function MintNFT() {
  const dialog = document.getElementById('mintDialog');

  const { address, isConnected } = useAccount();
  const { data: NFTBalance } = useContractRead({
    address: process.env.REACT_APP_CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'balanceOf',
    args: [address],
  });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(true);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [approved, setApproved] = useState(false);
  const [nftInfo, setNftInfo] = useState();

  const inputRef = React.createRef();

  const [nfts, setNfts] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      alert('Not connected Wallet');
      navigate(`/`);
    } else if (chain.id !== polygon.id) {
      switchNetwork?.(polygon.id);
    }
    if (NFTBalance != 0) {
      (async () => {
        const nfts = await getNfts(address, setLoading, true);
        setNfts(nfts);
      })();
    } else {
      (async () => {
        const nfts = await getNfts(address, setLoading);
        setNfts(nfts);
      })();
    }
  }, [address, chain, NFTBalance]);
  return (
    <div id="wrapper">
      <dialog id="mintDialog">
        <img
          src="/cross.svg"
          id="dialogClose"
          onClick={() => {
            setApproved(false);
            dialog['close']();
          }}
        />
        {approved ? (
          <div>
            <form id="submitForm">
              <label>今年の抱負</label>
              <textarea
                ref={inputRef}
                placeholder="毎日&#10;風呂に&#10;入る"
              />
              <button
                className="web3Btn"
                disabled={loadingDialog}
                onClick={async (event) => {
                  setLoadingDialog(true);
                  event.preventDefault();
                  try {
                    const res = await mintNFT(
                      inputRef.current.value,
                      nftInfo.address,
                      nftInfo.id,
                      signer
                    );
                    if (res.status === 1) {
                      alert('mint success!');
                      setApproved(false);
                      dialog['close']();
                    } else {
                      alert('transaction failed');
                      console.log(res);
                    }
                  } catch (e) {
                    alert(
                      'あなたはすでにNFTを発行しています。\n このNFTは一人一つまでです。'
                    );
                  }
                  setLoadingDialog(false);
                }}
              >
                mint
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p>
              奉納を許可するなら、
              <br />
              許可ボタンを押してね
            </p>
            <button
              className="web3Btn"
              disabled={loadingDialog}
              onClick={async () => {
                setLoadingDialog(true);
                try {
                  const res = await approveNFT(
                    nftInfo.address,
                    nftInfo.id,
                    signer
                  );
                  if (res.status === 1) {
                    setApproved(true);
                  } else {
                    alert('Transaction failed');
                  }
                } catch (e) {
                  alert('許可されませんでした。');
                }
                setLoadingDialog(false);
              }}
            >
              {loadingDialog ? (
                <>
                  <p>loading...</p>
                  <div className="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                </>
              ) : (
                <p>許可</p>
              )}
            </button>
          </div>
        )}
      </dialog>
      <div>
        {NFTBalance > 0 ? (
          <h1>あなたのNFT</h1>
        ) : (
          <h1>奉納したいNFTをクリック！</h1>
        )}
        {loading ? (
          <Spin />
        ) : (
          <div id="Cards">
            {nfts ? (
              nfts.map(({ image, title, description, address, id }, index) => {
                return (
                  <Card
                    image={image}
                    title={title}
                    description={description}
                    onClick={() => {
                      if (NFTBalance == 0) {
                        dialog['showModal']();
                        setNftInfo({ address, id });
                      }
                    }}
                    key={index}
                  />
                );
              })
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      <div
        id="leftPage"
        onClick={() => {
          navigate('/');
        }}
      >
        <p>Top Page</p>
        <img src="/arrow.svg" alt="" />
      </div>
    </div>
  );
}

export default MintNFT;

function Spin() {
  return (
    <div className="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
