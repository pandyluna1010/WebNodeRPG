// import the package that let's me read the reply from the cmd line
const readline = require("readline");

// import the package that reads and writes files for the save and load functions
const file = require('fs');

// create interface for the cmd line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// the heroine object for the game
const heroine = {

    // stats for the heroine
    HP: 10,
    MAXHP: 10,
    STR: 10,
    WIZ: 10,
    RIS: 10,
    Defeated: 0,
    HighScore: 0,

    // gets the status for the heroine
    getStatus(){
        console.log(`Heroine:\nHP: ${heroine.HP}\nSTR: ${heroine.STR}\nWIZ: ${heroine.WIZ}\nRiS: ${heroine.RIS}\nMonsters Defeated: ${heroine.Defeated * 10}\n`);
    },
    // exp gain after the heroine defeats a monster
    getEXP(){
        // generate random stats boost for the level up, inceasing the min and max stat gain based on number of monsters defeated
        const ranNums = generateRandomIntegers(0 + this.Defeated,3 + this.Defeated,4);
        heroine.MAXHP += ranNums[0];
        heroine.STR += ranNums[1];
        heroine.WIZ += ranNums[2];
        heroine.RIS += ranNums[3];
        heroine.Defeated += 0.1;
    },

    // attacks the monster with a str based attack
    attackMonsterSTR(){
        // cal the attack amount
        const attack = Math.floor((this.STR * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);

        // get the monster's hp and ris
        let monHP = monster.HP;
        const monRIS = monster.RIS;

        // cal the damage the monster will take
        let damage = attack - monRIS;

        // makes sure the damage amount is above zero so it doesn't end up healing the monster
        if(damage < 0){
            damage = 0
        }
        
        // monster takes damge
        monHP -= damage;

        // checks if the monster is defeated or not
        if(monHP > 0){
            // monster isn't defeated output the damage they took and set their HP
            console.log(`Monster takes ${damage} damage!`);
            monster.HP = monHP;
        }else{
            // output the damage they took and that the monster is defeated
            console.log(`Monster takes ${damage} damage!`);
            console.log(`The monster has been defeated!`);

            // level up the heroine and monster
            heroine.getEXP();
            monster.getEXP();   
        }

        // monster turn to attack, with base debuff
        monster.attackHeroine(1);
    },
    // heroine attacks the monster with magic with passed in attack value
    attackMonsterWIZ(attack){

      // bool to return that checks if the attack defeated the monster
      isDefeated = false;

      // gets the monster HP and WIZ
      let monHP = monster.HP;
      const monWIZ = monster.WIZ;

      // The damge the monster will take
      let damage = attack - monWIZ;

      // makes sure the damage amount is above zero so it doesn't end up healing the monster
      if(damage < 0){
          damage = 0
      }
      
      // monster takes damage
      monHP -= damage;

      // checks if the monster is defeated or not
      if(monHP > 0){
        // output the damage the monster took and sets it's HP
        console.log(`Monster takes ${damage} damage!`);
        monster.HP = monHP;
      }else{
        // output the damage the monster took and that it was defeated
        console.log(`Monster takes ${damage} damage!`);
        console.log(`The monster has been defeated!`);

        // level up the heroine the monster
        heroine.getEXP();
        monster.getEXP();
        isDefeated = true
      }
      return isDefeated;
    },

    // code for the frizz spell
    frizz(){

      // generate the number of time frizz will be cast, min 2, max 5
      const castNum = generateRandomIntegers(2,5,1);
      let i = 0;

      // cast frizz a number of times
      while(i < castNum[0]){
        // generate attack amount for frizz
        let attack = Math.floor((this.WIZ * Math.floor(Math.random() * (10 - 8 + 1) + 8))/10);

        // output that you casted frizz
        console.log(`You cast Frizz!`);

        // pass in the attack value into the attackMonsterWiz function and get if it defeated the monster
        isDefeated = heroine.attackMonsterWIZ(attack);

        // if monster is defeated break out of while loop
        if(isDefeated){
          break;
        }
        i++;
      }

      // monster turn to attack, with base debuff
      monster.attackHeroine(1);
    },
    // code of the crack spell
    crack(){
      // generate the attack amount
      let attack = Math.floor((this.WIZ * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);

      // output that you casted crack
      console.log(`You cast Crack!`);

      // have the heroine cast the spell with the passed in attack value
      heroine.attackMonsterWIZ(attack);

      // monster turn to attack, with base debuff
      monster.attackHeroine(1);
    },
    // code for the crag spell
    crag(){
      // set the attack value
      let attack = this.WIZ * 2;

      // check if the spell hits or misses
      if(Math.random() > 0.5){
        // output that you cast the spell and passed in the attack value to cast it
        console.log(`You cast Crag!`);
        heroine.attackMonsterWIZ(attack);
      }else{
        // output that that you missed the spell
        console.log(`You cast Crag...\nIt miss...`);
      }

      // monster turn to attack, with base debuff
      monster.attackHeroine(1);
    },
    // code for the heal spell
    heal(){
      // genrate the amount to heal
      let heal = Math.floor((this.WIZ * Math.floor(Math.random() * (12 - 6 + 1) + 6))/10);

      // get the current amount of hp
      let heroineHP = heroine.HP;

      // adds the heal amount to the heroine's hp
      heroineHP += heal;

      // checks if they overhealed or not
      if(heroineHP > heroine.MAXHP){
        // set to their max hp
        heroine.HP = heroine.MAXHP;

        // outputs that you casted heal, how much you healed, and that you hit the max hp
        console.log(`You cast heal!`);
        console.log(`You heal ${heal} HP.`);
        console.log(`You're feeling healthy!`);
      }else{
        // set heroine hp to new hp
        heroine.HP = heroineHP;

        // output that you casted heal, and how much you healed
        console.log(`You cast heal!`);
        console.log(`You heal ${heal} HP.`);
      }

      // monster attack with a debuff as to not undo all the healing
      monster.attackHeroine(0.75);
    },

    // code for when you die
    dead(){
      // output that you've died and how many monsters you've defeated
      console.log(`You've died... T_T\n${Math.ceil(heroine.Defeated*10)} Monster defeated.`);

      // checks if you beat the high score or not
      if(this.Defeated > this.HighScore){
        // new high score
        this.HighScore = Math.ceil(this.Defeated);
        console.log(`You got the new high score of ${Math.ceil(this.HighScore*10)}`);
      }else{
        // not the new high score
        console.log(`You did not beat the high score of: ${Math.ceil(this.HighScore*10)}`);
      }

      // set the stats of the heroine and monster to their defaults
      heroine.default();
      monster.default();

      // saves the high score
      saveGame();
    },

    // set the stats to their default vaules
    default(){
      this.HP = 10;
      this.MAXHP = 10; 
      this.STR = 10;
      this.RIS = 10;
      this.WIZ = 10;
      this.Defeated = 0;
    },
}

// code for the monster object
const monster = {

    // starting stats for the monster
    HP: 5,
    STR: 5,
    WIZ: 5,
    RIS: 5,
    Defeated: 0,
    HPGain: 0,

    // get the status for the current monster
    getStatus(){
        console.log(`Monster:\nHP: ${monster.HP}\nSTR: ${monster.STR}\nWIZ: ${monster.WIZ}\nRiS: ${monster.RIS}\n`);
    },
    // level up the monster's stats
    getEXP(){
        // generate the stat increases, set slightly higher than the heroine so the monster gets stronger faster
        const ranNums = generateRandomIntegers(1 + monster.Defeated,3 + monster.Defeated,4);
        monster.HPGain += ranNums[0];
        monster.HP += ranNums[0] + this.HPGain;
        monster.STR += ranNums[1];
        monster.WIZ += ranNums[2];
        monster.RIS += ranNums[3];
        monster.Defeated += 0.11;
    },

    // code for attacking the heroine
    attackHeroine(debuff){
        // grab a random number to see what type of attack that monster will do
        const attackType = Math.random();

        // gets the heroine's hp, ris, and wiz
        let heroineHP = heroine.HP;
        const heroineRIS = heroine.RIS;
        const heroineWIZ = heroine.WIZ;

        // if the number was zero the monster trips, if it's less then 0.5 it's str based, if it's above that it's wiz based
        if(attackType == 0 ){
          console.log(`The monster trips and falls down!`);
        }else if( attackType < 0.5 && attackType != 0){
          //str
          // generate attack amount
          let attack = Math.floor((this.STR * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);

          // do damage cal for ris and debuff
          let damage = attack - heroineRIS;
          damage *= debuff;

          // makes sure the damage amount is above zero so it doesn't end up healing the monster
          if(damage < 0){
            damage = 0
          }

          // makes sure that the damage is a whole number, and then take it away from the heroine's hp 
          heroineHP -= Math.ceil(damage);
          heroine.HP = heroineHP;

          // output how much damage the heroine took
          console.log(`The Heroine takes ${Math.ceil(damage)}.`);
        }else{
          //wiz
          //generate attack amount
          let attack = Math.floor((this.STR * Math.floor(Math.random() * (14 - 8 + 1) + 8))/10);

          // do damage cal for wiz and debuff
          let damage = attack - heroineWIZ;
          damage *= debuff;

          // makes sure the damage amount is above zero so it doesn't end up healing the monster
          if(damage < 0){
            damage = 0
          }

          // makes sure that the damage is a whole number, and then take it away from the heroine's hp 
          heroineHP -= Math.ceil(damage);
          heroine.HP = heroineHP;

          // output how much damage the heroine took
          console.log(`The Heroine takes ${Math.ceil(damage)}.`);
        }

        // checks if the heroine is defeated or not
        if(heroine.HP <= 0){
          heroine.dead();
        }else{
          promptUser();
        }
    },

    // set monster's stat to default amounts
    default(){
      this.HP = 5;
      this.HPGain = 0; 
      this.STR = 5;
      this.RIS = 5;
      this.WIZ = 5;
      this.Defeated = 0;
    },
}

// generate a set number of random intergers between two number, stolen from google 
function generateRandomIntegers(min, max, count) {
    const randomIntegers = [];
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.floor(Math.random() * (max - min + 1)) + min);
      randomIntegers.push(randomNumber);
    }
    return randomIntegers;
  }

// prompt user for basic game loop
function promptUser() {
    // output the heroine's and monster's hp
    console.log(`Heroine HP: ${heroine.HP}`);
    console.log(`Monster HP: ${monster.HP}`);

    // ask the player what action they wish to do
    rl.question('1) Attack 2) Magic 3) Save/Load 4) Status 5) Quit:\n', (command) => {
      switch (command) {
        case '1':
        case 'l':
          // attack monster
          console.log('You attack the monster...');
          heroine.attackMonsterSTR();
          break;
        case '2':
        case ';':
          // ask which spell they wish to use
          console.log('Which spell will you use...');
          castSpell();
          break;
        case '3':
        case '\'':
          // ask if they would like to save or load game
          saveLoad();
          break;
        case '4':
        case 'o':
          // ask if they would like to see heroine or monster status
          status();
          break;
        case '5':
        case 'p':
          // cloes the game
          console.log('Good Bye.');
          rl.close(); // Close the readline interface
          break;          
        default:
          // loops the prompt
          console.log('Invalid Number, please try again');
          promptUser();
      }
    });
  }

  // prompt the user for which spell they want to use, and yes the spell names are from dragon quest.  
  function castSpell() {
    rl.question('1) Frizz 2) Crack 3) Crag 4) Heal 5) Back:\n', (command) => {
      switch (command) {
        case '1':
        case 'l':
          // cast frizz
          heroine.frizz();
          break;
        case '2':
        case ';':
          // cast crack
          heroine.crack();
          break;
        case '3':
        case '\'':
          // cast crag
          heroine.crag();
          break;
        case '4':
        case 'o':
          // cast heal
          heroine.heal();
          break;
        case '5':
        case 'p':
          // goes back to prompt user
          promptUser();
          break;  
        default:
          // loops cast spell prompt
          console.log('Invalid Number, please try again');
          castSpell();
      }
    });
  }

  // prompts the player which one they wish to see the status of 
  function status() {
    rl.question('1) Heroin 2) Monster:\n', (command) => {
      switch (command) {
        case '1':
        case 'l':
          // gets heroine's status
          heroine.getStatus();
          promptUser(); // Continue prompting
          break;
        case '2':
        case ';':
          // gets monster status
          monster.getStatus();
          promptUser(); // Continue prompting
          break;         
        default:
          // loops the status prompts
          console.log('Invalid Number, please try again');
          status();
      }
    });
  }

  // prompts the player if they want to continue playing the game
  function continueGame() {
    rl.question('1) Continue 2) Quit:\n', (command) => {
      switch (command) {
        case '1':
        case 'l':
          // contines
          promptUser(); 
          break;
        case '2':
        case ';':
          // quits
          console.log('Good Bye.');
          rl.close();
          break;         
        default:
          // loops
          console.log('Invalid Number, please try again');
          continueGame();
      }
    });
  } 

  // prompts for the save game and load game functions
  function saveLoad() {
    rl.question('1) Save Game 2) Load Game:\n', (command) => {
      switch (command) {
        case '1':
        case 'l':
          // save game
          saveGame(); 
          break;
        case '2':
        case ';':
          //load game
          loadGame();
          break;         
        default:
          // loops prompts
          console.log('Invalid Number, please try again');
          saveLoad();
      }
    });
  } 

  // code for saving the game
  function saveGame(){
    // file path that the heroine will be saved to
    const pathHeroine = "./Heroine.json"

    // the object of the current heroine
    const dataHeroine = {
      HP: heroine.HP,
      MAXHP: heroine.MAXHP,
      STR: heroine.STR,
      WIZ: heroine.WIZ,
      RIS: heroine.RIS,
      Defeated: heroine.Defeated,
      HighScore: heroine.HighScore,
    };

    // file path that the monster will be saved to
    const pathMonster = "./Monster.json";

    // the object of the current monster
    const dataMonster = {
      HP: monster.HP,
      STR: monster.STR,
      WIZ: monster.WIZ,
      RIS: monster.RIS,
      Defeated: monster.Defeated,
      HPGain: monster.HPGain,
    };


    // try catch in case something breaks
    try {
      console.log("Saving...");
      // writes the heroine and monster objects to their files
      file.writeFileSync(pathHeroine, JSON.stringify(dataHeroine, null, 2), 'utf8');
      file.writeFileSync(pathMonster, JSON.stringify(dataMonster, null, 2), 'utf8');
      console.log("Save completed");

      // ask if they want to continue playing
      continueGame();
    } catch (error) {
      // something broke
      console.log("Save has errored!!!");

      // shows the error
      console.log(error);

      // closes the prompts to the player
      rl.close();
    }
  }

  // loads the game from the files
  function loadGame(){
    // file paths for the heroine and monster json files
    const heroinePath = "./Heroine.json";
    const monsterPath = "./Monster.json";

    // check if the files exists, if not run save game to create them
    if(!file.existsSync(heroinePath) || !file.existsSync(monsterPath)){
      saveGame();
    }

    // reads the data from the heroine file
    const dataHeroine = file.readFileSync("./Heroine.json");
    // parse the heroine data into a json object
    const dataHeroineParse = JSON.parse(dataHeroine);

    // set heroine stats to the json object
    heroine.HP = dataHeroineParse.HP;
    heroine.MAXHP = dataHeroineParse.MAXHP;
    heroine.STR = dataHeroineParse.STR;
    heroine.WIZ = dataHeroineParse.WIZ;
    heroine.RIS = dataHeroineParse.RIS;
    heroine.Defeated = dataHeroineParse.Defeated;
    heroine.HighScore = dataHeroineParse.HighScore;

    // read the data from the monster file
    const dataMonster = file.readFileSync("./Monster.json");
    // parse the monster data into a json object
    const dataMonsterParse = JSON.parse(dataMonster);

    // set heroine stats to the json object
    monster.HP = dataMonsterParse.HP;
    monster.STR = dataMonsterParse.STR;
    monster.WIZ = dataMonsterParse.WIZ;
    monster.RIS = dataMonsterParse.RIS;
    monster.Defeated = dataMonsterParse.Defeated;
    monster.HPGain = dataMonsterParse.HPGain;

    // starts the prompt loops for the player
    promptUser();
  }
  
// loads the high score and last stats of the heroine and monster
loadGame();