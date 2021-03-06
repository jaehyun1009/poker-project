# Poker Project
## Description
Poker game that can support one user and up to 7 "villains" that mirror your betting moves. Heavy emphasis on Javascript, especially with clever use of array iterator methods.

## Motivation
I love the mathematical as well as the psychological challenges that the game brings. That, and I won quite a bit of money playing with friends, even if mostly for fun. (Understandably, I am no longer "allowed" to play poker with them.)

On a more technical level, I saw Poker as a way to challenge my problem solving skills, and it certainly delivered on that aspect.

## How to Play Poker
DISCLAIMER: Do not play online for money unless you know what you're doing!

https://www.partypoker.com/en/how-to-play/texas-holdem

## Link to Project
https://jaehyun1009.github.io/poker-project/

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

### Light/Dark Mode
Available in both Main Menu and Game Menu. Clicking it inverses text and background colors, buttons have new hover colors, face down cards turn purple, and main menu screen's spinning poker chip changes to spinning coin.

### Technologies Used
- Javascript (ES6)
- HTML5
- CSS3
- Github

## Wireframe
The wireframe looks almost completely different (and even more basic) from what I have now, but I'm posting it regardless to show how much your program can change in a short amount of time.
(https://wireframe.cc/RLLnBE)

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

## Takeaways
I learned to be extremely familiar with array iterator methods, since I used it extensively to check for hand rank. I didn't think it would be possible to have most of these functions done so elegantly, but some and filter methods made it possible.
(According to glassdoor, devising an algorithm for finding a hand of full house was an [actual Amazon interview question.](https://www.glassdoor.com/Interview/An-optimal-algorithm-to-check-whether-a-hand-of-cards-was-a-full-house-in-Poker-or-not-QTN_642094.htm))

Array iterator methods were also very useful in other scenarios. When I needed to convert of array of card objects to array of ranks, for example, the map function did the trick. Reduce function was also used to, for example, "reduce" hand of 7 cards to number of suits and ranks in a hand, which made for a very easy calculation of hand ranks.

Some of the more difficult bugs I had to troubleshoot involved edge cases that I didn't even foresee; one example is isStraightFlush(), which I had  more than I thought I would with the 7 hand configuration, because it was possible to have a 7 hand combination would have a flush and a straight, but not straight flush. In the end, I had to come up with an entire new way to solve the problem and that took at least another additional hour. On the bright side, I was also able to refactor my code for isStraight().

## Stretch Goals
- [x] Support up to 8 players (7 computer villains)
- [x] Implement proper tiebreaker system
- [ ] ~~Implement proper betting system~~ Basic betting system is done, but somewhat different from how a real poker game plays due to lack of AI.
- [ ] Implement timer for minimum bet to go up periodically
- [ ] Support mobile users
- [ ] Add rudimentary AI (randomly raising and folding depending on their hand strength in relation to the board. Random numbers will act as bluff)

## Resources
Spinning poker chip image: https://dribbble.com/shots/3151889-Poker-Chip-Spin

Gold coin image: https://99designs.com/other-art-illustration/contests/simple-very-straight-forward-d-gold-coin-animation-438878

Images of 52 playing cards and face-down cards: http://acbl.mybigcommerce.com/52-playing-cards/

confetti.js: https://gist.github.com/AvivJolt/5295793da533e4590d9449a514d2f62f#file-confetti-js

Yay sound: https://www.youtube.com/watch?v=NEIl1Xvf174

Background music when game plays: (https://www.youtube.com/watch?v=Aj7ecVrNdPU)

**Note**: The audio played is from a game called Persona 5, and its contents are trademarked and owned by the Atlus Co. Ltd. and Sega Corp. This audio is used for educational purposes only and is not intended for commercial use.

Super Mario game over audio: (https://www.youtube.com/watch?v=Furs535ly94)

**Note**: This audio is copyrighted by Nintendo Co. Ltd. and Sega Corp. This audio is used for educational purposes only and is not intended for commercial use.