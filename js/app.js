/*

    Constants
    Suit: Suit of card
    Rank: Rank of card
    Card: Suit and Rank representing a playing card

*/

// Numbers that represent suit of a playing card
const Suit = {
    SPADES: 1,
    CLUBS: 2,
    HEARTS: 3,
    DIAMONDS: 4,
}

// Numbers that represent rank of a playing card
const Rank = {
    ACE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13
}

// Make the Suit and Rank objects immutable
Object.freeze(Suit)
Object.freeze(Rank)

// Card class is represented by suit and rank constant that represents a playing card
class Card{

    // Constructor accepts two values suit and rank, and will assign those variables to this class
    constructor(suit, rank){
        this.suit = suit
        this.rank = rank
    }

    // returns suit of the deck in string form
    getSuit(){
        return Object.keys(Suit)[this.suit - 1]
    }

    // returns rank of the deck in string form
    getRank(){
        return Object.keys(Rank)[this.rank - 1]
    }

}

/*

    DOM Elements

*/
// Main Menu Buttons
const mainMenuEl = document.getElementById(`main-menu`)
const startGameEl = document.getElementById(`start-game`)
const playerNumberEl = document.querySelector(`select`)
const changeModeEl = document.getElementById(`change-mode`)

// Game Buttons
const allButtonEls = document.querySelectorAll(`button`)
const buttonEls = document.querySelectorAll(`#buttons > button`)
const raiseButtonEl = document.getElementById(`raise`)
const checkButtonEl = document.getElementById(`check`)
const mainMenuButtonEl = document.getElementById(`goto-main`)
const foldButtonEl = document.getElementById(`fold`)

// Table Elements
const tableEl = document.getElementById(`table`)
const tableCard0El = document.getElementById(`table-card-0`)
const tableCard1El = document.getElementById(`table-card-1`)
const tableCard2El = document.getElementById(`table-card-2`)
const tableCard3El = document.getElementById(`table-card-3`)
const tableCard4El = document.getElementById(`table-card-4`)
const winnersEl = document.querySelector(`h2`)
const resultsEl = document.querySelector(`h3`)

// Player Elements
const player1El = document.getElementById(`player1`)
const player2El = document.getElementById(`player2`)
const player3El = document.getElementById(`player3`)
const player4El = document.getElementById(`player4`)
const player5El = document.getElementById(`player5`)
const player6El = document.getElementById(`player6`)
const player7El = document.getElementById(`player7`)

/*

    Variables
    deck: array representing 52 cards (deck)
    tableCards: cards displayed on the table
    stage: determines how many cards are to be shown in the table
    startingMoney: Amount of money each player starts out with
    numberOfPlayers: self-explanatory, but changes accoring to the number you chose on the main screen.
    minimumBet: Minimum amount of money a player must bet in each round
    originalMinimumBet: minimumBet that does not change. Useful for calculating how many times to multiply the bets based on how many players are out.
    players: list of player objects that each consist of the following:
        name: identifier of player
        money: amount of money a player has
        bet: amount of money a player bet on a turn
        cards: cards that a player is holding in his or her hand
        handRank: number assigned to a player that designates hand rank after river is revealed
        score: strength of hand written in number format
        kicker: tiebreakers for hands with same score
    winningPlayers: Player(s) with the highest score at the end of a round. If there are more than 1 winning players, split the pot.
    heroWins: true if hero (you) is the last person standing.
    
*/
let deck = []
let tableCards = []
let stage = 0
let startingMoney = 10000
let numberOfPlayers
let minimumBet
let originalMinimumBet
let players = []
let winningPlayers = []
let heroWins = false
let gameOver = false
let darkMode = false

