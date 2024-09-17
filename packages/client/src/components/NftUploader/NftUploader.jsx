import { Button } from "@mui/material";
import React from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import {useEffect, useState} from "react";
//import ethers from "ethers";
import Web3Mint from "../../utils/Web3Mint.json";
import {Web3Storage} from "web3.storage";
import {PinataSDK} from "pinata-web3";
import lighthouse from "@lighthouse-web3/sdk";
import {LIGHT_HOUSE_API_KEY, PINATA_API_KEY, PINATA_JWT, PINATA_GATEWAY} from "./.config.ts";
//import fs from "fs";
const ethers = require("ethers");

const NftUploader = () => {
    /*
    * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
    */
    const [currentAccount, setCurrentAccount] = useState("");

    const [preview, setPreview] = useState("")

    /*この段階で currentAccount の中身は空*/
    console.log("currentAccount: ", currentAccount);
    const checkIfWalletIsConnected = async () => {
        /*
        * ユーザーが MetaMask を持っているか確認します。
        */
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
        const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = await provider.getSigner();
                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    Web3Mint,
                    signer
                );
                console.log("Going to pop wallet now to pay gas...");
                let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
                console.log("Mining...please wait.");
                await nftTxn.wait();
                console.log(
                    `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
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
    /*
    * ページがロードされたときに useEffect()内の関数が呼び出されます。
    */
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);


    //ここで画像をきちんとIPFSにあげないと行けない
    //ここがネック
    const imageToNFT = async (e) => {
        /*
        const pinata = new PinataSDK({
            pinataJwt : PINATA_JWT,
            pinataGateway : PINATA_GATEWAY
        });
         */
        //const image = e.target.files[0];
        const image = e.target.files;

        const progressCallback = (progressData) => {
            let percentageDone =
                100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
            console.log(percentageDone)
        }

        //const uploadRes = await lighthouse.upload(`${image}`, LIGHT_HOUSE_API_KEY);
        //console.log(uploadRes);
        //await fs.writeFileSync(`/images/${image}`, image);
        const output = await lighthouse.upload(image, LIGHT_HOUSE_API_KEY, null, progressCallback)
        console.log('File Status:', output)

        const imageURL = window.URL.createObjectURL(image);
        setPreview(imageURL);

        console.log(e);
        //const file = new File(["test"], image, {type: "image/png"});
        //const upload = await pinata.upload.file(file);
        //const file = new File(["experiment"], image, { type: "image/png" });
        //const upload = await pinata.upload.file(file);
        //const upload = await pinata.upload.url(preview);
        //const IpfsHash = upload.IpfsHash
        //console.log(IpfsHash);

        //const res = await pinata.gateways.get(IpfsHash);
        //console.log(res);
        //askContractToMintNft(res);
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
          <img src={preview} alt="imagelogo" />
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
