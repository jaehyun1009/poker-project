/*
    Constants
    Suit: Suit of card
    Rank: Rank of card
    handRank: Rank of hands (how good your hand is after last card is revealed)
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

// Game Buttons
const buttonEls = document.querySelectorAll(`#buttons > button`)
const turnButtonEl = document.getElementById(`turn`)
const mainMenuButtonEl = document.getElementById(`goto-main`)
const foldButtonEl = document.getElementById(`fold`)

// Table Elements
const tableEl = document.getElementById(`table`)
const tableCard0El = document.getElementById(`table-card-0`)
const tableCard1El = document.getElementById(`table-card-1`)
const tableCard2El = document.getElementById(`table-card-2`)
const tableCard3El = document.getElementById(`table-card-3`)
const tableCard4El = document.getElementById(`table-card-4`)

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
    players: list of player objects that each consist of the following:
        name: identifier of player
        money: amount of money a player has
        bet: amount of money a player bet on a turn
        blind: blind status (big blind, small blind, or button)
        cards: cards that a player is holding in his or her hand
        handRank: number assigned to a player that designates hand rank after river is revealed
    
*/
let deck = []
let tableCards = []
let stage = 0
let numberOfPlayers
let players = [
    {
        name: 'Hero',
        money: null,
        blind: null,
        bet: null,
        card1: null,
        card2: null,
        handRank: null,
    }
]

/*

    Event Listeners

*/
mainMenuButtonEl.addEventListener(`click`, function(){

    if (window.confirm(`Going back to the main menu will reset the entire game.\nAre you sure you want to go back?`))
        init()

})

startGameEl.addEventListener(`click`, function(){

    numberOfPlayers = playerNumberEl.value

    for (let i=1; i<numberOfPlayers; i++){
        players.push(
            {
                name: `Villain ${i}`,
                money: null,
                blind: null,
                bet: null,
                card1: null,
                card2: null,
                handRank: null,
            }
        )
    }

    resetTable()
    render()

})

turnButtonEl.addEventListener(`click`, function(){

    switch (stage){

        case 0:
            stage = 1
            deck.pop() // burn card
            tableCards.push(deck.pop())
            tableCards.push(deck.pop())
            tableCards.push(deck.pop())
            break

        case 1:
            stage = 2
            deck.pop()
            tableCards.push(deck.pop())
            break

        case 2:
            stage = 3
            deck.pop()
            tableCards.push(deck.pop())
            break

        default: // case 3
            stage = 0
            resetTable()
            break

    }

    render()

})

