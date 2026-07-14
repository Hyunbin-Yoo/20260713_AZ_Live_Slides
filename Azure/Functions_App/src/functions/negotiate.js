const { app, input } = require('@azure/functions');

const signalRConnectionInfo = input.generic({
    type: 'signalRConnectionInfo',
    hubName: 'slideshow',
    connectionStringSetting: 'AzureSignalRConnectionString'
});

app.http('negotiate', {
    route: 'negotiate',
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    extraInputs: [signalRConnectionInfo],
    handler: async (request, context) => {
        const connectionInfo = context.extraInputs.get(signalRConnectionInfo);
        return { status: 200, jsonBody: connectionInfo };
    }
});