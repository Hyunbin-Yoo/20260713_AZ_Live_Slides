const { app, output } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const signalROutput = output.generic({
    type: 'signalR',
    hubName: 'slideshow',
    connectionStringSetting: 'AzureSignalRConnectionString'
});

app.http('registerPhoto', {
    route: 'registerPhoto',
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [signalROutput],
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

        // Broadcast new photo to all connected clients via SignalR
        context.extraOutputs.set(signalROutput, {
            target: 'newPhoto',
            arguments: [{ url: data.url, id: created.resource.id }]
        });
        
        return { status: 201, jsonBody: created.resource };
    }
});
