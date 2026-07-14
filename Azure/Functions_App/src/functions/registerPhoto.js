const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('registerPhoto', {
    route: 'registerPhoto',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const data = await request.json();
        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
        const container = client.database('PresentationState').container('PhotoQueue');

        const created = await container.items.create({
            id: `${Date.now()}`,
            phase: data.phase || 'default',
            url: data.url,
            timestamp: new Date().toISOString()
        });
        
        return { status: 201, jsonBody: created.resource };
    }
});