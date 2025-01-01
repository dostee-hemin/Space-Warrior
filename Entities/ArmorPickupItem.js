class ArmorPickupItem extends PickupItem {
  constructor(x, y, armor) {
    super(x, y);

    this.armor = armor;
  }

  bump(otherEntity) {
    if(!(otherEntity instanceof Player)) return;

    this.armor.unlocked = true;
  }

  isPickedUp() {
    return this.armor.unlocked;
  }

  isFinished() {
    return super.isFinished() || this.isPickedUp();
  }
}