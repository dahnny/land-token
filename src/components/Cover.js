import logo from "../logo.svg";
import { Button } from "react-bootstrap";

const Cover = ({ connect }) => {
  const connectWallet = async () => {
    try {
      await connect();
    } catch (e) {
      console.log({ e });
    }
  };
  return (
    <>
      <img src={"https://images.unsplash.com/photo-1535815104204-1282638c01f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"} className="App-logo" alt="logo" />
      <br />
      <br />
      <p>Land NFT</p>
      <Button variant="primary" onClick={connectWallet}>
        Connect Wallet
      </Button>
    </>
  );
};

export default Cover;