/*

    Event Listeners

*/
// When the text on top right is clicked, change to dark mode
changeModeEl.addEventListener(`click`, function(){
    
    const imageEls = document.querySelectorAll(`#title > img`)

    if (!darkMode){

        darkMode = true
        changeModeEl.innerText = `Light Mode`

        // Give dark-mode class to body and all buttons
        document.body.classList.add(`dark-mode`)
        changeModeEl.classList.add(`dark-mode`)
        
        for (const buttonEl of allButtonEls)
            buttonEl.classList.add(`dark-mode`)

        for (const imageEl of imageEls){
            imageEl.src = "./img/gold-coin.gif" // change main page spinning image
            imageEl.classList.add(`dark-mode`)
        }

        // Update face down cards
        for (let i=1; i<numberOfPlayers; i++){
            if (stage < 4 && player[i].cards1 != null) {
                document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/purple_back.png" alt="Table card slot 1">`
                document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/purple_back.png" alt="Table card slot 1">`
            }
        }

    }
    else { // darkMode == true

        darkMode = false
        changeModeEl.innerText = `Dark Mode`

        // Remove dark-mode class from body and all buttons
        document.body.classList.remove(`dark-mode`)
        changeModeEl.classList.remove(`dark-mode`)

        for (const buttonEl of allButtonEls)
            buttonEl.classList.remove(`dark-mode`)

        for (const imageEl of imageEls){
            imageEl.src = "./img/poker-chip.gif" // change main page spinning image
            imageEl.classList.remove(`dark-mode`)
        }

        // Update face down cards
        for (let i=1; i<numberOfPlayers; i++){
            if (stage < 4 && player[i].cards1 != null) {
                document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/blue_back.png" alt="Table card slot 1">`
                document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/blue_back.png" alt="Table card slot 1">`
            }
        }

    }

})

// Triggered when main menu button is pressed to go back to the main menu.
// Alerts the user if they really want to go back to prevent players from accidentally going back to the main menu.
mainMenuButtonEl.addEventListener(`click`, function(){

    if (heroWins)
        init()
    else if (gameOver)
        init()
    else if (window.confirm(`Going back to the main menu will reset the entire game.\nAre you sure you want to go back?`))
        init()

})

// Triggered when start game button is pressed.
// Creates amount of new players equal to number of players you chose on the main screen, and starts the board fresh.
startGameEl.addEventListener(`click`, function(){

    numberOfPlayers = playerNumberEl.value
    minimumBet = Math.round(startingMoney / (20 * numberOfPlayers))
    originalMinimumBet = minimumBet

    players = [{
        name: 'Hero',
        money: startingMoney,
        blind: null,
        bet: 0,
        card1: null,
        card2: null,
        handRank: null,
        score: 0,
        kicker: null
    }]

    for (let i=1; i<numberOfPlayers; i++){
        players.push({
                name: `Villain ${i}`,
                money: startingMoney,
                blind: null,
                bet: 0,
                card1: null,
                card2: null,
                handRank: null,
                score: 0,
                kicker: null
        })
    }

    resetTable()
    render()

})

// Helper function for event triggered after check and raise buttons.
// Progresses stage of the game to turn over cards and wait for bets.
function nextStage(){

    switch (stage){

        case 0: // flop
            stage = 1
            deck.pop() // burn card
            tableCards.push(deck.pop())
            tableCards.push(deck.pop())
            tableCards.push(deck.pop())
            break

        case 1: // turn
            stage = 2
            deck.pop()
            tableCards.push(deck.pop())
            break

        case 2: // river
            numberOfPlayers == 1 ? stage = 4 : stage = 3
            deck.pop()
            tableCards.push(deck.pop())
            break

        case 3: // final round of bet
            stage = 4
            break

        default:
            stage = 0
            resetTable()
            break

    }

}

// Triggered when check button is pressed (no additional bet)
checkButtonEl.addEventListener(`click`, function(){
    
    nextStage()
    render()

})

