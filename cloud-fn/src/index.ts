import nacl from "tweetnacl";

import functions from "@google-cloud/functions-framework";

functions.http("hackWeeklyCommand", (req, res) => {
  const PUBLIC_KEY =
    "5cb905f19d79c1c76e6fe34046923e514cb0a79277c5c32868b71c3bcd0e4646"; //process.env.PUBLIC_KEY;
  const signature = req.headers["x-signature-ed25519"]! as string;
  const timestamp = req.headers["x-signature-timestamp"]!;
  const strBody = req.body; // should be string, for successful sign

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    return {
      statusCode: 401,
      body: JSON.stringify("invalid request signature"),
    };
  }

  // Replying to ping (requirement 2.)
  const body = JSON.parse(strBody);
  if (body.type == 1) {
    res.status(200).send;
    res.send({
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    });
  }
  res.send(`Hello ${req.query.name || req.body.name || "World"}!`);
});
