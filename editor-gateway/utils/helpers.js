const errorHandling = ({ message }) => {
    console.log({ message })
    switch (true) {
        case (message.startsWith("request to http://")):
            // get the url an thow it with the error
            console.log("caaaaaaase")
            return new Error('server down');
        default:
            console.log("swith default")
            break;
    }
}

module.exports = { errorHandling }