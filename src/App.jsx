import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { useEffect, useState } from "react";

function App() {
  const [ connectedWallet, setConnectedWallet ]= useState(null);
  // Create connector
  const walletConnector = new NodeWalletConnect(
    {
      bridge: "https://bridge.walletconnect.org", // Required
    },
    {
      clientMeta: {
        description: "Web3forces connect NodeJS Client",
        url: "https://nodejs.org/en/",
        icons: ["https://nodejs.org/static/images/logo.svg"],
        name: "Web3Forcer connector",
      },
    }
  );


  useEffect(() =>{
     // Check if connection is already established
  if (!walletConnector.connected) {
    // create new session
    walletConnector.createSession().then(() => {
      // get uri for QR Code modal
      const uri = walletConnector.uri;
      console.log(uri)
      // display QR Code modal
      WalletConnectQRCodeModal.open(
        uri,
        () => {
          console.log("QR Code Modal closed");
        },
      );
    });
  }else{
    setConnectedWallet(walletConnector.accounts[0])
  }
  }, [])
 

  // Subscribe to connection events
  walletConnector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Close QR Code Modal
    WalletConnectQRCodeModal.close(
    );

    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    setConnectedWallet(accounts[0]);
    
  });

  // walletConnector.on("session_update", (error, payload) => {
  //   if (error) {
  //     throw error;
  //   }

  //   // Get updated accounts and chainId
  //   const { accounts, chainId } = payload.params[0];
  // });

  walletConnector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Delete walletConnector
  });
  return (
    <div style={{width:"100%", height:"100%"}}>
        <h1>Connect Wallet</h1>
        <h3>Wallet connected: {connectedWallet}</h3>
        {/* <WalletConnectQRCodeModal/> */}
    </div>
    
  );
}

export default App;
