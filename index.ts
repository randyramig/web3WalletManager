import { program } from "commander";
import fs from "fs";
import * as ethers from "ethers";
import chalk from "chalk";
import * as dotenv from "dotenv";
import { Question } from "./question";
dotenv.config();

program
  .option("-c, --create", "create wallets")
  .option("-l, --list", "list wallets")
  .option("-f, --fund", "fund wallets from a specified account")
  .option("-s, --sweep", "sweep funds from wallets to a specified account")
  .requiredOption(
    "-d, --wallet-dir <dir>",
    "directory to hold wallet keystore files",
  )
  .option("-a, --account <0xaddress>", "Funding account for fund/sweep")
  .option("-n, --num-wallets <num>", "Number of wallets to create")
  .parse();
const options = program.opts();

const createWallets = async () => {
  if (!options.numWallets) {
    console.error("You must specify number of wallets to create");
    program.help();
  }
  if (fs.existsSync(options.walletDir)) {
    console.error(
      `${options.walletDir} exists, specify a non-existent directory for wallets`,
    );
    program.help();
  } else {
    fs.mkdirSync(options.walletDir);
  }

  const question = new Question();
  const password = await question.ask(
    "Enter password for wallet keystore files: ",
  );

  console.log(chalk.red(`** DON'T LOSE YOUR PASSWORD **`));
  console.log(
    chalk.green(
      `Creating ${options.numWallets} wallets in ${options.walletDir}...`,
    ),
  );

  for (let i = 0; i < options.numWallets; ++i) {
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    const keystoreJson = await wallet.encrypt(password);

    fs.writeFileSync(`${options.walletDir}/${address}.json`, keystoreJson);
  }

  console.log(
    chalk.green(
      `Wallets created, STRONGLY ENCOURAGED to run this again with the list option to validate wallets before using`,
    ),
  );
};

const listWallets = async () => {
  const question = new Question();
  const password = await question.ask(
    "Enter password for wallet keystore files: ",
  );

  console.log(chalk.green(`Inspecting ${options.walletDir} directory...`));

  const files = fs.readdirSync(options.walletDir);
  for (const file of files) {
    console.log(chalk.green(`Found: ${file}, decrypting...`));
    const walletJson = fs.readFileSync(`${options.walletDir}/${file}`);
    const wallet = await ethers.Wallet.fromEncryptedJson(
      walletJson.toString(),
      password,
    );
    console.log(chalk.yellow(`\tAccount address: ${wallet.address}`));
  }
};

async function main() {
  if (options.create) {
    await createWallets();
  } else if (options.list) {
    await listWallets();
  } else if (options.fund) {
    console.error("NYI");
  } else if (options.sweep) {
    console.error("NYI");
  } else {
    console.error("You must specify one of create/list/fund/sweep");
    program.help();
  }

  const provider = new ethers.EtherscanProvider(
    process.env.ETH_NETWORK,
    process.env.ETHERSCAN_TOKEN,
  );
  const currentBlock = await provider.getBlockNumber();

  console.log(
    `Hello, Node Web3 Typescript app from ${process.env.ETH_NETWORK} network at block ${currentBlock}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