foldButtonEl.addEventListener(`click`, function(){

    if (window.confirm(`Are you sure you want to give up your hand?`)){
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

// Uses Fisher-Yates algorithm to shuffle, then the deck is split and rejoined,
// Do this process many times to get a good shuffle, like a human would divide the deck many times to shuffle.
// Initializes game and shows beginning game screen
function init(){

    // Initial state. Show main menu and hide game state.
    mainMenuEl.hidden = false

    tableEl.hidden = true
    for (const buttonEl of buttonEls){

        buttonEl.hidden = true

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

}

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

    // Reshuffle deck and reset game state
    newDeck()
    shuffle()
    tableCards = []
    stage = 0

    for (let i=0; i<numberOfPlayers; i++){

        // assign fresh hand to each player
        players[i].card1 = deck.pop()
        players[i].card2 = deck.pop()

        // reset hand rank of each player
        players[i].handRank = ``

    }

}

// Renders game state information to the screen
function render(){

    // Hide main menu and show game state
    mainMenuEl.hidden = true

    tableEl.hidden = false
    for (const buttonEl of buttonEls){

        buttonEl.hidden = false

    }

    // Fold button is enabled until all cards are shown
    foldButtonEl.disabled = false

    // Conditions for different "stages" of a poker round depending on how many cards are shown
    if (stage == 0)
        turnButtonEl.innerText = `Flop`

    if (stage > 0){ // flop
        tableCard0El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[0].rank}_${tableCards[0].suit}.png" alt="Table card slot 1">`
        tableCard1El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[1].rank}_${tableCards[1].suit}.png" alt="Table card slot 2">`
        tableCard2El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[2].rank}_${tableCards[2].suit}.png" alt="Table card slot 3">`
        turnButtonEl.innerText = `Turn`
    }

    if (stage > 1){ // turn
        tableCard3El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[3].rank}_${tableCards[3].suit}.png" alt="Table card slot 4">`
        turnButtonEl.innerText = `River`
    }

    if (stage > 2){ // river

        tableCard4El.innerHTML = `<img width="60" height="90" src="./img/cards/${tableCards[4].rank}_${tableCards[4].suit}.png" alt="Table card slot 5">`
        turnButtonEl.innerText = `Reset`
        foldButtonEl.disabled = true

        findHandRanks()

    }

    // Render player hands
    document.getElementById(`pl0-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[0].card1.rank}_${players[0].card1.suit}.png" alt="Table card slot 1">`
    document.getElementById(`pl0-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[0].card2.rank}_${players[0].card2.suit}.png" alt="Table card slot 1">`
    document.querySelector(`#player0 > .hand-rank`).innerText = players[0].handRank

    if (numberOfPlayers > 1){
        player1.hidden = false
        document.getElementById(`pl1-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[1].card1.rank}_${players[1].card1.suit}.png" alt="Table card slot 2">`
        document.getElementById(`pl1-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[1].card2.rank}_${players[1].card2.suit}.png" alt="Table card slot 2">`
        document.querySelector(`#player1 > .hand-rank`).innerText = players[1].handRank
    }

    if (numberOfPlayers > 2){
        player2.hidden = false
        document.getElementById(`pl2-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[2].card1.rank}_${players[2].card1.suit}.png" alt="Table card slot 3">`
        document.getElementById(`pl2-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[2].card2.rank}_${players[2].card2.suit}.png" alt="Table card slot 3">`
        document.querySelector(`#player2 > .hand-rank`).innerText = players[2].handRank
    }

    if (numberOfPlayers > 3){
        player3.hidden = false
        document.getElementById(`pl3-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[3].card1.rank}_${players[3].card1.suit}.png" alt="Table card slot 4">`
        document.getElementById(`pl3-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[3].card2.rank}_${players[3].card2.suit}.png" alt="Table card slot 4">`
        document.querySelector(`#player3 > .hand-rank`).innerText = players[3].handRank
    }

    if (numberOfPlayers > 4){
        player4.hidden = false
        document.getElementById(`pl4-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[4].card1.rank}_${players[4].card1.suit}.png" alt="Table card slot 5">`
        document.getElementById(`pl4-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[4].card2.rank}_${players[4].card2.suit}.png" alt="Table card slot 5">`
        document.querySelector(`#player4 > .hand-rank`).innerText = players[4].handRank
    }

    if (numberOfPlayers > 5){
        player5.hidden = false
        document.getElementById(`pl5-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[5].card1.rank}_${players[5].card1.suit}.png" alt="Table card slot 6">`
        document.getElementById(`pl5-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[5].card2.rank}_${players[5].card2.suit}.png" alt="Table card slot 6">`
        document.querySelector(`#player5 > .hand-rank`).innerText = players[5].handRank
    }

    if (numberOfPlayers > 6){
        player6.hidden = false
        document.getElementById(`pl6-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[6].card1.rank}_${players[6].card1.suit}.png" alt="Table card slot 7">`
        document.getElementById(`pl6-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[6].card2.rank}_${players[6].card2.suit}.png" alt="Table card slot 7">`
        document.querySelector(`#player6 > .hand-rank`).innerText = players[6].handRank
    }

    if (numberOfPlayers > 7){
        player7.hidden = false
        document.getElementById(`pl7-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[7].card1.rank}_${players[7].card1.suit}.png" alt="Table card slot 8">`
        document.getElementById(`pl7-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[7].card2.rank}_${players[7].card2.suit}.png" alt="Table card slot 8">`
        document.querySelector(`#player7 > .hand-rank`).innerText = players[7].handRank
    }

}

// Determines hand rank. Called after all cards are turned over
function findHandRank(obj){

    // create array of 7 cards for the table and hand to be ranked
    const hand = tableCards.slice(0)
    hand.push(obj.card1)
    hand.push(obj.card2)

    const suitCount = hand.reduce(
        function(suits, card){

            suits[card.suit]++
            return suits

        }, 
        {

            1: 0,
            2: 0,
            3: 0,
            4: 0
    
        })

    const rankCount = hand.reduce(
        function(ranks, card){
    
            ranks[card.rank]++
            return ranks
    
        }, 
        {
    
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0
        
        })

    if (isRoyalFlush(hand, rankCount))
        obj.handRank = `Royal Flush`
    
    else if (isStraightFlush(hand, rankCount))
        obj.handRank = `Straight Flush`

    else if (isFourOfAKind(rankCount))
        obj.handRank = `Four of a Kind`

    else if (isFullHouse(rankCount))
        obj.handRank = `Full House`

    else if (isFlush(suitCount))
        obj.handRank = `Flush`

    else if (isStraight(rankCount))
        obj.handRank = `Straight`

    else if (isThreeOfAKind(rankCount))
        obj.handRank = `Three of a Kind`

    else if (isTwoPairs(rankCount))
        obj.handRank = `Two Pairs`

    else if (isPair(rankCount))
        obj.handRank = `One Pair`

    else // high card
        obj.handRank = `High Card`

}

// Executes findHandRank function on each player
const findHandRanks = () => players.forEach(obj => findHandRank(obj))

/*

    Helper functions for findHandRank

*/
function isFourOfAKind(ranks){

    return Object.values(ranks).some(numRanks => numRanks == 4)

}

function isFullHouse(ranks){

    const numPairs = Object.values(ranks).filter(numRanks => numRanks > 1).length
    return isThreeOfAKind(ranks) && (numPairs > 1)

}

function isFlush(suits){

    return Object.values(suits).some(numSuits => numSuits > 4)

}

function isStraight(ranks){

    if (ranks[Rank.ACE] > 0 && ranks[Rank.TWO] > 0 && ranks[Rank.THREE] > 0
        && ranks[Rank.FOUR] > 0 && ranks[Rank.FIVE] > 0){
            return Rank.FIVE
    }

    if (ranks[Rank.TWO] > 0 && ranks[Rank.THREE] > 0 && ranks[Rank.FOUR] > 0
        && ranks[Rank.FIVE] > 0 && ranks[Rank.SIX] > 0){
            return Rank.SIX
    }

    if (ranks[Rank.THREE] > 0 && ranks[Rank.FOUR] > 0 && ranks[Rank.FIVE] > 0
        && ranks[Rank.SIX] > 0 && ranks[Rank.SEVEN] > 0){
            return Rank.SEVEN
    }

    if (ranks[Rank.FOUR] > 0 && ranks[Rank.FIVE] > 0 && ranks[Rank.SIX] > 0
        && ranks[Rank.SEVEN] > 0 && ranks[Rank.EIGHT] > 0){
            return Rank.EIGHT
    }

    if (ranks[Rank.FIVE] > 0 && ranks[Rank.SIX] > 0 && ranks[Rank.SEVEN] > 0
        && ranks[Rank.EIGHT] > 0 && ranks[Rank.NINE] > 0){
            return Rank.NINE
    }

    if (ranks[Rank.SIX] > 0 && ranks[Rank.SEVEN] > 0 && ranks[Rank.EIGHT] > 0
        && ranks[Rank.NINE] > 0 && ranks[Rank.TEN] > 0){
            return Rank.TEN
    }

    if (ranks[Rank.SEVEN] > 0 && ranks[Rank.EIGHT] > 0 && ranks[Rank.NINE] > 0
        && ranks[Rank.TEN] > 0 && ranks[Rank.JACK] > 0){
            return Rank.JACK
    }

    if (ranks[Rank.EIGHT] > 0 && ranks[Rank.NINE] > 0 && ranks[Rank.TEN] > 0
        && ranks[Rank.JACK] > 0 && ranks[Rank.QUEEN] > 0){
            return Rank.QUEEN
    }

    if (ranks[Rank.NINE] > 0 && ranks[Rank.TEN] > 0 && ranks[Rank.JACK] > 0
        && ranks[Rank.QUEEN] > 0 && ranks[Rank.KING] > 0){
            return Rank.KING
    }

    if (ranks[Rank.TEN] > 0 && ranks[Rank.JACK] > 0 && ranks[Rank.QUEEN] > 0
        && ranks[Rank.KING] > 0 && ranks[Rank.ACE] > 0){
            return Rank.ACE
    }

    return 0 // false

}

function isStraightFlush(hand, rank){

    let suitBuffer = 100
    const handNumVals = hand.map(obj => ((obj.suit - 1) * suitBuffer) + obj.rank)

    handNumVals.sort(function(a, b){

        if (a < b)
            return -1
        else if (a > b)
            return 1
        else
            return 0

    })

    for (let i=0; i<4; i++){

        if (handNumVals.includes(handNumVals[i] + 1) &&
            handNumVals.includes(handNumVals[i] + 2) &&
            handNumVals.includes(handNumVals[i] + 3)){

            if (handNumVals.includes(handNumVals[i] + 4))
                return (handNumVals[i] + 4) % suitBuffer
            else if (handNumVals.includes(handNumVals[i] - 9))
                return Rank.ACE

        }

    }

    return 0

}

function isRoyalFlush(hand, rank){

    return isStraightFlush(hand, rank) == Rank.ACE

}

function isThreeOfAKind(ranks){

    return Object.values(ranks).some(numRanks => numRanks > 2)

}

function isTwoPairs(ranks){

    return Object.values(ranks).filter(numRanks => numRanks > 1).length > 1

}

function isPair(ranks){

    return Object.values(ranks).some(numRanks => numRanks > 1)

}

// Initialization
init()