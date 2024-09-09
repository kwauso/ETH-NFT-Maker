import { Button } from "@mui/material";
import React from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import {useEffect, useState} from "react";

const NftUploader = () => {
    /*
    * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
    */
    const [currentAccount, setCurrentAccount] = useState("");
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
        />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input
          className="nftUploadInput"
          type="file"
          accept=".jpg , .jpeg , .png"
        />
      </Button>
    </div>
  );
};

export default NftUploader;
