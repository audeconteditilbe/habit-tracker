/**
 * This file was auto-generated.
 * Do not make direct changes to the file.
 * Instead, run "yarn build:api-types" to re-generate it.
 */

export interface paths {
    "/api/entries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Retrieve a list of entries filtered by habit and date range. */
        get: operations["entries_list"];
        put?: never;
        /** @description Create a new entry for a habit. */
        post: operations["entries_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/entries/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["entries_retrieve"];
        put?: never;
        post?: never;
        delete: operations["entries_destroy"];
        options?: never;
        head?: never;
        patch: operations["entries_partial_update"];
        trace?: never;
    };
    "/api/habits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Retrieve a list of habits. */
        get: operations["habits_list"];
        put?: never;
        /** @description Create a new habit. */
        post: operations["habits_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/habits/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["habits_retrieve"];
        put?: never;
        post?: never;
        delete: operations["habits_destroy"];
        options?: never;
        head?: never;
        patch: operations["habits_partial_update"];
        trace?: never;
    };
    "/api/token/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Retrieve the token. */
        post: operations["token_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/token/refresh/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Retrieve a new access token. */
        post: operations["token_refresh_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/user/register/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["user_register_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["users_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/whoami/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["whoami_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        CreateUser: {
            /** @description Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
            username: string;
            /**
             * Email address
             * Format: email
             */
            email?: string;
            password: string;
        };
        Entry: {
            readonly id: number;
            habit: number;
            /** Format: date-time */
            readonly date: string;
            rating?: number | null;
            description?: string | null;
        };
        /**
         * @description * `gt` - Greater than
         *     * `gte` - Greater than or equal to
         *     * `lt` - Less than
         *     * `lte` - Less than or equal to
         *     * `equal` - Equal to
         * @enum {string}
         */
        GoalTypeEnum: "gt" | "gte" | "lt" | "lte" | "equal";
        Habit: {
            readonly id: number;
            author: number;
            name: string;
            description?: string | null;
            private?: boolean;
            status?: components["schemas"]["StatusEnum"];
            /** Format: int64 */
            goalFrequency: number;
            /** Format: int64 */
            goalTimespan: number;
            goalType: components["schemas"]["GoalTypeEnum"];
        };
        PaginatedEntryList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Entry"][];
        };
        PaginatedHabitList: {
            /** @example 123 */
            count: number;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=4
             */
            next?: string | null;
            /**
             * Format: uri
             * @example http://api.example.org/accounts/?page=2
             */
            previous?: string | null;
            results: components["schemas"]["Habit"][];
        };
        /**
         * @description * `active` - Active
         *     * `paused` - Paused
         *     * `deleted` - Deleted
         * @enum {string}
         */
        StatusEnum: "active" | "paused" | "deleted";
        TokenObtainPair: {
            username: string;
            password: string;
            readonly access: string;
            readonly refresh: string;
        };
        TokenRefresh: {
            readonly access: string;
            refresh: string;
        };
        WrapperTokenObtainPair: {
            username: string;
            password: string;
        };
        WrapperTokenRefresh: {
            refresh: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    entries_list: {
        parameters: {
            query: {
                /** @description Filter entries by the habit ID */
                habitId: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description End date for filtering entries in ISO 8601 format. Defaults to the current time. */
                timeEnd?: string;
                /** @description Start date for filtering entries in ISO 8601 format. Defaults to 7 days before `timeEnd`. */
                timeStart?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedEntryList"];
                };
            };
        };
    };
    entries_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Entry"];
                "application/x-www-form-urlencoded": components["schemas"]["Entry"];
                "multipart/form-data": components["schemas"]["Entry"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Entry"];
                };
            };
        };
    };
    entries_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    entries_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    entries_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    habits_list: {
        parameters: {
            query?: {
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Filter habits by the author's user ID. */
                userId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedHabitList"];
                };
            };
        };
    };
    habits_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Habit"];
                "application/x-www-form-urlencoded": components["schemas"]["Habit"];
                "multipart/form-data": components["schemas"]["Habit"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Habit"];
                };
            };
        };
    };
    habits_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    habits_destroy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    habits_partial_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    token_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WrapperTokenObtainPair"];
                "application/x-www-form-urlencoded": components["schemas"]["WrapperTokenObtainPair"];
                "multipart/form-data": components["schemas"]["WrapperTokenObtainPair"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenObtainPair"];
                };
            };
        };
    };
    token_refresh_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WrapperTokenRefresh"];
                "application/x-www-form-urlencoded": components["schemas"]["WrapperTokenRefresh"];
                "multipart/form-data": components["schemas"]["WrapperTokenRefresh"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenRefresh"];
                };
            };
        };
    };
    user_register_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUser"];
                "application/x-www-form-urlencoded": components["schemas"]["CreateUser"];
                "multipart/form-data": components["schemas"]["CreateUser"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreateUser"];
                };
            };
        };
    };
    users_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    whoami_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No response body */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
