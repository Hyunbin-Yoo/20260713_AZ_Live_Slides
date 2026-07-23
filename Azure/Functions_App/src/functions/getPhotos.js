const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getPhotos', {
    route: 'getPhotos',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
        const container = client.database('PresentationState').container('PhotoQueue');

        const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.id != "currentPhase" ORDER BY c.timestamp DESC'
        }).fetchAll();

        return { status: 200, jsonBody: resources };
    }
});
const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getPhotos', {
    route: 'getPhotos',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
        const container = client.database('PresentationState').container('PhotoQueue');

        const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.id != "currentPhase" ORDER BY c.timestamp DESC'
        }).fetchAll();

        return { status: 200, jsonBody: resources };
    }
});