// Triggered when raise button is pressed for additional betting.
// Alerts the user towards making correct amount of bet.
raiseButtonEl.addEventListener(`click`, function(){

    let additionalBet = parseInt(prompt(`How much do you want to increase your bet by?\nMinimum bet: ${minimumBet} (All-in is OK)\nNote: Decimal inputs are rounded down.`))

    // Function to properly change player's bet and money amounts after additional bet is made
    const bet = (player) => {
        if (player.money >= additionalBet){
            player.money -= additionalBet
            player.bet += additionalBet
        }
        else {
            let leftover = player.money
            player.money -= leftover
            player.bet += leftover
        }
    }

    // Move onto the next stage if valid number is entered
    let validNumberEntered = false

    // Sanity checks
    // If additional bet is less than minimum bet, and that additional bet is not going all in, alert the user of incorrect betting amount.
    if (additionalBet < minimumBet){
        if (additionalBet != players[0].money)
            alert("Please place your bet greater than the minimum required or go all-in.")
        else{ // valid number entered (all in)
            players.forEach(bet)
            validNumberEntered = true
        }
    }
    else if (additionalBet > players[0].money)
        alert("You do not have that much money to bet!")
    else if (isNaN(additionalBet))
        alert("Please enter a valid number!")
    else{ // valid number entered
        players.forEach(bet)
        validNumberEntered = true
    }

    if (validNumberEntered)
        nextStage()

    render()

})

// Triggered when fold button is pressed to give up your hand
// Alerts the user to confirm to prevent players from accidentally folding
foldButtonEl.addEventListener(`click`, function(){

    if (window.confirm(`Are you sure you want to give up your hand?`)){

        if (numberOfPlayers > 1){

            // Sets winning player to a random villain if there is more than 1 player
            let winningPlayer = Math.ceil(Math.random() * numberOfPlayers)
            winningPlayers.push(`Villain ${winningPlayer}`)
            
            players.forEach(function(player){
                if (winningPlayers.includes(player.name))
                    // "winning" player all the money from each player's bet
                    player.money += players.reduce((total, player) => total + player.bet, 0)
            })

        }

        resetTable()
        render()

    }

})

/*

    Functions
    newDeck(): Populates the deck array with 52 new cards
    shuffle(): Shuffles the card
    resetTable(): Resets table status, reshuffles deck, and assigns fresh hands to players
    init(): Initializes game and shows beginning game screen
    render(): Renders game state information to the screen

*/

// Creates a fresh deck of 52 card objects created using card class
function newDeck(){

    deck = []

    for (let i=1; i<=Object.values(Suit).length; i++)
        for (let j=1; j<=Object.values(Rank).length; j++)
            deck.push(new Card(i, j))

}

// Initializes game and shows beginning game screen
function init(){

    // Initial state. Show main menu and hide game state.
    mainMenuEl.hidden = false

    tableEl.hidden = true
    for (const buttonEl of buttonEls)
        buttonEl.hidden = true

    // Prevents start button from melding with background
    if (darkMode){
        startGameEl.classList.remove(`dark-mode`)
        startGameEl.classList.add(`dark-mode`)
    }
    else { // darkMode == false
        startGameEl.classList.add(`dark-mode`)
        startGameEl.classList.remove(`dark-mode`)
    }

    // reset all players other than you
    players.length = 1
    player1El.hidden = true
    player2El.hidden = true
    player3El.hidden = true
    player4El.hidden = true
    player5El.hidden = true
    player6El.hidden = true
    player7El.hidden = true

    // reset game winning and game over status
    heroWins = false
    gameOver = false
    winnersEl.innerText = ``

}

// Uses Fisher-Yates algorithm to shuffle, then the deck is split and rejoined,
// Do this process many times to get a good shuffle, like a human would divide the deck many times to shuffle.
function shuffle(){

    let randomTimes = 10

    for (let r = 0; r < randomTimes; r++){

        for (let i = 0; i < deck.length; i++){

            let j = Math.floor(Math.random() * (deck.length - i))

            let shuffledDeck = deck[i]
            deck[i] = deck[j]
            deck[j] = shuffledDeck

            let randomSlicer = Math.floor(Math.random() * deck.length)
            let partOne = deck.slice(0, randomSlicer)
            let partTwo = deck.slice(randomSlicer, deck.length)
            deck = partTwo.concat(partOne)

        }

    }

}

