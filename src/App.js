import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import gif from './img/nomad-fire.gif';
import './App.css';

const NFTaddress = "0x2ba4D89bE0D047350c66331f42A61010514711e9";

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
        const totalSupply = await contract.totalSupply();
        const object = {"cost" : String(cost), "totalSupply" : String(totalSupply)}
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
          <p className = "count">{data.totalSupply} / 200</p>
          <p className = "cost">Each NFT cost {data.cost / 10**18} eth (exluding gas fees)</p>
        </div>
        <button onClick={mint}>MINT a FREE Nomad Gallery NFT</button>
      </div>
    </div>
  );
}

export default App;
