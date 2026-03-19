const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

axios.get('https://bulletin.du.edu/undergraduate/majorsminorscoursedescriptions/traditionalbachelorsprogrammajorandminors/computerscience/#coursedescriptionstext')
    .then(response => {
        const courses = [];
        const $ = cheerio.load(response.data);

        // go through each and pull the course name and number
        $('.courseblocktitle').each((index, courseElement) => {
            const fullTitle = $(courseElement).text().trim();

            const courseMatch = fullTitle.match(/(COMP\s+\d{4})/);
            const titleMatch = fullTitle.match(/(?<=COMP\s+\d{4}\s+).+/);

            if (courseMatch && titleMatch) {
                const courseNumber = courseMatch[0].replace(/\s+/, '-'); // format 
                const courseTitle = titleMatch[0].trim();
                
                courses.push({
                    course: courseNumber,
                    title: courseTitle
                });
            }
        });

        const data = { courses: courses };
        fs.writeFile('results/bulletin.json', JSON.stringify(data, null, 2), err => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Saved to results/bulletin.json');
            }
        });
    })
    .catch(error => {
        console.error('Error fetching and parsing the page:', error);
    });