// Resets table status, reshuffles deck, and assigns fresh hand to players
function resetTable(){

    // Reset table status
    tableCard0El.innerHTML = ``
    tableCard1El.innerHTML = ``
    tableCard2El.innerHTML = ``
    tableCard3El.innerHTML = ``
    tableCard4El.innerHTML = ``
    resultsEl.innerText = ``

    // Reshuffle deck and reset game state
    newDeck()
    shuffle()
    tableCards = []
    stage = 0

    // prevent from going to game over status if there is only 1 player
    if (numberOfPlayers == 1)
        players[0].money = startingMoney

    minimumBet = originalMinimumBet

    // Multiply minimum bet by 2 for each player that's out of the game
    for (let i=0; i<numberOfPlayers; i++){
        if (players[i].money <= 0)
            minimumBet *= 2
    }

    for (let i=0; i<numberOfPlayers; i++){

        // reset hand rank of each player
        players[i].handRank = ``
        players[i].score = 0
        players[i].card1 = null
        players[i].card2 = null
        players[i].kicker = null

        // assign fresh hand to each player if player has enough money
        if (players[i].money > 0){
            players[i].card1 = deck.pop()
            players[i].card2 = deck.pop()
            players[i].money > minimumBet ? players[i].bet = minimumBet : players[i].bet = players[i].money
            players[i].money -= players[i].bet
        }
        else{
            players[i].bet = 0
            players[i].handRank = `Game Over`
        }

    }

    winningPlayers = []

}

// Renders game state information to the screen
function render(){

    // Hide main menu and show game state
    mainMenuEl.hidden = true

    tableEl.hidden = false
    for (const buttonEl of buttonEls)
        buttonEl.hidden = false

    // re-enable check and fold buttons if you are restarting from game over
    checkButtonEl.disabled = false
    foldButtonEl.disabled = false

    // Fold button is enabled until all cards are shown
    // If number of players == 1, fold and raise button is disabled
    numberOfPlayers == 1 ? foldButtonEl.disabled = true : foldButtonEl.disabled = false
    numberOfPlayers == 1 ? raiseButtonEl.disabled = true : raiseButtonEl.disabled = false

    // disable fold and raise button if you cannot raise the bet any more (and no point in folding)
    if (players[0].money == 0){
        raiseButtonEl.disabled = true
        foldButtonEl.disabled = true
    }

    // Unhide player elements according to number of players you selected in the main menu
    if (numberOfPlayers > 1)
        player1.hidden = false
    if (numberOfPlayers > 2)
        player2.hidden = false
    if (numberOfPlayers > 3)
        player3.hidden = false
    if (numberOfPlayers > 4)
        player4.hidden = false
    if (numberOfPlayers > 5)
        player5.hidden = false
    if (numberOfPlayers > 6)
        player6.hidden = false
    if (numberOfPlayers > 7)
        player7.hidden = false

    // Conditions for different "stages" of a poker round depending on how many cards are shown
    if (stage == 0)
        checkButtonEl.innerText = `Check`
    if (stage > 0){
        tableCard0El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[0].rank}_${tableCards[0].suit}.png" alt="Table card slot 1">`
        tableCard1El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[1].rank}_${tableCards[1].suit}.png" alt="Table card slot 2">`
        tableCard2El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[2].rank}_${tableCards[2].suit}.png" alt="Table card slot 3">`
    }
    if (stage > 1) // turn
        tableCard3El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[3].rank}_${tableCards[3].suit}.png" alt="Table card slot 4">`
    if (stage > 2) // river
        tableCard4El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[4].rank}_${tableCards[4].suit}.png" alt="Table card slot 5">`
    if (stage > 3){ // reveal

        // Disable all betting buttons and check button becomes reset button
        foldButtonEl.disabled = true
        raiseButtonEl.disabled = true
        checkButtonEl.innerText = `Reset`
        findHandRanks()

        if (numberOfPlayers > 1){

            // Determine Winner. Winner gets added to the global winningPlayers array.
            determineWinner()

            // Display winner message after winner is determined
            if (winningPlayers.length == 1)
                resultsEl.innerText = `\n\n\n\n${winningPlayers[0]} wins`
            else {
                winnersText = winningPlayers.join(`, `)
                resultsEl.innerText = `\n\n\n\nDraw between: ${winnersText}`
            }

            winningPlayers.includes(`Hero`) ? resultsEl.style.color = `blue` : resultsEl.style.color = `firebrick`
                
            if (winningPlayers.length > 1 && winningPlayers.includes(`Hero`))
                resultsEl.style.color = `yellow`

            // Check to see if the hero player is the last player standing. If so, you win!
            heroWins = true
            players.forEach(function(player, idx){
                if (player.money > 0 && idx != 0)
                    heroWins = false
            })

            // Disable all buttons if you are the only player standing
            if (heroWins){
                checkButtonEl.disabled = true
                raiseButtonEl.disabled = true
                winnersEl.style.color = `blue`
                winnersEl.innerText = `You. Are. Winner.`
            }

        }

        // Game over. Disable check button.
        if (players[0].money <= 0){
            checkButtonEl.disabled = true
            winnersEl.style.color = `firebrick`
            winnersEl.innerText = `Game Over!`
            gameOver = true
        }

    }

    // Render player info (Cards each player is holding)
    for (let i=0; i<numberOfPlayers; i++){
        
        if (players[i].card1 == null){ // display no cards for villains with no money to play
            document.getElementById(`pl${i}-cd1`).innerHTML = ``
            document.getElementById(`pl${i}-cd2`).innerHTML = ``
        }
        else if (stage < 4 && i > 0){ // display cards face down for villains before the reveal phase
            if (darkMode){
                document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/purple_back.png" alt="Table card slot 1">`
                document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/purple_back.png" alt="Table card slot 1">`
            }
            else { // darkMode == false
                document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/blue_back.png" alt="Table card slot 1">`
                document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/blue_back.png" alt="Table card slot 1">`
            }
        }
        else {
            document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[i].card1.rank}_${players[i].card1.suit}.png" alt="Table card slot ${i+1}">`
            document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[i].card2.rank}_${players[i].card2.suit}.png" alt="Table card slot ${i+1}">`
        }

        // Display hand rank after the reveal phase
        document.querySelector(`#player${i} > .hand-rank`).innerText = players[i].handRank

        // Display money only if there's more than 1 player.
        if (numberOfPlayers > 1) {
            document.querySelector(`#player${i} > .money`).innerText = `Money: $${players[i].money}`
            document.querySelector(`#player${i} > .bet`).innerText = `Bet: $${players[i].bet}`
        }
        else{
            document.querySelector(`#player${i} > .money`).innerText = ``
            document.querySelector(`#player${i} > .bet`).innerText = ``
        }

    }

}

