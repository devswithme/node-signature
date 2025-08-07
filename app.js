const http = require("http");
const crypto = require("crypto");

const server = http.createServer((req, res) => {
  if (req.method == "POST" && req.url == "/signature") {
    let body = "";

    req.on("data", (chunk) => (body += chunk));

    req.on("end", () => {
      try {
        const { merchant_ref, amount } = JSON.parse(body);
        const privateKey = process.env.PRIVATE_KEY;
        const merchant_code = process.env.MERCHANT_CODE;

        const hmac = crypto.createHmac("sha256", privateKey);
        hmac.update(`${merchant_code}${merchant_ref}${amount}`);

        const signature = hmac.digest("hex");

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ signature }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
