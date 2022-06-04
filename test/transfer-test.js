const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Transfer", function () {
  let deployer;
  let receivers;
  let transfer;

  beforeEach(async () => {
    [deployer, ...receivers] = await ethers.getSigners();

    const Transfer = await ethers.getContractFactory("Transfer");
    transfer = await Transfer.deploy();
    await transfer.deployed();
  });

  it("Test depoly and init state", async function () {
    expect(await transfer.owner()).to.equal(deployer.address);
    expect(await transfer.getBalance()).to.equal(0);
  });

  it("Test balance", async function () {
    const tx = await deployer.sendTransaction({
      gasPrice: await deployer.provider.getGasPrice(),
      to: transfer.address,
      value: ethers.utils.parseEther('10.0'),
    });
    await tx.wait();
    
    expect(await transfer.getBalance()).to.equal(ethers.utils.parseEther('10.0'));
    expect(await deployer.provider.getBalance(transfer.address)).to.equal(ethers.utils.parseEther('10.0'));
  });

  it("Transfer balance", async function () {
    // init balance first
    const tx = await deployer.sendTransaction({
      gasPrice: await deployer.provider.getGasPrice(),
      to: transfer.address,
      value: ethers.utils.parseEther('10.0'),
    });
    await tx.wait();
    
    // const [balance1, balance2, balance3] = [await receivers[0].getBalance(), await receivers[1].getBalance(), await receivers[2].getBalance()];
    const [beforbalance1, beforbalance2, beforbalance3] = await Promise.all([receivers[0].getBalance(), 
                                                                             receivers[1].getBalance(), 
                                                                             receivers[2].getBalance()]);

    // transfer balance
    await transfer.batchTransfer([receivers[0].address, receivers[1].address, receivers[2].address], 
                                 [ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.2'), ethers.utils.parseEther('0.3')]);
    expect(await transfer.getBalance()).to.equal(ethers.utils.parseEther('9.4'));

    // check receiver balance
    const [afterbalance1, afterbalance2, afterbalance3] = await Promise.all([receivers[0].getBalance(), 
                                                                             receivers[1].getBalance(), 
                                                                             receivers[2].getBalance()]);
    expect(afterbalance1.sub(beforbalance1)).to.equal(ethers.utils.parseEther('0.1'));  
    expect(afterbalance2.sub(beforbalance2)).to.equal(ethers.utils.parseEther('0.2')); 
    expect(afterbalance3.sub(beforbalance3)).to.equal(ethers.utils.parseEther('0.3')); 

    // check emit event
    await expect(transfer.batchTransfer([receivers[0].address], [ethers.utils.parseEther('0.1')]))
            .to.emit(transfer, "etransfer")
            .withArgs(ethers.constants.AddressZero, receivers[0].address, ethers.utils.parseEther('0.1'));
  });

  it("Transfer balance exception", async function () {
    // init balance first
    const tx = await deployer.sendTransaction({
      gasPrice: await deployer.provider.getGasPrice(),
      to: transfer.address,
      value: ethers.utils.parseEther('1.0'),
    });
    await tx.wait();
    
    // const [balance1, balance2, balance3] = [await receivers[0].getBalance(), await receivers[1].getBalance(), await receivers[2].getBalance()];
    const [beforbalance1, beforbalance2, beforbalance3] = await Promise.all([receivers[0].getBalance(), 
                                                                             receivers[1].getBalance(), 
                                                                             receivers[2].getBalance()]);

    // transfer balance not enough exception
    await expect(transfer.batchTransfer([receivers[0].address, receivers[1].address, receivers[2].address], 
                                        [ethers.utils.parseEther('0.3'), ethers.utils.parseEther('0.4'), ethers.utils.parseEther('0.5')]))
            .to.be.revertedWith("not enough balance");
    expect(await transfer.getBalance()).to.equal(ethers.utils.parseEther('1.0'));

    // check receiver balance
    const [afterbalance1, afterbalance2, afterbalance3] = await Promise.all([receivers[0].getBalance(), 
                                                                             receivers[1].getBalance(), 
                                                                             receivers[2].getBalance()]);
    expect(afterbalance1).to.equal(beforbalance1);  
    expect(afterbalance2).to.equal(beforbalance2);  
    expect(afterbalance3).to.equal(beforbalance3);   

    // not match the address and amout for receiver
    await expect(transfer.batchTransfer([receivers[0].address, receivers[1].address, receivers[2].address], 
                                        [ethers.utils.parseEther('0.3'), ethers.utils.parseEther('0.4')]))
            .to.be.revertedWith("tolist.length != values.length");
    expect(await transfer.getBalance()).to.equal(ethers.utils.parseEther('1.0'));

    // not owner
    await expect(transfer.connect(receivers[0]).batchTransfer([receivers[0].address], [ethers.utils.parseEther('0.3')]))
            .to.be.revertedWith("Ownable: caller is not the owner");
  }); 
  
  
});
