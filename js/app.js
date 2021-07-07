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
let numberOfPlayers = 1
let players = [
    {
        name: 'Hero',
        money: null,
        blind: null,
        bet: null,
        card1: null,
        card2: null,
        handRank: null,
        score: 0,
        kickers: null
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
                score: null,
                kickers: null
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
            numberOfPlayers == 1 ? stage = 4 : stage = 3
            deck.pop()
            tableCards.push(deck.pop())
            break

        case 3:
            stage = 4
            break

        default: // case 4
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

    for (let i=0; i<numberOfPlayers; i++){

        // assign fresh hand to each player
        players[i].card1 = deck.pop()
        players[i].card2 = deck.pop()

        // reset hand rank of each player
        players[i].handRank = ``
        players[i].score = 0
        players[i].kickers = null

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

    // Fold button is enabled until all cards are shown
    // If number of players == 1, fold button is disabled
    numberOfPlayers == 1 ? foldButtonEl.disabled = true : foldButtonEl.disabled = false

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
        turnButtonEl.innerText = `Reveal`

    }

    if (stage > 3){ // reveal

        foldButtonEl.disabled = true
        turnButtonEl.innerText = `Reset`
        findHandRanks()

    }

    // Render player hands
    for (let i=0; i<numberOfPlayers; i++){
        
        if (stage < 4 && i > 0){
            document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/back.png" alt="Table card slot 1">`
            document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/back.png" alt="Table card slot 1">`
        }
        else {
            document.getElementById(`pl${i}-cd1`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[i].card1.rank}_${players[i].card1.suit}.png" alt="Table card slot ${i+1}">`
            document.getElementById(`pl${i}-cd2`).innerHTML = `<img width="60" height="90" src="./img/cards/${players[i].card2.rank}_${players[i].card2.suit}.png" alt="Table card slot ${i+1}">`
        }

        document.querySelector(`#player${i} > .hand-rank`).innerText = players[i].handRank + `\n(${players[i].score})`

    }

}

// Determines hand rank. Called after all cards are turned over
// Populates handRank in player objects
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

    determineScore(obj, hand, suitCount, rankCount)

}

// Executes findHandRank function on each player
const findHandRanks = () => players.forEach(obj => findHandRank(obj))

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

    // simple sorting function that sorts handNumVals by number
    handNumVals.sort(function(a, b){

        if (a < b)
            return -1
        else if (a > b)
            return 1
        else
            return 0

    })

    // check each number to see if it contains hand numbers greater than it by 1, 2, 3, and 4 (or 9 checking for ace)
    for (let i=0; i<4; i++){

        if (handNumVals.includes(handNumVals[i] + 1) &&
            handNumVals.includes(handNumVals[i] + 2) &&
            handNumVals.includes(handNumVals[i] + 3)){

            if (handNumVals.includes(handNumVals[i] + 4))
                return handNumVals[i] + 4
            else if (handNumVals.includes(handNumVals[i] - 9))
                return Rank.ACE

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

    // simple sorting function that sorts handNumVals by number
    handNumVals.sort(function(a, b){

        if (a < b)
            return -1
        else if (a > b)
            return 1
        else
            return 0

    })

    // check each number to see if it contains hand numbers greater than it by 1, 2, 3, and 4 (or 9 checking for ace)
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

function determineScore(obj, hand, suits, ranks){

    // map each card to an array of rank values
    // If the rank is ace, return 14 instead (greater than king)
    const handNumVals = hand.map((player) => {

        if (player.rank == Rank.ACE)
            return Rank.ACE + Object.keys(Rank).length
        else
            return player.rank

    })

    // simple sorting function that sorts handNumVals by number
    handNumVals.sort(function(a, b){

        if (a < b)
            return -1
        else if (a > b)
            return 1
        else
            return 0

    })

    if (obj.handRank == `High Card`){

        obj.score += handNumVals.pop()

        // set kickers to remaining best 4 numbers
        obj.kickers = handNumVals.slice(2, handNumVals.length)

    }

    if (obj.handRank == `One Pair`){

        let matchingValue

        for (const key in ranks){
            if (ranks[key] == 2)
                matchingValue = parseInt(key)
        }

        if (matchingValue == Rank.ACE)
            matchingValue += Object.keys(Rank).length

        // generate kickers using filter
        obj.kickers = handNumVals.filter(rankVal => rankVal != matchingValue)
        obj.kickers.shift()
        obj.kickers.shift()

        obj.score += matchingValue

    }

    if (obj.handRank == `Three of a Kind`){

        let matchingValue

        for (const key in ranks){
            if (ranks[key] == 3)
                matchingValue = parseInt(key)
        }

        if (matchingValue == Rank.ACE)
            matchingValue += Object.keys(Rank).length

        // generate kickers using filter
        obj.kickers = handNumVals.filter(rankVal => rankVal != matchingValue)
        obj.kickers.shift()
        obj.kickers.shift()

        obj.score += matchingValue

    }

    if (obj.handRank == `Four of a Kind`){

        let matchingValue

        for (const key in ranks){
            if (ranks[key] == 4)
                matchingValue = parseInt(key)
        }

        if (matchingValue == Rank.ACE)
            matchingValue += Object.keys(Rank).length

        // generate kickers using filter
        obj.kickers = handNumVals.filter(rankVal => rankVal != matchingValue)
        obj.kickers.shift()
        obj.kickers.shift()

        obj.score += matchingValue

    }

    if (obj.handRank == `Two Pairs`){

        let matchingValue1 = 0
        let matchingValue2 = 0
        let matchingValue3 = 0
        let buffer = 50

        for (const key in ranks){
            if (ranks[key] == 2 && !matchingValue1)
                matchingValue1 = parseInt(key)
            else if (ranks[key] == 2 && !matchingValue2)
                matchingValue2 = parseInt(key)
            else if (ranks[key] == 2 && !matchingValue3)
                matchingValue3 = parseInt(key)
        }

        if (matchingValue3 != 0 && matchingValue1 != Rank.ACE)
            matchingValue1 = matchingValue3

        if (matchingValue1 == Rank.ACE)
            matchingValue1 += Object.keys(Rank).length

        // generate kickers using filter
        obj.kickers = handNumVals.filter(rankVal => rankVal != matchingValue1 && rankVal != matchingValue2)
        obj.kickers.shift()
        obj.kickers.shift()

        if (matchingValue1 > matchingValue2)
            obj.score += matchingValue1 * buffer + matchingValue2
        else // (matchingValue2 < matchingValue1)
            obj.score += matchingValue2 * buffer + matchingValue1

    }

    if (obj.handRank == `Full House`){

        let matchingValue1 = 0
        let matchingValue2 = 0
        let matchingValue3 = 0
        let buffer = 50

        for (const key in ranks){

            if (ranks[key] == 3 && !matchingValue1)
                matchingValue1 = parseInt(key)
            else if (ranks[key] == 3 && !matchingValue2)
                matchingValue2 = parseInt(key)

        }

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

        if (matchingValue2 == Rank.ACE)
            matchingValue2 += Object.keys(Rank).length

        if (matchingValue3 && matchingValue2 != 14) // Rank.ACE + Object.keys(Rank).length
            matchingValue2 = matchingValue3

        // generate kickers using filter
        obj.kickers = handNumVals.filter(rankVal => rankVal != matchingValue1 && rankVal != matchingValue2)
        obj.kickers.shift()
        obj.kickers.shift()

        obj.score += matchingValue1 * buffer + matchingValue2

    }

}

// Initialization
init()