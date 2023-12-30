const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const app = express();
const PORT = 8081;

app.use(express.static('public'));
app.use(cors());
app.get('/trackPackage', async (req, res) => {
    const userInput = req.query.userInput;
    
    const url = `http://www.rapidposte.poste.tn/fr/Item_Events.asp?ItemId=${userInput}&submit=Valider`;

    try {
    const response = await axios.get(url);
    //beatufiy 
    const $ = cheerio.load(response.data);
    const table = $('#200');
    const rows = table.find('tr');
    const tableData = [];
    rows.each((index, row) => {
    const rowData = [];
      
    $(row).find('td').each((i, cell) => {
       
        rowData.push($(cell).text().trim());
    });
     
    tableData.push(rowData);
    });

    // Convert tableData to JSON
    const jsonData = JSON.stringify(tableData);


    res.send(jsonData);
    } catch (error) {
    res.status(500).send({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});