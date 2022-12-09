// Initiate App
const startApp = async (provider) => {
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }

  let currentAccount = null;
  let chainLbl = document.getElementById('chain');
  let accountLbl = document.getElementById('account');
  let balanceLbl = document.getElementById('balance');
  let connectBtn = document.getElementById('connect-btn');
  let detailsSecn = document.getElementById('details-section');

  // On chain change
  const handleChainChanged = (_chainId) => {
    chainLbl.innerHTML = `<span>Chain ID: </span>${_chainId}`
    showBalance();
  }

  // On account change
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
    }
  }

  // Show balance
  const showBalance = () => {
    ethereum
      .request({method: 'eth_getBalance', params: [currentAccount, 'latest']})
      .then(result => {
        let wei = parseInt(result, 16);
        let balance = wei / (10**18);
        balanceLbl.innerHTML = `<span>Balance: </span>${balance}`;
      })
  }

  // Show account
  const showAccount = (accounts) => {
    currentAccount = accounts[0];
    accountLbl.innerHTML = `<span>Account: </span>${currentAccount}`;
    connectBtn.classList.toggle('hidden');
    detailsSecn.classList.toggle('hidden')
    showBalance();
  }

  // Connect to wallet
  const connect = () => {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => showAccount(accounts))
      .catch((err) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }

  const chainId = await ethereum.request({ method: 'eth_chainId' });
  chainLbl.innerHTML = `<span>Chain ID: </span>${chainId}`

  connectBtn.addEventListener('click', connect);
  ethereum.on('chainChanged', handleChainChanged);
  ethereum.on('accountsChanged', handleAccountsChanged);
}

const provider = await detectEthereumProvider();

if (provider) {
  startApp(provider);
} else {
  console.log('Please install MetaMask!');
}