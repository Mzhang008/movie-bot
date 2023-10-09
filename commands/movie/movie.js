const { EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder, Component, Client } = require('discord.js');
//const fetch = require('node-fetch');
const { options } = require("../../config.json");



module.exports = {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription('Select a Movie Poster to Post')
        .addStringOption(option =>
            option
                .setName('movie')
                .setDescription('Movie input')
                .setRequired(true)),
    async execute(interaction) {
        
        const movie = interaction.options.getString('movie');
        console.log(`Query: ${movie}`);
        await interaction.deferReply();
        // fetch movie poster
        const url = `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`;
        const moviesData = await fetch(url, options);
        const moviesJson = await moviesData.json();
        
        const movieArray = [];
        const resultsTotal = moviesJson["results"].length;
        if (resultsTotal == 0 ) {
            await interaction.editReply('no results for movies with that name, message will be deleted in a few seconds')
                .then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                });
        } else {

        const currentIndex = 0;

        // handle cases of less than 4 results
        let embedNum = () => {
            if (resultsTotal < 4) {
                return resultsTotal;
            } else {
                return 4;
            }
        };
        
        const pushMovie = (index) => { 
            movieArray.push(moviesJson["results"][index]) 
        }
        //probably poorly written
        const getMovies = () => {
            
            let batch = embedNum();
            for (let i = 0; i < batch; i ++) {
                pushMovie(currentIndex + i);
                
            }
            //currentIndex += batch; not needed here might be better as a separate function
        }
        getMovies();

        // need to check if properties we want to use are populated
        const checkPoster = (movie) => {
            if (movie.poster_path === undefined || movie.poster_path === null) {
                return false;
            } else {
                return movie.poster_path;
            }
        }
        
        

        const buildEmbed = (image) => new EmbedBuilder().setURL('https://discord.js.org/').setImage(image);
        const createEmbedArray = (movieArray) => {
            let result = [];
            for (movies of movieArray) {
                const embed = buildEmbed(`https://image.tmdb.org/t/p/w500${checkPoster(movies)}`);
                result.push(embed);
            }
            return result;
        }
        //create array of movies
        const embedCollage = createEmbedArray(movieArray);

        let embedMessage = await interaction.channel.send({embeds: embedCollage });    

        const buildButton = (index, movie) => {
            let label = movie.title;
            console.log(label);
            if (label.length > 80) {
                label = label.slice(0, 60);
            }
            const button = new ButtonBuilder()
                .setCustomId(`button${index}`)
                .setLabel(`${label} (${movie.release_date})`)
                .setStyle(ButtonStyle.Primary);
            return button;
        }

        let buttons = [];
        const fillButtonsArray = () => {
            let index = 1;
            for (movies of movieArray) {
                
                buttons.push(buildButton(index, movies));
                index++;
            }};
        fillButtonsArray();

        //create the buttons

        const row = new ActionRowBuilder();
        for (button of buttons) {
            row.addComponents(button);
        }
        
        // cancel button
        const cancelButton = new ButtonBuilder()
            .setCustomId('cancelButton')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);
        row.addComponents(cancelButton);
    
        // response stores the InteractionResponse object from interaction.reply
        const response = await interaction.editReply({ 
            content: `Select a poster for ${movie}`,
            components: [row]
        });
        // collectorFilter is a boolean returning function, 
        // in this case it is true if the component user and original interaction user are the same (aka same person who typed the command and pressed the button)
        const collectorFilter = i => i.user.id === interaction.user.id;  
        
        try {           
            // "collect Promise that resolves when any interaction passes the filter or throws an error if timeout" - discord.js doc
            // confirmation is a ButtonInteraction object
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000});

            if (confirmation.customId === 'button1') {
                await embedMessage.delete();
                await interaction.channel.send({ embeds: [embedCollage[0]]});
            } else if (confirmation.customId === 'button2') {
                await embedMessage.delete();
                await interaction.channel.send({ embeds: [embedCollage[1]]});
            } else if (confirmation.customId === 'button3') {
                await embedMessage.delete();
                await interaction.channel.send({ embeds: [embedCollage[2]]});
            } else if (confirmation.customId === 'button4') {
                await embedMessage.delete();
                await interaction.channel.send({ embeds: [embedCollage[3]]});
            } else if (confirmation.customId === 'cancelButton') {
                await embedMessage.delete();
            }
            await interaction.deleteReply();
        } catch (e) {
            console.error(e);
            await embedMessage.delete();
            await interaction.deleteReply();
        }
        }
    },

}