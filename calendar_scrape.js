const { default: axios } = require('axios');
const cheerio = require('cheerio');
const { default: fsExtra } = require('fs-extra/esm');
const fs = require('fs');


axios.get('https://www.du.edu/calendar')
    .then(response => {
        const $ = cheerio.load(response.data);
        let obj;

        const formatted = {'events': []};
        $('.events-listing__item').each((i,event) => {
            formatted.events.push({
                title: $(event).find("h3").text().replace(/\n/g, '').trim(),
                date: $(event).find("p").eq(0).text().replace(/\n/g, '').trim(),
                time: $(event).find("p").eq(1).text().replace(/\n/g, '').trim()
            });
        });

        fs.writeFileSync('results/calendar_events.json', JSON.stringify(formatted, null, 2));
        console.log(`Saved ${formatted.events.length} events`);
        

    })
    .catch(error =>
        console.log('error:', error)
    )