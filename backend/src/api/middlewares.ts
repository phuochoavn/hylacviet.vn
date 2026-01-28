import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
    routes: [
        {
            method: ["POST", "PUT"],
            matcher: "/admin/uploads",
            bodyParser: {
                sizeLimit: "50mb",
            },
        },
        {
            method: ["POST", "PUT"],
            matcher: "/admin/products", // Also often needed for product updates with inline data
            bodyParser: {
                sizeLimit: "50mb",
            },
        },
        {
            method: ["POST", "PUT"],
            matcher: "/admin/collections",
            bodyParser: {
                sizeLimit: "50mb",
            },
        },
        // Product media uploads (for editing product images)
        {
            method: ["POST", "PUT", "DELETE"],
            matcher: "/admin/products/:id/media",
            bodyParser: {
                sizeLimit: "50mb",
            },
        },
        // Wildcard for all upload sub-routes
        {
            method: ["POST"],
            matcher: "/admin/uploads/*",
            bodyParser: {
                sizeLimit: "50mb",
            },
        },
    ],
})
