const { default: axios } = require('axios');
const cheerio = require('cheerio');
const { default: fsExtra } = require('fs-extra/esm');
const fs = require('fs');


axios.get('https://denverpioneers.com/')
    .then(response => {
        const $ = cheerio.load(response.data);
        let obj;

        // Step 1: Find the script tag containing event data
        let dataScript = null;
        $('script').each((i, script) => {
            const html = $(script).html();
            if (html && html.includes('"school_name":"University of Denver"') && html.includes('var obj = ')) {
                let jsonStr = html.slice(15,63697);
                obj = JSON.parse(jsonStr);
                console.log(typeof(obj))
            }

        });


        if (!obj) {
            console.log('Event data not found');
            return;
        }

        const formatted = {'events': []};
        obj.data.forEach(event => {
            formatted.events.push({
                duTeam: event.sport.title,
                opponent: event.opponent.name,
                date: event.date
            });
        });

        fs.writeFileSync('results/athletic_events.json', JSON.stringify(formatted, null, 2));
        console.log(`Saved ${formatted.events.length} events`);
        

    })
    .catch(error =>
        console.log('error:', error)
    )