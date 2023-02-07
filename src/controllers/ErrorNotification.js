
const fs = require('fs');

module.exports = async (req, res) => {
    try {
        fs.readFile('error.log', 'utf8', (err, data) => {
            if (err) {
                console.error(`An error occurred while reading the file: ${err}`);
                return;
            }

            const lines = data.split('\n');
            result = [];
            i = 0;
            for (const line of lines) {
                result[i] = line.split("[|]");
                i++;
            }

            res.render('error-notifications', {
                reports: result,
            });
        });


    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}