// Determines hand rank. Called after all cards are turned over
// Populates handRank in player objects
function findHandRank(obj){

    // create array of 7 cards for the table and hand to be ranked
    const hand = tableCards.slice(0)
    hand.push(obj.card1)
    hand.push(obj.card2)

    // Reduce hand suits and cards to a key:value pair containing how many instances of certain suit/value a hand has.
    // This results in easier time looking for hand ranks using other array iterator methods.
    const suitCount = hand.reduce(function(suits, card){
        suits[card.suit]++
        return suits
    }, {1:0, 2:0, 3:0, 4:0})
    const rankCount = hand.reduce(function(ranks, card){
        ranks[card.rank]++
        return ranks
    }, {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0})

    // Checks for each hand rank condition using findHandRank helper functions
    // Goes through higher hand ranks first so that points are distributed properly
    if (isRoyalFlush(hand, rankCount)){
        obj.handRank = `Royal Flush`
        obj.score = 9001
    }  
    else if (isStraightFlush(hand, rankCount)){
        obj.handRank = `Straight Flush`
        obj.score = 8000 + isStraightFlush(hand, rankCount)
    }
    else if (isFourOfAKind(rankCount)){
        obj.handRank = `Four of a Kind`
        obj.score = 7000
    }
    else if (isFullHouse(rankCount)){
        obj.handRank = `Full House`
        obj.score = 6000
    }
    else if (isFlush(suitCount)){
        obj.handRank = `Flush`
        obj.score = 5000
    }
    else if (isStraight(hand)){
        obj.handRank = `Straight`
        obj.score = 4000 + isStraight(hand)
    }
    else if (isThreeOfAKind(rankCount)){
        obj.handRank = `Three of a Kind`
        obj.score = 3000
    }
    else if (isTwoPairs(rankCount)){
        obj.handRank = `Two Pairs`
        obj.score = 2000
    }
    else if (isPair(rankCount)){
        obj.handRank = `One Pair`
        obj.score = 1000
    }
    else // high card
        obj.handRank = `High Card`

    // Determine score of a hand for finding a winner between same hands
    determineScore(obj, hand, suitCount, rankCount)

}

