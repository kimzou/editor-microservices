const errorHandling = ({ message }) => {
    switch (true) {
        case (message.startsWith("request to http://")):
            const service = message.split(" ").splice(-1)
            return new Error(`Server down: ${service}`);
        default:
            console.log("switch default")
            break;
    }
}

module.exports = { errorHandling }