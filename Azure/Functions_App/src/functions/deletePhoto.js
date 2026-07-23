const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('deletePhoto', {
    route: 'deletePhoto',
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const id = request.query.get('id');
        if (!id) return { status: 400, body: 'Photo ID required.' };

        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
        const container = client.database('PresentationState').container('PhotoQueue');

        try {
            await container.item(id, 'default').delete();
            return { status: 200, jsonBody: { deleted: true } };
        } catch (error) {
            return { status: 500, body: `Error deleting photo: ${error.message}` };
        }
    }
});
const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('deletePhoto', {
    route: 'deletePhoto',
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const id = request.query.get('id');
        if (!id) return { status: 400, body: 'Photo ID required.' };

        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
        const container = client.database('PresentationState').container('PhotoQueue');

        try {
            await container.item(id, 'default').delete();
            return { status: 200, jsonBody: { deleted: true } };
        } catch (error) {
            return { status: 500, body: `Error deleting photo: ${error.message}` };
        }
    }
});
