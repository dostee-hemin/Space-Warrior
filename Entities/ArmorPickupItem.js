class ArmorPickupItem extends PickupItem {
  constructor(x, y, armor) {
    super(x, y);

    this.armor = armor;
  }

  bump(otherEntity) {
    if(!(otherEntity instanceof Player)) return;

    this.armor.unlocked = true;
    
    // Check to see if achievement is unlocked
    let allArmorUnlocked = true;
    for(let i=0; i<armorInfo.length; i++) {
      for(let j=0; j<armorInfo[i].pieces.length; j++) {
        if(!armorInfo[i].pieces[j].unlocked) allArmorUnlocked = false;
      }
    }
    if(allArmorUnlocked) achievementManager.unlock(AchievementManager.UNLOCK_ALL_ARMOR)
  }

  isPickedUp() {
    return this.armor.unlocked;
  }

  isFinished() {
    return super.isFinished() || this.isPickedUp();
  }
}