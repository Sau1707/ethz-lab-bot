import { load } from 'cheerio';
import fetch from 'node-fetch';

async function getHTML() {
    return fetch("https://www.lehrbetrieb.ethz.ch/laborpraktika/praktikum.view?sum=-700157776", {
        "headers": {
          // ADD THE HEADERS HERE
        },
        "body": null,
        "method": "GET"
      }).then(res => res.text()).then(load)
}

async function getSnippets() {
    let data = {}
    const $ = await getHTML()

    // Select all div elements with class "snippet"
    const snippets = $('div.praktikumHeader');

    // Iterate through each snippet
    snippets.each((index, snippet) => {
        const $snippet = $(snippet);

        // Find the <th> tag which contains the name
        const nameTag = $snippet.find('th').first();

        // Find the <th> tag which contains "anmeldbar" and get its text
        const anmeldbarTag = $snippet.find('th:contains("anmeldbar:")');
        const anmeldbarValue = anmeldbarTag.text().split(':')[1].trim();

        // Extract the name
        const name = nameTag.text().trim();

        data[name] = anmeldbarValue
    });

    return data
}


export { getSnippets }