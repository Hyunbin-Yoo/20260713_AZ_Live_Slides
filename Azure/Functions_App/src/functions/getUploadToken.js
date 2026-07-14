const { app } = require('@azure/functions');
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');

app.http('getUploadToken', {
    route: 'getUploadToken',
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const filename = request.query.get('filename') || (await request.json()).filename;
        if (!filename) return { status: 400, body: 'Filename required.' };

        const connStr = process.env.STORAGE_CONNECTION_STRING;
        const matches = connStr.match(/AccountName=([^;]+);AccountKey=([^;]+)/);
        const sharedKeyCredential = new StorageSharedKeyCredential(matches[1], matches[2]);
        
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient('live-photos');
        await containerClient.createIfNotExists({ access: 'blob' });

        const startDate = new Date();
        const expiryDate = new Date(startDate.valueOf() + 15 * 60 * 1000); // 15 min expiry
        
        const sasToken = generateBlobSASQueryParameters({
            containerName: 'live-photos',
            blobName: filename,
            permissions: BlobSASPermissions.parse("racwd"),
            startsOn: startDate,
            expiresOn: expiryDate,
        }, sharedKeyCredential).toString();

        return {
            status: 200,
            jsonBody: { uploadUrl: `${containerClient.getBlobClient(filename).url}?${sasToken}` }
        };
    }
});