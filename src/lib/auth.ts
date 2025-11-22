export const authConfig = {
    providers: [],
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/',
    },
};

export default authConfig;
