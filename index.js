const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

// Middleware
app.set('views', __dirname + '/views'); 

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;



const config = {
    headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (_req, res) => {

    try {
        const response = await axios.get(
            'https://api.hubapi.com/crm/v3/objects/p_cars?limit=10&properties=car_name,country,car_model&archived=false',
            config
        );

        const cars = response.data.results.map(car => ({
            name: car.properties.car_name,
            model: car.properties.car_model,
            country: car.properties.country
        }));

        res.render('homepage', { cars });

    } catch (error) {
        console.error('Error fetching cars:', error.message);
        res.send('Error fetching cars. Check server console.');
    }
});




// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (_req, res) => {
  res.render('updates');
});





// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
  try {
    const { car_name, car_model, country } = req.body;

    const body = {
      properties: {
        car_name: car_name || '',
        car_model: car_model || '',
        country: country || ''
      }
    };

    const createUrl = 'https://api.hubapi.com/crm/v3/objects/p_cars';

    await axios.post(createUrl, body, config);

    res.redirect('/');
  } catch (err) {
    console.error('Error creating car:', err.response?.data || err.message);
    res.status(500).send('Error creating record. Check server console for details.');
  }
});


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.poste',  sample
app.post('/updatasync (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/
    ``

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));