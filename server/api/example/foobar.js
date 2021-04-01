var router = require("express").Router();
var example = require('./example-model')
const {PubSub} = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
var subscription

async function subPull(req, res) {
  
    subscription = pubSubClient.subscription("my-topic-sub");
    res.status(200).send()
  
  }


  async function pullTopic(req, res) {
    console.log("pulling")
      // Create an event handler to handle messages
      let messageCount = 0;
      const messageHandler = message => {
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);
        messageCount += 1;
    
        // "Ack" (acknowledge receipt of) the message
        // broadcast(req.app.locals.clients, `"${message.data}"`);
  
        // console.log(typeof message.data)
        // console.log(message.data)
        // console.log(message.data.toString())
  
        // console.log(message.attributes)
        
        //broadcast(req.app.locals.clients, message);
        message.ack();
      };
    
      // Listen for new messages until timeout is hit
      // console.log(subscription)
      if (subscription != undefined)
      {
      subscription.on('message', messageHandler);
    
      setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received.`);
      }, 2 * 1000);
    }
    
    console.log("done")
    res.status(200).send()
  
  }
  

function getFoo (req, res) {
    console.log('a')
    res.json({"a" : "aaaaa"} )
}

function getExampleDB (req, res) {
  example.find((err, result) =>
  {
    if(err) {console.log(error)}
    else { res.json(result)}

  })

}

router.get('/foobar', getFoo)
router.get('/sub', subPull)
router.get('/pull', pullTopic)
router.get('/db', getExampleDB)

module.exports = router;