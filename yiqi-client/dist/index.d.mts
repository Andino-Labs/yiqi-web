import * as superjson from 'superjson';
import * as _trpc_server from '@trpc/server';

declare enum EventTypeEnum {
    ONLINE = "ONLINE",
    IN_PERSON = "IN_PERSON"
}

declare const appRouter: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
    ctx: object;
    meta: object;
    errorShape: _trpc_server.DefaultErrorShape;
    transformer: typeof superjson.default;
}>, {
    searchUsers: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            query: string;
        };
        _input_out: {
            query: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        name: string;
        id: string;
        email: string;
        picture: string | null;
        emailVerified?: Date | null | undefined;
        phoneNumber?: string | null | undefined;
    }[]>;
    getPublicEvents: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _ctx_out: object;
        _input_in: typeof _trpc_server.unsetMarker;
        _input_out: typeof _trpc_server.unsetMarker;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
        _meta: object;
    }, {
        id: string;
        title: string;
        startDate: Date;
        endDate: Date;
        organizationId: string;
        customFields: {
            name: string;
            type: "number" | "select" | "date" | "text";
            required: boolean;
            options?: string | undefined;
        }[];
        createdAt: Date;
        updatedAt: Date;
        requiresApproval: boolean;
        type: EventTypeEnum;
        description?: string | undefined;
        location?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        country?: string | null | undefined;
        virtualLink?: string | null | undefined;
        maxAttendees?: number | null | undefined;
        openGraphImage?: string | null | undefined;
        tickets?: {
            name: string;
            id: string;
            category: "GENERAL" | "VIP" | "BACKSTAGE";
            price: number;
            limit: number;
            ticketsPerPurchase: number;
            description?: string | undefined;
        }[] | null | undefined;
    }[]>;
    getEvent: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: string;
        _input_out: string;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        title: string;
        startDate: Date;
        endDate: Date;
        organizationId: string;
        customFields: {
            name: string;
            type: "number" | "select" | "date" | "text";
            required: boolean;
            options?: string | undefined;
        }[];
        createdAt: Date;
        updatedAt: Date;
        requiresApproval: boolean;
        type: EventTypeEnum;
        description?: string | undefined;
        location?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        country?: string | null | undefined;
        virtualLink?: string | null | undefined;
        maxAttendees?: number | null | undefined;
        openGraphImage?: string | null | undefined;
        tickets?: {
            name: string;
            id: string;
            category: "GENERAL" | "VIP" | "BACKSTAGE";
            price: number;
            limit: number;
            ticketsPerPurchase: number;
            description?: string | undefined;
        }[] | null | undefined;
    }>;
    createRegistration: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            eventId: string;
            attendeeData: Record<string, unknown>;
        };
        _input_out: {
            eventId: string;
            attendeeData: Record<string, unknown>;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        customFields: Record<string, unknown>;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        eventId: string;
    }>;
    getUserRegistrationStatus: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: {
            userId: string;
            eventId: string;
        };
        _input_out: {
            userId: string;
            eventId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, boolean>;
    getOrganization: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: object;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: object;
        _input_in: string;
        _input_out: string;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        logo: string | null;
    }>;
}>;
type AppRouter = typeof appRouter;

export type { AppRouter };
