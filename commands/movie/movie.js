const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder, Component } = require('discord.js');

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
        
        const button1 = new ButtonBuilder()
            .setCustomId('button1')
            .setLabel('1')
            .setStyle(ButtonStyle.Primary);


        const row = new ActionRowBuilder()
            .addComponents(button1);

        await interaction.reply({ 
            components: [row]
        });

    },

}