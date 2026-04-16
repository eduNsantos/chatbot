
import app from "./src/app.js";

const PORT = Number(process.env.SERVER_PORT) || 3000;

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`);
});


