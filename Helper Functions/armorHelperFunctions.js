function isArmorMaxedOut(armorIndex) {
    let numUnlocked = 0;
    
    for(let j=0; j<armorInfo[armorIndex].pieces.length; j++) {
        numUnlocked += armorInfo[armorIndex].pieces[j].unlocked ? 1 : 0;
    }

    return numUnlocked == armorInfo[armorIndex].pieces.length
}