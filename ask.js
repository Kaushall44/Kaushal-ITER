const http = require('http');

const question = process.argv[2];

if (!question) {
    console.log('Usage: node ask.js "your question"');
    process.exit(1);
}

const url = `http://localhost:3000/ask?q=${encodeURIComponent(question)}`;

http.get(url, (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(data);
        } else {
            console.error(`Error: Server responded with status code ${res.statusCode}`);
            console.error(data);
        }
    });

}).on('error', (err) => {
    console.error('Error: ' + err.message);
});
