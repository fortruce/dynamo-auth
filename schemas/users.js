module.exports = {
  TableName: "Users",

  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },

  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S"
    },
    {
      AttributeName: "created_at",
      AttributeType: "N"
    }
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH"
    },
    {
      AttributeName: "created_at",
      KeyType: "RANGE"
    }
  ]
//  GlobalSecondaryIndexes: []
//  LocalSecondaryIndexes: []
};
