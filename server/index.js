const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const { request } = require("express");
//p@ssw0rd'9'!

const uri = "mongodb+srv://root:p%40ssw0rd%279%27%21@cluster0.uuuvo.mongodb.net/searchDb?retryWrites=true&w=majority"
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
const server = Express();
server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use(Cors());
var collection;
server.get("/search", async (request, response) => {
    try {
        let result = await collection.aggregate([
            {
                "$search": {
                    "index":"default",
                    "compound":{
                        "should":[
                            {
                                "autocomplete": {
                                    "query": `${request.query.query}`,
                                    "path": "address",
                                    "fuzzy": {
                                        "maxEdits": 2,
                                        "prefixLength": 3
                                    }
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": `${request.query.query}`,
                                    "path": "name",
                                    "fuzzy": {
                                        "maxEdits": 2,
                                        "prefixLength": 3
                                    }
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": `${request.query.query}`,
                                    "path": "pincode",
                                    "fuzzy": {
                                        "maxEdits": 2,
                                        "prefixLength": 3
                                    }
                                }
                            },
                            {
                                "text": {
                                    "query": `${request.query.query}`,
                                    "path": "items",
                                    "fuzzy": {
                                        "maxEdits": 2,
                                        "prefixLength": 3
                                    }
                                }
                            }

                            
                        ]
                    },
                    
                }
            }
        ]).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});
server.get("/get/:id", async (request, response) => {
    try {
        let result = await collection.findOne({ "_id": ObjectID(request.params.id) });
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});
server.listen("5001", async () => {
    try {
        await client.connect();
        collection = client.db("searchDb").collection("user");
        console.log("connected")
    } catch (e) {
        console.error(e);
    }
});