// Require the express web application framework (https://expressjs.com)
const express = require('express')

// Additional package for logging of HTTP requests/responses
const morgan = require('morgan');

// Create a new web application by calling the express function
const app = express()
let sqlite3 = require('sqlite3').verbose();

// persistent file database "myDB" in the server folder
let db = new sqlite3.Database('./server/myDB.db');

const port = 3000

// Added to support access to file system paths
const path = require('path');

// Include the logging for all requests
app.use(morgan('common'));

// Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));

// Add a middleware to handle the JSON requests (fetch)
app.use(express.json());

// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public_html'))

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// GET routing for product listing setup
app.get('/server/products.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'server', 'products.json'));
});

// Create a help request table to store form submission from users
db.run(`
  CREATE TABLE IF NOT EXISTS help_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fname TEXT,
    lname TEXT,
    customer_id TEXT,
    email TEXT,
    phone TEXT,
    order_num TEXT,
    issue_type TEXT,
    issue_desc TEXT
  )
`);

// Post handler to route the form submission
app.post('/submitHelpRequest', (req, res) => {
  const { fname, lname, customer_id, email, phone, order_num, issue_type, issue_desc } = req.body;

  // Prepare a statement
  const query = db.prepare(`
      INSERT INTO help_requests (fname, lname, customer_id, email, phone, order_num, issue_type, issue_desc)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

  // Run the query
  query.run(fname, lname, customer_id, email, phone, order_num, issue_type, issue_desc, (err) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      // Return as JSON response
      return res.status(500).json({ success: false, message: 'Database insertion failed.' });
    }
    // After inserting, use fetch all help requests in order to display to helprequests.ejs
    db.all('SELECT * FROM help_requests', (err, rows) => {
      if (err) {
        console.error('Error retrieving data:', err.message);
        // Return error as JSON
        return res.status(500).json({ success: false, message: 'Database query failed.' });
      }
      // Return success response as JSON
      return res.status(200).json({ success: true, message: 'Form submitted successfully!' });
    });
  });
});

// Route to view all help requests
app.get('/helprequests', (req, res) => {
  db.all('SELECT * FROM help_requests', (err, rows) => {
    if (err) {
      console.error('Error retrieving data:', err.message);
      return res.status(500).send('Database query failed.');
    }
    res.render('helprequests', { title: 'EDC All Help Request Submissions', requests: rows });
  });
});

// Tell our application to listen to requests at port 3000 on the localhost
app.listen(port, () => {
  // When the application starts, print to the console that our app is
  // running at http://localhost:3000. Print another message indicating
  // how to shut the server down.
  console.log(`Web server running at: http://localhost:${port}`)
  console.log(`Type Ctrl+C to shut down the web server`)
})
