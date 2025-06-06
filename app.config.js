export default {
    expo: {
        name: "Kookaburra",
        slug: "Kookaburra",
        extra: {
            FRONTEND_API_KEY: process.env.BACKEND_API_KEY,
            EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.BACKEND_CLERK_API,
        },
    },
};