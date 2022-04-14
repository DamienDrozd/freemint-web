import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import gif from './img/nomad-fire.gif';
import './App.css';

const NFTaddress = "0x59F497Bd97Eae1E152CFC2E30485affD86f9eb06";

function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();

  }, [])

  async function fetchData() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(NFTaddress, NFT.abi, provider );
      try {
        const cost = await contract.cost();
        const maxSupply = await contract.maxSupply();
        const totalSupply = await contract.totalSupply();
        const tokenURI = await contract.tokenURI(1);
        const object = {"cost" : String(cost), "totalSupply" : String(totalSupply), "maxSupply": String(maxSupply), "tokenURI": tokenURI}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function mint(){
    if (typeof window.ethereum !== 'undefined'){
      let accounts = await window.ethereum.request({method: "eth_requestAccounts"})
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFTaddress,  NFT.abi, signer);
      try {
        let overrides = {
          from : accounts[0],
          value : data.cost
        }
        const transaction = await contract.mintForAddress(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="image">
          <img src={gif} alt="gif"/>
        </div>
        <div className="text">
          {error && <p>{error}</p>}
          <h1>Mint a NomadGallery NFT</h1>
          <p className = "count">{data.totalSupply} / {data.maxSupply}</p>
          <p className = "cost">Each NFT cost {data.cost / 10**18} eth (exluding gas fees)</p>
          <p>tokenURI : {data.tokenURI}</p>
        </div>
        <button onClick={mint}>MINT a FREE Nomad Gallery NFT</button>
      </div>
    </div>
  );
}

export default App;


//reste a faire: 
//- mise a jour du site lors du deployement 
//-redirection vers le etherscan / opensea lors du mint
//lien du opensea sur la page 
// upload du site.
