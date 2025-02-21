const readline = require("readline");
const file = require('fs');

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
    HighScore: 0,

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
        }else{
            console.log(`Monster takes ${damage} damage!`);
            console.log(`The monster has been defeated!`);
            heroine.getEXP();
            monster.getEXP();   
        }

        monster.attackHeroine(1);
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

      monster.attackHeroine(1);
    },
    crack(){
      let attack = Math.floor((this.WIZ * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);
      console.log(`You cast Crack!`);
      heroine.attackMonsterWIZ(attack);

      monster.attackHeroine(1);
    },
    crag(){
      let attack = this.WIZ * 2;
      if(Math.random() > 0.5){
        console.log(`You cast Crag!`);
        heroine.attackMonsterWIZ(attack);
      }else{
        console.log(`You cast Crag...\nIt miss...`);
      }

      monster.attackHeroine(1);
    },
    heal(){
      let heal = Math.floor((this.WIZ * Math.floor(Math.random() * (12 - 6 + 1) + 6))/10);
      let heroineHP = heroine.HP;

      heroineHP += heal;

      if(heroineHP > heroine.MAXHP){
        heroine.HP = heroine.MAXHP;
        console.log(`You cast heal!`);
        console.log(`You heal ${heal} HP.`);
        console.log(`You're feeling healthy!`);
      }else{
        heroine.HP = heroineHP;
        console.log(`You cast heal!`);
        console.log(`You heal ${heal} HP.`);
      }

      monster.attackHeroine(0.75);
    },

    dead(){
      console.log(`You've died... T_T\n${Math.ceil(heroine.Defeated*10)} Monster defeated.`);

      if(this.Defeated > this.HighScore){
        this.HighScore = this.Defeated;
        console.log(`You got the new high score of ${this.HighScore*10}`);
      }else{
        console.log(`You did not beat the high score of: ${this.HighScore*10}`);
      }

      heroine.default();
      monster.default();

      saveGame();
    },

    default(){
      this.HP = 10;
      this.MAXHP = 10; 
      this.STR = 10;
      this.RIS = 10;
      this.WIZ = 10;
      this.Defeated = 0;
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
        monster.Defeated += 0.11;
    },

    attackHeroine(debuff){
        const attackType = Math.random();
        let heroineHP = heroine.HP;
        const heroineRIS = heroine.RIS;
        const heroineWIZ = heroine.WIZ;

        if(attackType == 0 ){
          console.log(`The monster trips and falls down!`);
        }else if( attackType > 0.5 && attackType != 0){
          //str
          let attack = Math.floor((this.STR * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);
          let damage = attack - heroineRIS;
          damage *= debuff;

          if(damage < 0){
            damage = 0
          }

          heroineHP -= Math.ceil(damage);
          heroine.HP = heroineHP;

          console.log(`The Heroine takes ${damage}.`);
        }else{
          //wiz
          let attack = Math.floor((this.STR * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);
          let damage = attack - heroineWIZ;
          damage *= debuff;

          if(damage < 0){
            damage = 0
          }

          heroineHP -= Math.ceil(damage);
          heroine.HP = heroineHP;

          console.log(`The Heroine takes ${damage}.`);
        }

        if(heroine.HP <= 0){
          heroine.dead();
        }else{
          promptUser();
        }
    },

    default(){
      this.HP = 5;
      this.HPGain = 0; 
      this.STR = 5;
      this.RIS = 5;
      this.WIZ = 5;
      this.Defeated = 0;
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

    rl.question('1) Attack 2) Magic 3) Save/Load 4) Status 5) Quit:\n', (command) => {
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
          saveLoad();
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
          heroine.heal();
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
          status();
      }
    });
  }

  function continueGame() {
    rl.question('1) Continue 2) Quit:\n', (command) => {
      switch (command) {
        case '1':
          promptUser(); 
          break;
        case '2':
          console.log('Good Bye.');
          rl.close();
          break;         
        default:
          console.log('Invalid Number, please try again');
          gameOver();
      }
    });
  } 

  function saveLoad() {
    rl.question('1) Save Game 2) Load Game:\n', (command) => {
      switch (command) {
        case '1':
          saveGame(); 
          break;
        case '2':
          loadGame();
          break;         
        default:
          console.log('Invalid Number, please try again');
          gameOver();
      }
    });
  } 

  function saveGame(){
    const pathHeroine = "./Heroine.json"
    const dataHeroine = {
      HP: heroine.HP,
      MAXHP: heroine.MAXHP,
      STR: heroine.STR,
      WIZ: heroine.WIZ,
      RIS: heroine.RIS,
      Defeated: heroine.Defeated,
      HighScore: heroine.HighScore,
    };

    const pathMonster = "./Monster.json";
    const dataMonster = {
      HP: monster.HP,
      STR: monster.STR,
      WIZ: monster.WIZ,
      RIS: monster.RIS,
      Defeated: monster.Defeated,
      HPGain: monster.HPGain,
    };


    try {
      console.log("Saving...");
      file.writeFileSync(pathHeroine, JSON.stringify(dataHeroine, null, 2), 'utf8');
      file.writeFileSync(pathMonster, JSON.stringify(dataMonster, null, 2), 'utf8');
      console.log("Save completed");
      continueGame();
    } catch (error) {
      console.log("Save has errored!!!");
      console.log(error);
      rl.close();
    }
  }

  function loadGame(){
    const dataHeroine = file.readFileSync("./Heroine.json");
    const dataHeroineParse = JSON.parse(dataHeroine);
    heroine.HP = dataHeroineParse.HP;
    heroine.MAXHP = dataHeroineParse.MAXHP;
    heroine.STR = dataHeroineParse.STR;
    heroine.WIZ = dataHeroineParse.WIZ;
    heroine.RIS = dataHeroineParse.RIS;
    heroine.Defeated = dataHeroineParse.Defeated;
    heroine.HighScore = dataHeroineParse.HighScore;

    const dataMonster = file.readFileSync("./Monster.json");
    const dataMonsterParse = JSON.parse(dataMonster);
    monster.HP = dataMonsterParse.HP;
    monster.STR = dataMonsterParse.STR;
    monster.WIZ = dataMonsterParse.WIZ;
    monster.RIS = dataMonsterParse.RIS;
    monster.Defeated = dataMonsterParse.Defeated;
    monster.HPGain = dataMonsterParse.HPGain;

    promptUser();
  }
  
loadGame();