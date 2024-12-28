const constants = {
    local: {
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        auth0: {
            domain: "MSP-2-dev.us.auth0.com",
            clientId: "EPt7dIlFC4wbMy71lFth0cyVvGnmY6O9",
            redirectURI:
                process.env.NEXT_PUBLIC_AUTH_0_PROVIDER_REDIRECT_URI ||
                "http://localhost:3000/auth/callback/",
            audience: "https://MSP-2-dev.us.auth0.com/api/v2/",
            scope: "read:current_user update:current_user_metadata",
        },
        stream: {
            clientKey: "d56s8uta297n",
        },
        api: {
            baseUrl: "http://localhost",
            auth: ":5000/auth",
            admin: ":5001/admin",
            company: ":5002/company",
            meet: ":5003/meet",
            message: ":5004/message",
            schedule: ":5005/schedule",
            user: ":5006/user",
            mediaFile: ":5008/media-file",
        },
    },
    dev: {
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        auth0: {
            domain: "MSP-2-dev.us.auth0.com",
            clientId: "EPt7dIlFC4wbMy71lFth0cyVvGnmY6O9",
            redirectURI:
                process.env.NEXT_PUBLIC_AUTH_0_PROVIDER_REDIRECT_URI ||
                "http://localhost:3000/auth/callback/",
            audience: "https://MSP-2-dev.us.auth0.com/api/v2/",
            scope: "read:current_user update:current_user_metadata",
        },
        stream: {
            clientKey: "d56s8uta297n",
        },
        api: {
            baseUrl: "https://api.dev.MSP.com",
            auth: "/auth",
            admin: "/admin",
            company: "/company",
            meet: "/meet",
            message: "/message",
            schedule: "/schedule",
            user: "/user",
            mediaFIle: "/media-file",
        },
    },
    staging: {
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        auth0: {
            domain: "MSP-2-staging.us.auth0.com",
            clientId: "5bcNfAEchGvXC34cxbpgP6wSSIFXU0Nm",
            redirectURI:
                process.env.NEXT_PUBLIC_AUTH_0_PROVIDER_REDIRECT_URI ||
                "http://localhost:3000/auth/callback/",
            audience: "https://MSP-2-staging.us.auth0.com/api/v2/",
            scope: "read:current_user update:current_user_metadata",
        },
        stream: {
            clientKey: "k4pcakgu879x",
        },
        api: {
            baseUrl: "https://api.staging.MSP.com",
            auth: "/auth",
            admin: "/admin",
            company: "/company",
            meet: "/meet",
            message: "/message",
            schedule: "/schedule",
            user: "/user",
            mediaFIle: "/media-file",
        },
    },
};

const appEnvConstants = process.env.NEXT_PUBLIC_APP_ENV
    ? constants[process.env.NEXT_PUBLIC_APP_ENV]
    : constants["local"];

export default appEnvConstants;
