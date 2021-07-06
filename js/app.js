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
const pl0cd1El = document.getElementById(`pl0-cd1`)
const pl0cd2El = document.getElementById(`pl0-cd2`)

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

    // assign fresh hand to each player
    players[0].card1 = deck.pop()
    players[0].card2 = deck.pop()

    // reset hand rank of each player
    players[0].handRank = ``

}

// Initializes game and shows beginning game screen
function init(){

    // Initial state. Show main menu and hide game state.
    mainMenuEl.hidden = false

    tableEl.hidden = true
    for (const buttonEl of buttonEls){

        buttonEl.hidden = true

    }

    resetTable()

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
    pl0cd1El.innerHTML = `<img width="60" height="90" src="./img/cards/${players[0].card1.rank}_${players[0].card1.suit}.png" alt="Table card slot 1">`
    pl0cd2El.innerHTML = `<img width="60" height="90" src="./img/cards/${players[0].card2.rank}_${players[0].card2.suit}.png" alt="Table card slot 1">`

    document.querySelector(`#player0 > .hand-rank`).innerText = players[0].handRank

}

init()

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
    
    else if (isStraightFlush(hand))
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
// special case: hand has straights from 10 to ace, and is flush.
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

function isStraightFlush(hand){

    const handNumVals = hand.map(obj => ((obj.suit - 1) * Object.values(Rank).length) + obj.rank)
    
    handNumVals.sort(function(a, b){

        if (a < b)
            return -1
        else if (a > b)
            return 1
        else
            return 0

    })

    for (let i=0; i<3; i++){

        if (handNumVals.includes(handNumVals[i] + 1) &&
            handNumVals.includes(handNumVals[i] + 2) &&
            handNumVals.includes(handNumVals[i] + 3) &&
            (handNumVals.includes(handNumVals[i] + 4) || 
            handNumVals.includes(handNumVals[i] - 9)))
            return true

    }

    return false

}

function isRoyalFlush(hand, ranks){

    return isStraightFlush(hand) && (isStraight(ranks) == Rank.ACE)

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