import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("Apollo", (moduleBuilder) => {
    // Deploy contract
    const apollo = moduleBuilder.contract("Rocket", ["Saturn V"]);
    console.log('APOLLO --- ', apollo);
    
    // Make calls
    moduleBuilder.call(apollo, "launch", []);
    
    const statusRead = moduleBuilder.call(apollo, "status", []);
    console.log('status == ',statusRead)
    
    return { apollo };
});