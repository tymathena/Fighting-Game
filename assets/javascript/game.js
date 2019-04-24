/*
All game aspects stored in game object

All JQuery and visual aspects in outer functions
*/
$(document).ready(function () {


    //game object
    const game = {
        chosenFighter: null,
        enemyFighter: null,
        availablePlayers: ["Chewbacca", "Obi Wan", "Qui-Gon", "Han Solo"],
        availableEnemies: ["Stormtrooper", "Droideka", "Darth Maul", "Darth Vader", "Sheev"],
        currBattleAttacks: 0,
        
        //character objects; store stats. specialAbility got cancelled
        Chewbacca: {
            attackPower: 15,
            defense: 25,
            penetration: 15,
            hp: 650,
            specialAbility: function () {

            }
        },

        ObiWan: {
            attackPower: 30,
            defense: 10,
            penetration: 10,
            hp: 400,
            specialAbility: function () {

            }
        },

        QuiGon: {
            attackPower: 10,
            defense: 30,
            penetration: 30,
            hp: 750,
            specialAbility: function () {

            }

        },

        Solo: {
            attackPower: 25,
            defense: 15,
            penetration: 15,
            hp: 550,
            specialAbility: function () {

            }
        },

        Stormtrooper: {
            attackPower: 2,
            defense: 5,
            penetration: 5,
            hp: 75,
            maxhp: 75,
            //stats rewarded for a kill: Power, Defense, Pen, HP
            bounty: [5, 5, 2, 20],
            //amount of times to fight
            num: 10,
            specialAbility: function () {

            }
        },

        Droideka: {
            attackPower: 10,
            defense: 20,
            penetration: 0,
            hp: 150,
            maxhp: 150,
            //stats rewarded for a kill: Power, Defense, Pen, HP
            bounty: [5, 10, 0, 50],
            //amount of times to fight
            num: 7,
            specialAbility: function () {

            }
        },

        Maul: {
            attackPower: 15,
            defense: 75,
            penetration: 5,
            hp: 750,
            maxhp: 750,
            //stats rewarded for a kill: Power, Defense, Pen, HP
            bounty: [5, 15, 2, 100],
            //amount of times to fight
            num: 2,
            specialAbility: function () {

            }
        },

        Vader: {
            attackPower: 50,
            defense: 7,
            penetration: 50,
            hp: 350,
            maxhp: 350,
            //stats rewarded for a kill: Power, Defense, Pen, HP
            bounty: [25, 0, 15, 20],
            //amount of times to fight
            num: 1,
            specialAbility: function () {

            }

        },

        Sheev: {
            attackPower: 90,
            defense: 50,
            penetration: 90,
            hp: 900,
            maxhp: 900,
            //stats rewarded for a kill: Power, Defense, Pen, HP
            bounty: [25, 25, 25, 100],
            //amount of times to fight
            num: 1,
            specialAbility: function () {

            }
        },
        //function to calculate damage dealt by player
        attack: function (ally, enemy) {
            var tempPen;
            if (ally.penetration > enemy.defense) {
                tempPen = enemy.defense;
            } else {
                tempPen = ally.penetration;
            }
            //clever little formula for damage mitigation to give diminishing returns. Prevents invincible characters.
            enemy.hp = Math.round(enemy.hp - ((100 * ally.attackPower) / ((enemy.defense - tempPen) + 100)));
            //console.log((100 * ally.attackPower) / (enemy.defense + 100 - ally.penetration));
            game.counterAttack(ally, enemy);
        },

        //function to calculate damage taken in return
        counterAttack: function (ally, enemy) {
            var tempPen;
            if (enemy.penetration > ally.defense) {
                tempPen = ally.defense;
            } else {
                tempPen = enemy.penetration;
            }

            ally.hp = Math.round(ally.hp - ((100 * enemy.attackPower) / ((ally.defense - tempPen) + 100)));
            console.log((100 * enemy.attackPower) / (ally.defense + 100 - enemy.penetration));
            game.renderFight();
        },

        //manages the actual fights in the game
        initFight: function () {

            //displays visuals 
            battleArea.attr("style", "display: initial;");
            console.log(game.chosenFighter)
            chosenEnemyObject = game[`${game.enemyFighter}`];
            chosenFighterObject = game[`${game.chosenFighter}`];
            game.renderFight();
            const buttonCol = $(`<div class="col-3"></div>`);
            buttonCol.append($(`<button class="attackBtn btnStyling">Attack</button>`))
            //buttonCol.append($(`<button class="retreatBtn btnStyling">Retreat</button>`))  //removed
            topArea.append(buttonCol);

            //click listener for attacking
            $(".attackBtn").on("click", function () {
                game.attack(chosenFighterObject, chosenEnemyObject);
                //if win 
                if(chosenEnemyObject.hp <= 0) {
                    chosenEnemyObject.hp = 0;
                    //Adds bounties to your stats
                    chosenFighterObject.attackPower += chosenEnemyObject.bounty[0];
                    alert(`You have gained ${chosenEnemyObject.bounty[0]} attack power!`)
                    chosenFighterObject.defense += chosenEnemyObject.bounty[1];
                    alert(`You have gained ${chosenEnemyObject.bounty[1]} defense!`)
                    chosenFighterObject.penetration += chosenEnemyObject.bounty[2];
                    alert(`You have gained ${chosenEnemyObject.bounty[2]} penetration!`)
                    chosenFighterObject.hp += chosenEnemyObject.bounty[3];
                    alert(`You have gained ${chosenEnemyObject.bounty[3]} HP!`)
                    chosenEnemyObject.hp = chosenEnemyObject.maxhp;
                    //setTimeout makes the game seem less jerky after a fight
                    setTimeout(game.multipleFightSelect, 750);
                //if loss
                } else if (chosenFighterObject.hp <= 0) {
                    setTimeout(game.loss, 1000);
                }
            });

        },

        //handles the portraits
        renderFight: function () {
            battleArea = $(`<div class = "containter"> </div>`)
            characterPortrait.html(`<div class = "col"><div class="card"><img src="./assets/images/${game.chosenFighter}.jpg" alt="${game.chosenFighter}" class="card-body" height="200px" width="150px"></div><h4>HP: ${chosenFighterObject.hp}</h4><br/>
              <h4>Attack Power: ${chosenFighterObject.attackPower}</h4><br/>
              <h4>Defense: ${chosenFighterObject.defense}</h4><br/>
              <h4>Penetration: ${chosenFighterObject.penetration}</h4></div>`);


            enemyPortrait.html(`<div class = "col-12"><div class="card"><img src="./assets/images/${game.enemyFighter}.jpg" alt="${game.enemyFighter}" class="card-body" height="200px" width="150px"></div><h4>HP: ${chosenEnemyObject.hp}</h4><br/>
              <h4>Attack Power: ${chosenEnemyObject.attackPower}</h4><br/>
              <h4>Defense: ${chosenEnemyObject.defense}</h4><br/>
              <h4>Penetration: ${chosenEnemyObject.penetration}</h4></div>`);
        },


        //renders the screen to select enemies without selecting allies
        multipleFightSelect: function () {
            enemyPortrait.empty();
            characterPortrait.empty();
            battleArea.attr("style", "display: none;");
            //brings back starting area and hides ally selector buttons and portraits
            $(".startingArea").attr("style", "display: initial;");
            $(".fighterSelect").attr("style", "display: none;");
            $(".allyBtn").attr("style", "display: none;");
            topArea.empty();
            battleArea.empty();

        },

        //you lose
        loss: function () {

            $("body").empty();
            alert("You have fallen. Refresh the page to start over.")
        }

    }

    //global variables
    let chosenFighterObject;
    let chosenEnemyObject;
    //console.log(chosenEnemyObject);
    let characterPortrait;
    let enemyPortrait;
    let battleArea = $(`<div class = "containter"> </div>`)
    let topArea = $(`<div class="row"></div>`)
    battleArea.append(topArea);
    let button = $(".selectCharacter");

    //click listener to manage the buttons to select characters. Works both initially and on multiple fights
    const characterButton = function () {
        value = $(this).attr("data-name"); //gets character picked
        currSelectionPlayer = $("#playerSelection");
        currSelectionEnemy = $("#enemySelection")
        topArea = $(`<div class="row"></div>`)
        battleArea = $(`<div class = "containter"> </div>`)
        //console.log(value);
        //if statements are obsolete because I changed the way I wanted select to work
        if (value === "Chewbacca") {
            game.chosenFighter = "Chewbacca";
            console.log(game.chosenFighter);
        } else if (value === "QuiGon") {
            game.chosenFighter = "QuiGon";
            console.log(game.chosenFighter)
        } else if (value === "ObiWan") {
            game.chosenFighter = "ObiWan";
            console.log(game.chosenFighter)
        } else if (value === "Solo") {
            game.chosenFighter = "Solo";
            console.log(game.chosenFighter)
        } else if (value === "Stormtrooper") {
            game.enemyFighter = "Stormtrooper";
            console.log(game.enemyFighter)
        } else if (value === "Droideka") {
            game.enemyFighter = "Droideka";
            console.log(game.enemyFighter)
        } else if (value === "Maul") {
            game.enemyFighter = "Maul";
            console.log(game.enemyFighter)
        } else if (value === "Vader") {
            game.enemyFighter = "Vader";
            console.log(game.enemyFighter)
        } else if (value === "Sheev") {
            game.enemyFighter = "Sheev";
            console.log(game.enemyFighter)
        } else if (value === "confirm") {
            resetBattleArea();
            game.initFight();
        }
        currSelectionPlayer.text(`Currently Selected: ${game.chosenFighter}`);
        currSelectionEnemy.text(`Currently Fighting: ${game.enemyFighter}`);
    }

    //renders the second or later fight
    function resetBattleArea () {
        battleArea = $(`<div class = "containter"> </div>`)
        topArea = $(`<div class="row"></div>`)
        battleArea.append(topArea);
        button = $(".selectCharacter");
        $("header").attr("style", "display: none;");
        $(".startingArea").attr("style", "display: none;");
        $("body").append(battleArea);
        characterPortrait = $(`<div class = "col"><div class="card"><img src="./assets/images/${game.chosenFighter}.jpg" alt="${game.chosenFighter}" class="card-body" height="200px" width="150px"></div></div>`)
        battleArea.append($(`<div class = "row"></div>`));
        enemyPortrait = $(`<div class = "col-12"><div class="card"><img src="./assets/images/${game.enemyFighter}.jpg" alt="${game.enemyFighter}" class="card-body" height="200px" width="150px"></div></div>`)
        topArea.append(characterPortrait);
        battleArea.append(enemyPortrait);
    }
    

    button.on("click", characterButton);
 
});