declare namespace NodeJS {
    export interface ProcessEnv {
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        PORT: string;
        TOKEN_KEY: string;
        EMAIL_USER: string;
        EMAIL_PASSWORD: string;
    }
}
