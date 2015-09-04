module.exports = function()
{
    console.log(process.env.ENVIRONMENT);
    if ('dev' === process.env.ENVIRONMENT)
    {
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "fSLYaZCqLB+kr1AobqORSQrJ5LgIntKcGj+bLBgeKOqvRZlz3vdQwf+f3C5EaYt0+AeZyWr/Mcf9agtRdDDIyQ=="
        };
    }
    if ('stage' === process.env.ENVIRONMENT)
    {
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "fSLYaZCqLB+kr1AobqORSQrJ5LgIntKcGj+bLBgeKOqvRZlz3vdQwf+f3C5EaYt0+AeZyWr/Mcf9agtRdDDIyQ=="
        };
    }
    else if ('production' === process.env.ENVIRONMENT)
    {
        return {
            url: "https://ixcpm.documents.azure.com:443/",
            key: "BAVJ6Lb3xefcLJVh7iShAAngAHrYC08mtTj2ieVIVXuoBkftXwxKSCJaOcNrvctBwhi6oFoG6GlDVrDiDyXOzg=="
        };
    }
};
