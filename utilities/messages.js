//moment modules to get the time
const moment = require('moment')

//function to be able to put the time of the messages 
function formatMessage(username, text){
    return{
        username,
        text,
        time: moment().format('h:mma')
    }
}
module.exports = formatMessage