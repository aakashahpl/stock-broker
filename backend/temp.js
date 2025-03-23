const fetch = require("node-fetch");


async function callLambdaAPI(ticker) {
    const url = "https://your-api-gateway-url"; // Replace with API Gateway URL
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker })
    });

    const data = await response.json();
    console.log(data);
}

// Example: Call with "AAPL"
callLambdaAPI("AAPL");
