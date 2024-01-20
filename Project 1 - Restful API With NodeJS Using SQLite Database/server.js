const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const dbName = 'api.db';

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Check if the database exists. If it does, delete it.
if (fs.existsSync(dbName)) {
    fs.unlinkSync(dbName);
}

// Create and initialize the database
const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');

    const createTable = `
        CREATE TABLE movies (
            rowid INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            release_year TEXT,
            time_viewed TEXT
        );
    `;

    db.run(createTable, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

// Routes start from here

// GET for collection to get all the movies
app.get('/api/', (req, res) => {
    db.all('SELECT * FROM movies', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Put for collection to update a movie
app.put('/api/', (req, res) => {
    if (Array.isArray(req.body)) {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // Delete existing movies
            db.run('DELETE FROM movies');
            
            // Insert new movies
            const stmt = db.prepare('INSERT INTO movies (title, release_year, time_viewed) VALUES (?, ?, ?)');
            for (let movie of req.body) {
                stmt.run([movie.title, movie.release_year, movie.time_viewed], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({error: 'Failed to insert movie: ' + err.message});
                    }
                });
            }
            stmt.finalize();

            db.run('COMMIT');
            res.json({status: "REPLACE COLLECTION SUCCESSFUL"});
        });
    } else {
        res.status(400).json({error: 'Expected an array in the request body.'});
    }
});

// Post for collection to add a new movie
app.post('/api/', (req, res) => {
    if (!req.body.title || !req.body.release_year || !req.body.time_viewed) {
        return res.status(400).json({error: 'Missing required fields.'});
    }
    
    const stmt = db.prepare('INSERT INTO movies (title, release_year, time_viewed) VALUES (?, ?, ?)');
    stmt.run([req.body.title, req.body.release_year, req.body.time_viewed], function(err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({status: "CREATE ENTRY SUCCESSFUL", rowid: this.lastID}); // Return the rowid
    });
});

// Delete for collection to delete all movies
app.delete('/api/', (req, res) => {
    db.run('DELETE FROM movies', (err) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({status: "DELETE COLLECTION SUCCESSFUL"});
    });
});

// Get for an item to retrieve a movie by its rowid
app.get('/api/:id', (req, res) => {
    const rowid = req.params.id;
    db.get('SELECT * FROM movies WHERE rowid = ?', [rowid], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({error: 'Movie not found.'});
        }
    });
});

// PUT for an item to update a movie by its rowid
app.put('/api/:id', (req, res) => {
    const rowid = req.params.id;
    const { title, release_year, time_viewed } = req.body;

    if (!title || !release_year || !time_viewed) {
        return res.status(400).json({error: 'Missing required fields.'});
    }

    const stmt = db.prepare('UPDATE movies SET title = ?, release_year = ?, time_viewed = ? WHERE rowid = ?');
    stmt.run([title, release_year, time_viewed, rowid], (err) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({status: "UPDATE ITEM SUCCESSFUL"});
    });
});

// DELETE for an item to delete a movie by its rowid
app.delete('/api/:id', (req, res) => {
    const rowid = req.params.id;

    db.run('DELETE FROM movies WHERE rowid = ?', [rowid], (err) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({status: "DELETE ITEM SUCCESSFUL"});
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
