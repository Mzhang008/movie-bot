movie-bot

Use /movie to bring up prompt to enter movie title

![Animation](https://github.com/Mzhang008/movie-bot/assets/71112589/464edd64-807d-4776-9f1d-df1a6f3451a6)

What I learned building the discord bot
- how to build a node.js application using discord.js, a Node.js library for the Discord API
- how to use fs and path to generate filepaths 
- how to separate code for commands and events into separate modules per discord.js
- how to load commands into memory 
- add event handling to client instance to detect and respond to ClientReady and InteractionCreate events 

- register a personal use token for TMDB (The Movie Database) and followed the documentation to use the API to search and pull JSON movie data
- build a UI using discord.js component buttons with text from TMDB title data 
- build EmbedMessage to display up to four movie posters in an embedded image collage/album
- refactored code to handle errors and variations due to gaps in received data or missing data (e.g. 0 entries for given title)

TODO
- create button to display next 4 results, plan to use global current index
- handle cases where the movie data exists but does not have a poster (use next and test as test cases)
