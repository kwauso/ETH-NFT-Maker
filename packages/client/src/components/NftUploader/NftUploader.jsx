import { Button } from "@mui/material";
import React from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import {useEffect, useState} from "react";

const NftUploader = () => {
    const checkIfWalletIsConnected = () => {
        /*
        * ユーザーが MetaMask を持っているか確認します。
        */
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
        } else {
            console.log("We have the ethereum object", ethereum);
        }
    };
    const connectWallet = () =>{
    };
    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
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
