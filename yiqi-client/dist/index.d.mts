import * as _trpc_server from '@trpc/server';
import * as _trpc_server_unstable_core_do_not_import from '@trpc/server/unstable-core-do-not-import';

declare const appRouter: _trpc_server_unstable_core_do_not_import.BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: _trpc_server_unstable_core_do_not_import.DefaultErrorShape;
    transformer: true;
}, {
    searchUsers: _trpc_server.TRPCQueryProcedure<{
        input: {
            query: string;
        };
        output: {
            id: string;
            name: string;
            email: string;
            emailVerified: Date | null;
            picture: string | null;
            phoneNumber: string | null;
        }[];
    }>;
    getPublicEvents: _trpc_server.TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            title: string;
            startDate: Date;
            endDate: Date;
            location: string | null;
            customFields: {
                name: string;
                type: "number" | "select" | "date" | "text";
                required: boolean;
                options?: string | undefined;
            }[];
            requiresApproval: boolean;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            description?: string | undefined;
        }[];
    }>;
    getEvent: _trpc_server.TRPCQueryProcedure<{
        input: string;
        output: {
            id: string;
            title: string;
            startDate: Date;
            endDate: Date;
            location: string | null;
            customFields: {
                name: string;
                type: "number" | "select" | "date" | "text";
                required: boolean;
                options?: string | undefined;
            }[];
            requiresApproval: boolean;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            description?: string | undefined;
        };
    }>;
    createRegistration: _trpc_server.TRPCMutationProcedure<{
        input: {
            eventId: string;
            attendeeData: Record<string, unknown>;
        };
        output: {
            id: string;
            status: "PENDING" | "APPROVED" | "REJECTED";
            customFields: Record<string, unknown>;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            userId: string;
        };
    }>;
    getUserRegistrationStatus: _trpc_server.TRPCQueryProcedure<{
        input: {
            eventId: string;
            userId: string;
        };
        output: boolean;
    }>;
    getOrganization: _trpc_server.TRPCQueryProcedure<{
        input: string;
        output: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            logo: string | null;
        };
    }>;
}>;
type AppRouter = typeof appRouter;

export type { AppRouter };
