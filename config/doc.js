module.exports = function()
{
    if ('develop' === process.env.ENVIRONMENT)
    {
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "fSLYaZCqLB+kr1AobqORSQrJ5LgIntKcGj+bLBgeKOqvRZlz3vdQwf+f3C5EaYt0+AeZyWr/Mcf9agtRdDDIyQ==",
            docDbName: "ixcpm"
        };
    }
    if ('stage' === process.env.ENVIRONMENT)
    {
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "fSLYaZCqLB+kr1AobqORSQrJ5LgIntKcGj+bLBgeKOqvRZlz3vdQwf+f3C5EaYt0+AeZyWr/Mcf9agtRdDDIyQ==",
            docDbName: "ixcpm"
        };
    }
    else if ('production' === process.env.ENVIRONMENT)
    {
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "BAVJ6Lb3xefcLJVh7iShAAngAHrYC08mtTj2ieVIVXuoBkftXwxKSCJaOcNrvctBwhi6oFoG6GlDVrDiDyXOzg==",
            docDbName: "ixcpm"
        };
    }
    else
    {
        //デフォルト
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "fSLYaZCqLB+kr1AobqORSQrJ5LgIntKcGj+bLBgeKOqvRZlz3vdQwf+f3C5EaYt0+AeZyWr/Mcf9agtRdDDIyQ==",
            docDbName: "ixcpm"
        };
    }
};
