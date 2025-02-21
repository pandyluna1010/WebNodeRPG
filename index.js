const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const heroine = {
    HP: 10,
    MAXHP: 10,
    STR: 10,
    WIZ: 10,
    RIS: 10,
    Defeated: 0,

    getStatus(){
        console.log(`Heroine:\nHP: ${heroine.HP}\nSTR: ${heroine.STR}\nWIZ: ${heroine.WIZ}\nRiS: ${heroine.RIS}\nMonsters Defeated: ${heroine.Defeated * 10}\n`);
    },
    getEXP(){
        const ranNums = generateRandomIntegers(0 + this.Defeated,3 + this.Defeated,4);
        heroine.MAXHP += ranNums[0];
        heroine.STR += ranNums[1];
        heroine.WIZ += ranNums[2];
        heroine.RIS += ranNums[3];
        heroine.Defeated += 0.1;
    },

    attackMonsterSTR(){
        const attack = Math.floor((this.STR * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);
        let monHP = monster.HP;
        const monRIS = monster.RIS;
        let damage = attack - monRIS;

        if(damage < 0){
            damage = 0
        }
        
        monHP -= damage;

        if(monHP > 0){
            console.log(`Monster takes ${damage} damage!`);
            monster.HP = monHP;
            promptUser();
        }else{
            console.log(`Monster takes ${damage} damage!`);
            console.log(`The monster has been defeated!`);
            heroine.getEXP();
            monster.getEXP();
            promptUser();
        }

    },
    attackMonsterWIZ(attack){
      isDefeated = false;
      let monHP = monster.HP;
      const monWIZ = monster.WIZ;
      let damage = attack - monWIZ;

      if(damage < 0){
          damage = 0
      }
      
      monHP -= damage;

      if(monHP > 0){

        console.log(`Monster takes ${damage} damage!`);
        monster.HP = monHP;
      }else{
        console.log(`Monster takes ${damage} damage!`);
        console.log(`The monster has been defeated!`);
        heroine.getEXP();
        monster.getEXP();
        isDefeated = true
      }
      return isDefeated;
    },

    frizz(){
      const castNum = generateRandomIntegers(2,5,1);
      let i = 0;

      while(i < castNum[0]){
        let attack = Math.floor((this.WIZ * Math.floor(Math.random() * (10 - 8 + 1) + 8))/10);
        console.log(`You cast Frizz!`);
        isDefeated = heroine.attackMonsterWIZ(attack);
        if(isDefeated){
          break;
        }
        i++;
      }

      promptUser();
    },
    crack(){
      let attack = Math.floor((this.WIZ * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);
      console.log(`You cast Crack!`);
      heroine.attackMonsterWIZ(attack);
      promptUser();
    },
    crag(){
      let attack = this.WIZ * 2;
      if(Math.random() > 0.5){
        console.log(`You cast Crag!`);
        heroine.attackMonsterWIZ(attack);
      }else{
        console.log(`You cast Crag...\nIt miss...`);
      }
      promptUser();
    },

}

const monster = {
    HP: 5,
    STR: 5,
    WIZ: 5,
    RIS: 5,
    Defeated: 0,
    HPGain: 0,

    getStatus(){
        console.log(`Monster:\nHP: ${monster.HP}\nSTR: ${monster.STR}\nWIZ: ${monster.WIZ}\nRiS: ${monster.RIS}\n`);
    },
    getEXP(){
        const ranNums = generateRandomIntegers(1 + monster.Defeated,3 + monster.Defeated,4);
        monster.HPGain += ranNums[0];
        monster.HP += ranNums[0] + this.HPGain;
        monster.STR += ranNums[1];
        monster.WIZ += ranNums[2];
        monster.RIS += ranNums[3];
        monster.Defeated += 0.15;
    },
}

function generateRandomIntegers(min, max, count) {
    const randomIntegers = [];
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
      randomIntegers.push(randomNumber);
    }
    return randomIntegers;
  }

function promptUser() {
    console.log(`Heroine HP: ${heroine.HP}`);
    console.log(`Monster HP: ${monster.HP}`);

    rl.question('1) Attack 2) Magic 3) Save 4) Status 5) Quit:\n', (command) => {
      switch (command) {
        case '1':
          console.log('You attack the monster...');
          heroine.attackMonsterSTR();
          break;
        case '2':
          console.log('Which spell will you use...');
          castSpell();
          break;
        case '3':
          console.log('Saving...');
          promptUser();
          break;
        case '4':
          status();
          break;
        case '5':
          console.log('Good Bye.');
          rl.close(); // Close the readline interface
          break;          
        default:
          console.log('Invalid Number, please try again');
          promptUser();
      }
    });
  }

  function castSpell() {
    rl.question('1) Frizz 2) Crack 3) Crag 4) Heal 5) Back:\n', (command) => {
      switch (command) {
        case '1':
          heroine.frizz();
          break;
        case '2':
          heroine.crack();
          break;
        case '3':
          heroine.crag();
          break;
        case '4':
          console.log('Heal!');
          promptUser();
          break;
        case '5':
          promptUser();
          break;  
        default:
          console.log('Invalid Number, please try again');
          castSpell();
      }
    });
  }

  function status() {
    rl.question('1) Heroin 2) Monster:\n', (command) => {
      switch (command) {
        case '1':
          heroine.getStatus();
          promptUser(); // Continue prompting
          break;
        case '2':
          monster.getStatus();
          promptUser();
          break;         
        default:
          console.log('Invalid Number, please try again');
          promptUser();
      }
    });
  }
  
  promptUser();