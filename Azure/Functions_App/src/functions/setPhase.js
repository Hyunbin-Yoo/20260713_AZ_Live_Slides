const { app } = require('@azure/functions');

app.http('setPhase', {
    route: 'setPhase',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { phase } = await request.json();
        return { status: 200, jsonBody: { phase } };
    }
});