// Executes findHandRank function on each player
const findHandRanks = () => players.forEach(obj => {
    if (obj.card1 != null)
        findHandRank(obj)
})

// Generic sorting function that sorts by number. Used in sort iterator methods
sortingFunction = (a, b) => {

    if (a < b)
        return -1
    else if (a > b)
        return 1
    else
        return 0

}

/*

    Helper functions for findHandRank

*/
// Strategy: See if there are any rank values greater than 3 (4 cards of same rank). If so, return true. If not, return false.
isFourOfAKind = (ranks) => Object.values(ranks).some(numRanks => numRanks == 4)

// Strategy: See if there are any suit values greater than 4 (more than 4 cards of same suit). If so, return true. If not, return false.
isFlush = (suits) => Object.values(suits).some(numSuits => numSuits > 4)

// Checks to see if the 7 card hand is straight.
// Returns the highest value in a straight. 0 (false) if it's not.
function isStraight(hand){

    // map each card to an array of rank values
    const handNumVals = hand.map(obj => obj.rank)

    // sort handNumVals for less iterations of checking for straight flush
    handNumVals.sort((a, b) => sortingFunction(a, b)).reverse()

    // check the first three numbers to see if it contains hand numbers less than itself by 1, 2, 3, and 4 (and 12 if the first rank is a king)
    for (let i=0; i<3; i++){

        if (handNumVals.includes(handNumVals[i] - 1) &&
            handNumVals.includes(handNumVals[i] - 2) &&
            handNumVals.includes(handNumVals[i] - 3)){

            if (handNumVals[i] == Rank.KING && handNumVals.includes(handNumVals[i] - 12))
                return Rank.ACE + Object.keys(Rank).length
            if (handNumVals.includes(handNumVals[i] - 4))
                return handNumVals[i]

        }

    }

    return 0 // false

}

// Checks to see if the 7-card hand is a straight flush.
// Originally tried to go for the isFlush and isStraight route, but there are edge cases where it would falsely display straight flush in cases where it wasn't.
// Returns value of the highest number in a straight. 0 (false) if it's not straight and not flush.
function isStraightFlush(hand){

    // separate each suit by buffer number before comparing each other for adjacent numbers
    let suitBuffer = 100
    const handNumVals = hand.map(obj => ((obj.suit - 1) * suitBuffer) + obj.rank)

    // sort handNumVals for less iterations of checking for straight flush
    handNumVals.sort((a, b) => sortingFunction(a, b)).reverse()

    // check the first three numbers to see if it contains hand numbers less than itself by 1, 2, 3, and 4 (and 12 if the first rank is a king)
    for (let i=0; i<3; i++){

        if (handNumVals.includes(handNumVals[i] - 1) &&
            handNumVals.includes(handNumVals[i] - 2) &&
            handNumVals.includes(handNumVals[i] - 3)){

            if (handNumVals[i] % suitBuffer == Rank.KING && handNumVals.includes(handNumVals[i] - 12)) // Royal Flush
                return Rank.ACE
            if (handNumVals.includes(handNumVals[i] - 4))
                return handNumVals[i] % suitBuffer

        }

    }

    return 0 // false

}

// Sees if the highest straight flush hand is an ace.
isRoyalFlush = (hand, rank) => isStraightFlush(hand, rank) == Rank.ACE

// Strategy: See if there are any rank values greater than 2 (more than 2 cards of same rank). If so, return true. If not, return false.
isThreeOfAKind = (ranks) => Object.values(ranks).some(numRanks => numRanks > 2)

// Strategy: Filter the rank object array into a single array that contains rank values greater than 1.
// If that array's length is greater than 1 (there are more than 1 pairs), return true. Otherwise returns false.
isTwoPairs = (ranks) => Object.values(ranks).filter(numRanks => numRanks > 1).length > 1

