import * as ethers from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

            const wallet = ethers.Wallet.createRandom();
            console.log(`MNEMONIC PHRASE: ${wallet.mnemonic.phrase}`);

console.log("Hello, Node Typescript app")
console.log("MESSAGE: " + process.env.MESSAGE)