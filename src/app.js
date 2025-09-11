require('dotenv').config();

const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { Credentials } = require('aws-sdk');

// console.log(process.env.AWS_DEFAULT_REGION);

const client = new DynamoDBClient({
    region: "us-east-1",
    
});



async function main() {
    const listTablesCommand = new ListTablesCommand();
    const res = await client.send(listTablesCommand);
        // console.log({ tables: res.TableNames });
    console.log({ res });

}

main()
    .catch(err => console.log(err));