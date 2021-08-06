# WHAC-A-ROFL

## About the game

Dear Fren, we need your help! The Lickquidators have invaded Rolf Reefs causing a yuuuge migration of MEME frogs to Poly Lakes. Try to be quick and get rid of the Rofls before it is too late! But be careful, Lickquidators are lurking around and they can suck the life out of your Gotchi with their disgusting tongue. Good luck on your mission, Gotchigang is stronk and together we will stop the plague!


## Structure and code organization

This game was based on the official Aavegotchi minigame template. This template allows you to create your own Aavegotchi minigames without any prior knowledge of web3. A basic understanding of Javascript and Typescript is necessary.

The template includes both the *app* and *server* directories. The *app* consists of [Phaser3](https://phaser.io/phaser3) with a [React](https://reactjs.org/) wrapper. Phaser is a 2D game framework used for making HTML5 games for desktop and mobile. React is used for an intuitive main menu UI, as well as giving access to custom hooks for a more smooth Web3 / Aavegotchi integration.

The *server* consists of *nodejs* and *express* and it utilises [socket.io](https://socket.io/) to enable web socket functionality within the game. This is necessary to enable multiplayer. However it is also required for single player games, as it allows for server side logic to prevent people using client side dev tools to intercept and send false data to your games leaderboard (If you have one set up that is).

The game is made up of two directories, the *server* and the *app*. The two directories run independently of one another and therefore have their own dependencies. Please visit https://github.com/aavegotchi/aavegotchi-minigame-template for more info about how to install and run the code locally