// Strategy: Check if there's three of a kind AND there are two or more pairs.
isFullHouse = (ranks) => isThreeOfAKind(ranks) && isTwoPairs(ranks)

// Strategy: See if there are any rank values greater than 1 (more than 1 card of same rank). If so, return true. If not, return false.
isPair = (ranks) => Object.values(ranks).some(numRanks => numRanks > 1)

// Gives each player a point value depending on how strong their hand is.
// Hand rank takes precedence, then each card's rank value that satisfies that hand is added to calculation.
function determineScore(obj, hand, suits, ranks){

    // map each card to an array of rank values
    // If the rank is ace, return 14 instead (greater than king)
    const handNumVals = hand.map((player) => {

        if (player.rank == Rank.ACE)
            return Rank.ACE + Object.keys(Rank).length
        else
            return player.rank

    })

    // Sort handNumVals for easier computation
    handNumVals.sort((a, b) => sortingFunction(a, b))

    if (obj.handRank == `High Card`){

        obj.score += handNumVals.pop()

        // set kicker to remaining best 4 numbers
        obj.kicker = handNumVals.slice(2, handNumVals.length)

    }

    // Unified helper function to determine matching pair according to the condition.
    // Adjusts score and kickers accordingly afterwards.
    // If num is 2, check for 1 pair. If num is 3, check for 1 three of a kind...
    const pairMatch = (num) => {

        let matchingValue
        for (const key in ranks){
            if (ranks[key] == num)
                matchingValue = parseInt(key)
        }

        if (matchingValue == Rank.ACE)
            matchingValue += Object.keys(Rank).length

        // generate kicker using filter
        obj.kicker = handNumVals.filter(rankVal => rankVal != matchingValue)
        obj.kicker.shift()
        obj.kicker.shift()

        obj.score += matchingValue

    }

    if (obj.handRank == `One Pair`)
        pairMatch(2)

    if (obj.handRank == `Three of a Kind`)
        pairMatch(3)

    if (obj.handRank == `Four of a Kind`)
        pairMatch(4)

    // Checks for best two matching pairs on hand rank of two pairs.
    // If this code is run, we know that the hand has two pairs or three pairs.
    // This allows us to explicitly search for two pairs without worrying about edge cases (i.e. full house)
    if (obj.handRank == `Two Pairs`){

        let matchingValue1 = 0
        let matchingValue2 = 0
        let matchingValue3 = 0
        let buffer = 50

        // Get all ranks that are pairs from lowest value to highest.
        for (const key in ranks){
            if (ranks[key] == 2 && !matchingValue1)
                matchingValue1 = parseInt(key)
            else if (ranks[key] == 2 && !matchingValue2)
                matchingValue2 = parseInt(key)
            else if (ranks[key] == 2 && !matchingValue3)
                matchingValue3 = parseInt(key)
        }

        // matchingValue1 and matchingValue2 become highest pairs. Everything else goes to kicker.
        if (matchingValue3 != 0 && matchingValue1 != Rank.ACE)
            matchingValue1 = matchingValue3
        if (matchingValue1 == Rank.ACE)
            matchingValue1 += Object.keys(Rank).length

        // generate kicker using filter
        obj.kicker = handNumVals.filter(rankVal => rankVal != matchingValue1 && rankVal != matchingValue2)
        obj.kicker.shift()
        obj.kicker.shift()

        // Score determination: Whatever number that is greater gets buffer applied to it to signify that it is the determining pair in winning a head to head match.
        if (matchingValue1 > matchingValue2)
            obj.score += matchingValue1 * buffer + matchingValue2
        else // (matchingValue2 < matchingValue1)
            obj.score += matchingValue2 * buffer + matchingValue1

    }

    // Checks for best three of a kind and two of a kind
    // If this code is run, we know that the hand has two pairs and nothing else.
    // This allows us to explicitly search for two pairs without worrying about edge cases (i.e. full house)
    if (obj.handRank == `Full House`){

        let matchingValue1 = 0
        let matchingValue2 = 0
        let matchingValue3 = 0
        let buffer = 50

        // Get all ranks that are 3 of a kind from lowest rank to highest.
        for (const key in ranks){
            if (ranks[key] == 3 && !matchingValue1)
                matchingValue1 = parseInt(key)
            else if (ranks[key] == 3 && !matchingValue2)
                matchingValue2 = parseInt(key)
        }

        // Only one 3 of a kind, which means than other 4 cards form a pair or two.
        if (matchingValue2 == 0){
            for (const key in ranks){
                if (ranks[key] == 2 && !matchingValue2)
                    matchingValue2 = parseInt(key)
                else if (ranks[key] == 2 && !matchingValue3)
                    matchingValue3 = parseInt(key)
            }
        }

        if (matchingValue1 == Rank.ACE)
            matchingValue1 += Object.keys(Rank).length
        if (matchingValue2 == Rank.ACE) // matchingValue2 cannot be Rank.ACE if matchingValue1 is.
            matchingValue2 += Object.keys(Rank).length
        if (matchingValue3 && matchingValue2 != 14) // Rank.ACE + Object.keys(Rank).length
            matchingValue2 = matchingValue3 // matchingValue2 is now always greater than matchingValue3.
    
        // Score determination: Whatever number that is 3 of a kind buffer applied to it to signify that it is more significant than the pair or lesser 3 of a kind.
        obj.score += matchingValue1 * buffer + matchingValue2

    }

    // Get the suit that is flush, put the ranks that make the suit in a separate array.
    // Kicker for flush ranks are not necessarily "kickers", but they will act as tiebreakers.
    if (obj.handRank == `Flush`){

        let matchingValue
        for (const key in suits){
            if (suits[key] > 4)
                matchingValue = parseInt(key)
        }

        validRanks = []
        hand.forEach(function(elem){
            if (elem.suit == matchingValue)
                validRanks.push(elem.rank)
        })
        validRanks.sort((a, b) => sortingFunction(a, b))

        obj.kicker = validRanks.slice(validRanks.length - 5, validRanks.length)

    }

    // Sort kickers from highest to lowest by reversing the array.
    // Then converts the array to a "base 13" number with highest rank as highest significand for easy integer comparison after parseInt
    if (obj.kicker != null){

        const reverseKicker = obj.kicker.reverse()
        obj.kicker = parseInt(reverseKicker.reduce(function(stringNum, val){

            if (val < 10)
                val = "0" + val

            return stringNum + val

        },""))

    }

}

