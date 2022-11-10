


//import

//async main

//main()along with the error code
//the above is the code format we follow , as done in ether,js package as well so :

const {ethers , run , network}=require("hardhat"); //Hardhat has in built ethers package and thus here you are importing that "ethers" package from hardhat as done({ethers}->importing) so that using ethers js package we can get the contractfactory object
require("dotenv").config();//importing .env file so as to use here in this file , also to use env , make sure to type yarn add --dev dotenv for this project folder(HARDHAT-SIMPLE-STORAGE) as as of nowdidnt added so adding now to use env files

async function main(){ 
//now hardhat have its own in built by default blockchain network where the contract can be deployed along with the in built default account which funds the deployment of contract into that eth bc hardhat network
//and thus while deploying the contract here , we dont have to get the rpc network as hardhat gets that and deploys the contract to its own network in background by default itself , just like a ganache framework
//similarly thus while deploying the contract here , we dont have to get the wallet private key as hardhat has its own accounts that it uses to fund the deployment in background by default and deploys the contract to its own network in background by default itself
//so at last we can just jump to getting the contractFactory object and use it to deploy as:
const simpleStorageFactory=await ethers.getContractFactory("SimpleStorage") //here in ("name of the contract to be deployed") storing it in variable simpleStorageFactory
console.log("Deploying contract......");
const simpleStorage=await simpleStorageFactory.deploy(); //contract SimpleStorage deployment to the hardhat network with default hardhat account which will fund , so everything hardhat takes care and does , so deployed contract stored in simpleStorage variable and thus this is contract creation as its deployed to network , and if in console.log(simpleStorage) then it will give all the details of the transaction for deployment of contract
await simpleStorage.deployed(); //making it wait further with await and using the deployed function , so now in terminal depploy this contract using hardhat by running the script using yarn hardhat run scripts/deploy.js (location of the file which you want to run using hardhat)
console.log(`Deployed contract is ${simpleStorage.address}`); //now note that after running , you will see the address of sc where it has been deployed that is in the hardhat n.w. see page-72 UNDER ****** FOR O/P

//now before calling verify function we need to make sure that the n/w on which contract is deployed is real/live network(like testnets , mainnet) and not some local network(like hardhat ,ganache) as verification is done for contracts deployed on real bc networks so since we are using goerli bc testnet network here as done in module.export and running the yarn hardhat run ** -network goerli, we can see chainId of goerli testnet is 5(hence importing network package as well on top) and we should have etherscan API to verify our contract in etherscan and so :
//using the network package we can access the configurations and specifications of the networks defined in module.exports under the hardhat config file 
if(network.config.chainId === 5 && process.env.ETHERSCAN_API){ //IF THE n.w chainId is 5 that is live network then only we verufy and if etherscan API key exist then only true so we verify then only
//now contract deployment and then verification from etherscan can take some time so for better practice lets wait for 6 block confirmation that is deploytransaction wait of its transaction by 6 blocks
await simpleStorage.deployTransaction.wait(6); //now with this wait will be done and transaction will be success and ready and thus now can be verified , basically to specify exact amount how much to wait
//the more plugins we install to our proeject , the more task we can extend of our hardhat , here we did for verify by adding suitable plugin and thus , also we wanted to verify the contract on etherscan so api for etherscan we took
await verify(simpleStorage.address, []);//now here in this function while calling we pass the parameters that is address of deployed contract that is contract address and empty args as we dont have any constructorargs and so this contract address's contract will be verified
}
//now lets interact with deployed contract at last :
const currentValue=await simpleStorage.retrieve();
console.log(`The current value is ${currentValue}`);
//storing new value 
const transactionResponse= await simpleStorage.store("7");
await transactionResponse.wait(1);
const updatedValue= await simpleStorage.retrieve();
console.log(`New updated value is ${updatedValue}`);

//now at last lets deploy and run the contract and script with yarn hardhat run scripts/deploy.js --network goerli  
}
async function verify(contractAddress , args)//the verify task takes args of contract address and the constructor args
{
  //when it comes to verifying the contract very likely there can be the case that contract is already verified and thus you can run into the error in such case and thus we will wrap this function script around the try and catch block see page-81 for defination of try catch
try{
  await run("verify:verify" , { //so on top we have imported the run package as well , and thus run package is a pacakge which is used to run any task of hardhat and thus since we wanna use verify task of hardhat that we added after getting the plugin for it , we run that verify task which is now one of task of hardhat , hence this is how we run the task , and even within verify task u can have types so here we using just to verify the contract hence verify:verify
 address: contractAddress, //and verify task takes args as mentioned so doing it
 constructorArguments: args,
}) //some error coming after trying everything for verifying but its still cool to understand and keet things here so move forward champ!
}
catch(e){ //if error e is found in try block then run catch block code
  if(e.message.toLowercase().includes("already verified")){ //if the message of error says in lowercase(since error can be in some byte code)includes string "already verified" then its verified
    console.log("contract is already verified");
  }
  else{
    console.log(e); //just show the error , now lets go to main function and call this verify function so that our contract could be verified on block explorer such as etherscan
  }
}
}
main()
  .then(() => process.exit(0)) //since our main function is async we and while calling in order to wait and print if there is any error it gets , we have used this code just copied and pasted
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });