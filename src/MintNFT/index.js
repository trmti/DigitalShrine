import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork, useSigner } from 'wagmi';
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
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);
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
    } else {
      (async () => {
        const nfts = await fetch(
          `https://polygon-mainnet.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCKEMY_API_KEY}/getNFTs?owner=${address}&pageSize=100&withMetadata=true`
        );
        let res = await nfts.json();
        setNfts(
          await Promise.all(
            res.ownedNfts.map(async (nft) => {
              let image;
              const uri = nft.tokenUri.gateway;
              if (uri.startsWith('https://') || uri.startsWith('http://')) {
                try {
                  image = (await (await fetch(uri)).json()).image;
                  if (image.startsWith('ipfs://')) {
                    const res = await (
                      await fetch(
                        'https://alchemy.mypinata.cloud/ipfs/' +
                          image.split('/')[2]
                      )
                    ).blob();
                    image = window.URL.createObjectURL(res);
                  }
                } catch (e) {
                  console.error(e);
                  image = '/logo.png';
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
          )
        );
      })();
    }
  }, [address, chain]);
  return (
    <div id="wrapper">
      <dialog id="mintDialog">
        <p>I'm dialog</p>
        {approved ? (
          <div>
            <form>
              <label>今年の抱負</label>
              <textarea ref={inputRef} />
              <button
                onClick={async (event) => {
                  console.log(nftInfo.address, nftInfo.id);
                  event.preventDefault();
                  const res = await mintNFT(
                    inputRef.current.value,
                    nftInfo.address,
                    nftInfo.id,
                    signer
                  );
                  if (res.status === 1) {
                    alert('mint success!');
                    setApproved(false);
                    const dialog = document.getElementById('mintDialog');
                    dialog['close']();
                  } else {
                    alert('transaction failed');
                    console.log(res);
                  }
                }}
              >
                mint
              </button>
            </form>
          </div>
        ) : (
          <div>
            <button
              onClick={async () => {
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
              }}
            >
              approve
            </button>
          </div>
        )}
        <button
          onClick={() => {
            const dialog = document.getElementById('mintDialog');
            dialog['close']();
          }}
        >
          close
        </button>
      </dialog>
      <div>
        <h1>Click NFT you want to dump.</h1>
        <div id="Cards">
          {nfts ? (
            nfts.map(({ image, title, description, address, id }, index) => {
              return (
                <Card
                  image={image}
                  title={title}
                  description={description}
                  onClick={() => {
                    const dialog = document.getElementById('mintDialog');
                    dialog['showModal']();
                    setNftInfo({ address, id });
                  }}
                  key={index}
                />
              );
            })
          ) : (
            <></>
          )}
        </div>
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
