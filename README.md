# Poker Project
## Description
Poker game that can support one user and up to 7 "villains" that mirror your betting moves. Heavy emphasis on Javascript, especially with clever use of array iterator methods.

### Languages Used
- Javascript (ES6)
- HTML5
- CSS3
- Github

## How to Play Poker
DISCLAIMER: Do not play online for money unless you know what you're doing!

https://www.partypoker.com/en/how-to-play/texas-holdem

## How this application works
### Main Menu
About: Clicking this will direct the user to this page.

Number of players: Users can choose from 1 to 8. Choosing 1 will get you into a 1 player mode where you cannot fold and raise, since there is no betting.

Start: Takes user to the game page. Default starting money is 10000, and minimum bet starts at starting money divided by 25 times number of players. (NOTE: Minimum bet will double for every player that's knocked out of the game.)

### Game Menu
There are 4 buttons that the user can click on the bottom of the page.

Fold: Give up your current hand and gets you fresh hand of 2 new cards. Random villain is chosen to be the winner. Disabled on 1 player mode. Program will alert you on if you want to progre

Raise: Raise your bet. Since no AI has been implemented, all villains will call your every raise.

Check: See the next card, or reveal all villains' cards after last table card is revealed without raising your bet.

Main Menu: Directs the user back to main menu. Will reset all game state.

## Motivation
"I LOVE MONEY" - Mr. Krabs

## Screenshots
![Main Menu](https://i.imgur.com/QF4WnSA.png)

![Main Menu Dropdown](https://i.imgur.com/2WkcUaB.png)

![1 Player Mode](https://i.imgur.com/xgsU1b9.png)

![Flush Tiebreaker](https://i.imgur.com/VqArHa4.png)

![Mixed Game State](https://i.imgur.com/wv4xWus.png)

![Hero Draw](https://i.imgur.com/cm9XYco.png)

![Villain Draw](https://i.imgur.com/ELLJPQV.png)

![Four of a Kind](https://i.imgur.com/Pnz0Nyu.png)

![You are winner](https://i.imgur.com/qemsniU.png)

![Game over](https://i.imgur.com/hl7BKaF.png)

## Lessons Learned

## Stretch Goals
~~Support up to 8 players (7 computer villains)~~

~~Implement proper tiebreaker system~~

~~Implement proper betting system~~ Basic betting system is done, but somewhat different from how a real poker game plays due to lack of AI.

Implement timer for minimum bet to go up periodically

Support mobile users

Add rudimentary AI (randomly raising and folding depending on their hand strength in relation to the board. Random numbers will act as bluff)

## Resources
Spinning poker chip image: https://dribbble.com/shots/3151889-Poker-Chip-Spin

Images of 52 playing cards: http://acbl.mybigcommerce.com/52-playing-cards/