// Using the determineScore function to obtain scores and kickers for each player's hand, evaluates the winners.
function determineWinner(){

    // Compile scores for all players and get the highest score
    const scores = players.map(player => player.score)
    const bestScore = Math.max(...scores)

    // Filter by players that won the game to determine tiebreakers between those that have the highest score, if there are any required.
    const playersWon = players.filter(player => player.score == bestScore)

    if (playersWon.length > 1){

        // compare kickers. They have been sorted as a "base 13" number so that Math.max can be performed to accurately compare kickers.
        const kickers = playersWon.map(player => player.kicker)
        const bestKicker = Math.max(...kickers)

        // If hand ranks are straight and full house, there are no kickers, therefore game is a draw.
        // Added Straight Flush and Royal Flush here as well, just in case those cards are on the board to make a draw.
        if (playersWon[0].handRank == `Straight` || playersWon[0].handRank == `Full House` || 
            playersWon[0].handRank == `Straight Flush` || playersWon[0].handRank == `Royal Flush`){
            winningPlayers = playersWon.map(player => player.name)
        }
        else{
            // Filter playersWon by player(s) that have the best kicker.
            playersWon.forEach(function(drawnPlayers){
                if (drawnPlayers.kicker == bestKicker)
                    winningPlayers.push(drawnPlayers.name)
            })
        }

    }
    else
        winningPlayers = playersWon.map(player => player.name)

    // Distribute bets to winning players
    let totalBet = players.reduce((total, player) => total + player.bet, 0)
    totalBet /= winningPlayers.length

    players.forEach(function(player){

        if (winningPlayers.includes(player.name))
            player.money += Math.floor(totalBet)

        player.bet = 0

    })

}

// Initialization
init()