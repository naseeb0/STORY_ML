import ElevenLabsService from '../src/services/elevenLabsTTS';

const texts: string[] = [
    "Nachos were invented in 1943 by Ignacio Anaya, nicknamed 'Nacho', when he created a quick snack for American military wives at a restaurant in Piedras Negras, Mexico.",
    "When the wives of American soldiers stationed at Fort Duncan arrived at the Victory Club restaurant after it had closed for the evening, Anaya quickly improvised with what he had.",
    "He fried corn tortilla chips, topped them with shredded cheese and sliced jalapeño peppers, and heated them until the cheese melted.",
    "The dish was a huge success, and the women began calling it 'Nacho's special'. The apostrophe eventually disappeared, and the dish became known simply as 'nachos'.",
    "The popularity of nachos grew steadily in Texas and the southwestern United States. In 1976, a modified version of the dish with cheese sauce was introduced as stadium food at Arlington Stadium.",
    "Today, nachos are a global snack food and can be found everywhere from movie theaters to sports stadiums, with countless variations of toppings and presentations."
];

async function main(): Promise<void> {
    try {
        console.log('Starting audio generation...');
        const audioUrls = await ElevenLabsService.generateAllSpeeches(texts);
        console.log('Audio files generated successfully!');
        console.log('Audio files:', audioUrls);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
