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
        await interaction.deferReply();
        // fetch movie poster
        const url = `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`;
        const moviesData = await fetch(url, options);
        const moviesJson = await moviesData.json();
        //const index = 0;
        const movie1 = moviesJson["results"][0];
        const movie2 = moviesJson["results"][1];
        const movie3 = moviesJson["results"][2];
        const movie4 = moviesJson["results"][3];
        
        const checkPoster = (movie) => {
            if (!movie.poster_path) {
                movie.poster_path = '';
            }
        }
        checkPoster(movie1);
        checkPoster(movie2);
        checkPoster(movie3);
        checkPoster(movie4);
        

        const buildEmbed = (image) => new EmbedBuilder().setURL('https://discord.js.org/').setImage(image);
        const embed1 = buildEmbed(`https://image.tmdb.org/t/p/w500${movie1.poster_path}`);
        const embed2 = buildEmbed(`https://image.tmdb.org/t/p/w500${movie2.poster_path}`);
        const embed3 = buildEmbed(`https://image.tmdb.org/t/p/w500${movie3.poster_path}`);
        const embed4 = buildEmbed(`https://image.tmdb.org/t/p/w500${movie4.poster_path}`);
        let embedMessage = await interaction.channel.send({embeds: [embed1, embed2, embed3, embed4]});
        console.log(interaction);
        console.log("--------------------------------------------");
        console.log(embedMessage);
        

        const button1 = new ButtonBuilder()
            .setCustomId('button1')
            .setLabel(`${movie1.title} (${movie1.release_date})`)
            .setStyle(ButtonStyle.Primary);
        const button2 = new ButtonBuilder()
            .setCustomId('button2')
            .setLabel(`${movie2.title} (${movie2.release_date})`)
            .setStyle(ButtonStyle.Primary);
        const button3 = new ButtonBuilder()
            .setCustomId('button3')
            .setLabel(`${movie3.title} (${movie3.release_date})`)
            .setStyle(ButtonStyle.Primary);
        const button4 = new ButtonBuilder()
            .setCustomId('button4')
            .setLabel(`${movie4.title} (${movie4.release_date})`)
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button1, button2, button3, button4);

        // response stores the InteractionResponse object from interaction.reply
        const response = await interaction.editReply({ 
            content: `Select a poster for ${movie}`,
            components: [row]
        });
        // collectorFilter is a boolean returning function, 
        // in this case it is true if the component user and original interaction user are the same
        const collectorFilter = i => i.user.id === interaction.user.id;  
        
        try {           
            // "collect Promise that resolves when any interaction passes the filter or throws an error if timeout" - discord.js doc
            // confirmation is a ButtonInteraction object
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000});

            if (confirmation.customId === 'button1') {
                await embedMessage.edit({ embeds: [embed1]});
                //await interaction.editReply({ content: `${movie1.title} selected https://image.tmdb.org/t/p/w500${movie1.poster_path}`, components: []});
            } else if (confirmation.customId === 'button2') {
                await embedMessage.edit({ embeds: [embed2]});
                //await interaction.editReply({ content: `${movie2.title} selected https://image.tmdb.org/t/p/w500${movie2.poster_path}`, components: []});
            } else if (confirmation.customId === 'button3') {
                await embedMessage.edit({ embeds: [embed3]});
                //await interaction.editReply({ content: `${movie3.title} selected https://image.tmdb.org/t/p/w500${movie3.poster_path}`, components: []});
            } else if (confirmation.customId === 'button4') {
                await embedMessage.edit({ embeds: [embed4]});
                //await interaction.editReply({ content: `${movie4.title} selected https://image.tmdb.org/t/p/w500${movie4.poster_path}`, components: []});
            }
            await interaction.deleteReply();
            //await embedMessage.delete();
        } catch (e) {
            console.error(e);
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: []})
        }
    },

}