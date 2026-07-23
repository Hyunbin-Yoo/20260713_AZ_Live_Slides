const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('setPhase', {
    route: 'setPhase',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { phase } = await request.json();
        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
        const container = client.database('PresentationState').container('PhotoQueue');

        // Upsert a document that stores the current phase
        await container.items.upsert({
            id: 'currentPhase',
            phase: phase,
            timestamp: new Date().toISOString()
        });

        return { status: 200, jsonBody: { phase } };
    }
});
