import { Button } from "@mui/material";
import React from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import {useEffect, useState} from "react";
import Web3Mint from "../../utils/Web3Mint.json";
import lighthouse from "@lighthouse-web3/sdk";
//import {LIGHT_HOUSE_API_KEY} from "./.config.ts";
const ethers = require("ethers");
const Web3MintABI = Web3Mint.abi;

const NftUploader = () => {
    const [currentAccount, setCurrentAccount] = useState("");

    console.log("currentAccount: ", currentAccount);
    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    };

    const connectWallet = async () =>{
        try {
            const { ethereum } = window;
            if (!ethereum){
                alert("Connect your MetaMask account.");
                return;
            }
            const permissions = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected", permissions[0]);
            setCurrentAccount(permissions[0]);
        } catch (err) {
            console.error(err);
        }
    };

    const askContractToMintNft = async (ipfs) => {
        const CONTRACT_ADDRESS = "0x6116E41C20472D7138658FDE37A2B36d2BF19295";
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    Web3MintABI,
                    signer
                );
                console.log("Going to pop wallet now to pay gas...");
                let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
                console.log("Mining...please wait.");
                await nftTxn.wait();
                console.log(
                    `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
                );
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    const renderConnectedContainer = () => (
        <button className="cta-button cunnect-wallet-button">
            If you choose image, you can mint your NFT
        </button>
    );

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const imageToNFT = async (e) => {
        const image = e.target.files;

        const progressCallback = (progressData) => {
            let percentageDone =
                100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
            console.log(percentageDone)
        }

        const output = await lighthouse.upload(image, process.env.LIGHT_HOUSE_API_KEY, null, progressCallback)
        console.log('File Status:', output)
        const hash = output.data.Hash
        console.log(hash)
        console.log(e);
        await askContractToMintNft(hash);
    }

  return (
    <div className="outerBox">
      <div className="title">
        <h2>NFTアップローダー</h2>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          {currentAccount === "" ? (
              renderNotConnectedContainer()
          ) : (
              renderConnectedContainer()
          )}
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input
          className="nftUploadInput"
          multiple
          name="imageURL"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input
          className="nftUploadInput"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </Button>
    </div>
  );
};

export default NftUploader;
