const apiUrl = "https://api.binance.com/api/v3/ticker/24hr";
let portfolioValue = 0;
let cryptoPrice = 0;

// Fetch crypto data from Binance API
async function fetchCryptoData() {
    const symbol = document.getElementById('cryptoSymbol').value.toUpperCase();
    if (!symbol) {
        alert("Please enter a valid cryptocurrency symbol!");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?symbol=${symbol}`);
        const data = await response.json();

        if (data.symbol) {
            cryptoPrice = parseFloat(data.lastPrice);
            document.getElementById('cryptoName').innerText = `Crypto: ${symbol}`;
            document.getElementById('cryptoPrice').innerText = `$${cryptoPrice.toFixed(2)}`;
            document.getElementById('cryptoChange').innerText = `${parseFloat(data.priceChangePercent).toFixed(2)}%`;

            updateChart(symbol);
        } else {
            alert('Invalid cryptocurrency symbol or API error.');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert('Failed to fetch data.');
    }
}

// Simulate a buy trade
function buyCrypto() {
    const amount = parseFloat(document.getElementById('tradeAmount').value);
    if (!amount || amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }
    portfolioValue += amount * cryptoPrice;
    updatePortfolio();
}

// Simulate a sell trade
function sellCrypto() {
    const amount = parseFloat(document.getElementById('tradeAmount').value);
    if (!amount || amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }
    portfolioValue -= amount * cryptoPrice;
    updatePortfolio();
}

// Update portfolio display
function updatePortfolio() {
    document.getElementById('portfolio').innerText = `Portfolio Value: $${portfolioValue.toFixed(2)}`;
}

// Initialize chart
let cryptoChart;
function updateChart(symbol) {
    const ctx = document.getElementById('cryptoChart').getContext('2d');
    
    if (cryptoChart) cryptoChart.destroy();

    cryptoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0s', '10s', '20s', '30s', '40s', '50s'],
            datasets: [{
                label: `${symbol} Price`,
                data: Array(6).fill(cryptoPrice),
                borderColor: '#00ff00',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });

    setInterval(async () => {
        const response = await fetch(`${apiUrl}?symbol=${symbol}`);
        const data = await response.json();
        cryptoPrice = parseFloat(data.lastPrice);
        cryptoChart.data.datasets[0].data.shift();
        cryptoChart.data.datasets[0].data.push(cryptoPrice);
        cryptoChart.update();
    }, 10000);
}
