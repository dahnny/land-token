const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandNFT", function () {
  this.timeout(50000);

  let landNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const LandNFT = await ethers.getContractFactory("LandNFT");
    [owner, acc1, acc2] = await ethers.getSigners();

    landNFT = await LandNFT.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await landNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    
    // expect(await watchNFT.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";
    const price = ethers.utils.parseUnits("1", "ether");
    await landNFT.connect(owner).safeMint(tokenURI, price);

    // expect(await watchNFT.balanceOf(acc1.address)).to.equal(1);
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    const price = ethers.utils.parseUnits("1", "ether");

    const tx1 = await landNFT
      .connect(owner)
      .safeMint(tokenURI_1, price);
    await tx1.wait();
    const tx2 = await landNFT
      .connect(owner)
      .safeMint(tokenURI_2, price);
    await tx2.wait();

    expect(await landNFT.tokenURI(0)).to.equal(tokenURI_1);
    expect(await landNFT.tokenURI(1)).to.equal(tokenURI_2);
  });
  it("Should buy and sell the nft", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await landNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await landNFT
    .connect(acc1)
    .buyLand( 0, {value: price});
    await landNFT.connect(acc1).sellLand(0)
  })
  it("Should get the nft", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await landNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await landNFT
    .connect(acc1)
    .getLand(0);
  })
});
