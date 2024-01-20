
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/bidder', (req, res) => {
    res.sendFile(__dirname + '/public/bidder.html');
});

app.get('/auctioneer', (req, res) => {
    res.sendFile(__dirname + '/public/auctioneer.html');
});

let highestBid = 0;
let highestBidder = 'auctioneer';
let totalBids = 0;
let bidHistory = [];
let bidderStats = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('startAuction', (data) => {
        // Reset data
        highestBid = data.initialPrice;
        highestBidder = 'auctioneer';
        totalBids = 0;
        bidHistory = [];
        bidderStats = {};

        io.emit('auctionStarted', {
            initialPrice: data.initialPrice,
            itemName: data.itemName,
            timeLimit: data.timeLimit
        });
    });

    socket.on('newBid', (data) => {
        if (data.bidPrice > highestBid) {
            highestBid = data.bidPrice;
            highestBidder = data.bidderName;
            totalBids++;
    
            // Update bid history
            bidHistory.unshift({ name: data.bidderName, amount: data.bidPrice });
    
            // Update bidder stats
            if (!bidderStats[data.bidderName]) {
                bidderStats[data.bidderName] = { name: data.bidderName, highestBid: data.bidPrice, bidCount: 1 };
            } else {
                bidderStats[data.bidderName].bidCount++;
                if (data.bidPrice > bidderStats[data.bidderName].highestBid) {
                    bidderStats[data.bidderName].highestBid = data.bidPrice;
                }
            }
    
            // Broadcast updated info to all clients
            io.emit('bidUpdate', {
                highestBid: highestBid,
                highestBidder: highestBidder,
                totalBids: totalBids,
                bidders: Object.values(bidderStats).map(bidder => ({
                    name: bidder.name,
                    highestBid: bidder.highestBid,
                    bidCount: bidder.bidCount
                })),
                bidHistory: bidHistory
            });
        } else {
            socket.emit('bidFailed', {
                message: 'Your bid is lower than the current highest bid.'
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});