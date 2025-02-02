import * as superjson from 'superjson';
import * as _trpc_server from '@trpc/server';
import { z } from 'zod';

declare enum EventTypeEnum {
    ONLINE = "ONLINE",
    IN_PERSON = "IN_PERSON"
}

declare const luciaUserSchema: z.ZodObject<{
    role: z.ZodEnum<["USER", "ADMIN", "ANDINO_ADMIN", "NEW_USER"]>;
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    picture: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    email: string;
    picture: string | null;
    role: "USER" | "ADMIN" | "ANDINO_ADMIN" | "NEW_USER";
}, {
    name: string;
    id: string;
    email: string;
    picture: string | null;
    role: "USER" | "ADMIN" | "ANDINO_ADMIN" | "NEW_USER";
}>;
type LuciaUserType = z.infer<typeof luciaUserSchema>;

type Context = {
    user: LuciaUserType | null;
};

declare const appRouter: _trpc_server.CreateRouterInner<_trpc_server.RootConfig<{
    ctx: Context;
    meta: object;
    errorShape: _trpc_server.DefaultErrorShape;
    transformer: typeof superjson.default;
}>, {
    loginLinkedin: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            code: string;
        };
        _input_out: {
            code: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        user: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            role: "USER" | "ADMIN" | "ANDINO_ADMIN" | "NEW_USER";
        };
        sessionId: string;
    }>;
    loginGoogle: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            idToken: string;
        };
        _input_out: {
            idToken: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        user: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            role: "USER" | "ADMIN" | "ANDINO_ADMIN" | "NEW_USER";
        };
        sessionId: string;
    }>;
    searchUsers: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
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
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            type?: string | undefined;
            title?: string | undefined;
            startDate?: string | undefined;
            location?: string | undefined;
            limit?: number | undefined;
            page?: number | undefined;
        } | undefined;
        _input_out: {
            type?: string | undefined;
            title?: string | undefined;
            startDate?: string | undefined;
            location?: string | undefined;
            limit?: number | undefined;
            page?: number | undefined;
        } | undefined;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        events: {
            id: string;
            type: EventTypeEnum;
            title: string;
            startDate: Date;
            endDate: Date;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            requiresApproval: boolean;
            backgroundColor: string | null;
            heroImage: string | null;
            organization: {
                name: string;
                logo: string | null;
                stripeAccountId?: string | null | undefined;
            };
            registrations: number;
            tickets: {
                name: string;
                id: string;
                category: "GENERAL" | "VIP" | "BACKSTAGE";
                price: number;
                limit: number;
                ticketsPerPurchase: number;
                description?: string | undefined;
            }[];
            subtitle?: string | null | undefined;
            description?: string | undefined;
            location?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            country?: string | null | undefined;
            latLon?: {
                lat?: number | null | undefined;
                lon?: number | null | undefined;
            } | null | undefined;
            virtualLink?: string | null | undefined;
            maxAttendees?: number | null | undefined;
            customFields?: {
                fields: {
                    name: string;
                    type: "number" | "boolean" | "date" | "text" | "url";
                    description: string;
                    inputType: "shortText" | "longText";
                    required?: boolean | undefined;
                    defaultValue?: string | number | boolean | undefined;
                }[];
                eventData?: Record<string, any>[] | undefined;
            } | null | undefined;
            openGraphImage?: string | null | undefined;
            featuredIn?: {
                name: string;
                url: string;
            }[] | null | undefined;
            hosts?: {
                name: string;
                id: string;
                email: string;
                stopCommunication: boolean;
                role: string;
                privacySettings: {
                    email: boolean;
                    phoneNumber: boolean;
                    linkedin: boolean;
                    x: boolean;
                    website: boolean;
                };
                isLinkedinLinked: boolean;
                picture?: string | null | undefined;
                phoneNumber?: string | undefined;
                company?: string | null | undefined;
                position?: string | null | undefined;
                shortDescription?: string | null | undefined;
                linkedin?: string | null | undefined;
                x?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
                professionalMotivations?: string | null | undefined;
                communicationStyle?: string | null | undefined;
                professionalValues?: string | null | undefined;
                careerAspirations?: string | null | undefined;
                significantChallenge?: string | null | undefined;
                resumeUrl?: string | null | undefined;
                resumeText?: string | null | undefined;
                resumeLastUpdated?: string | null | undefined;
                linkedinAccessToken?: string | null | undefined;
            }[] | null | undefined;
        }[];
        totalCount: number;
    }>;
    getEvent: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            eventId: string;
            includeTickets?: boolean | undefined;
        };
        _input_out: {
            eventId: string;
            includeTickets?: boolean | undefined;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        type: EventTypeEnum;
        title: string;
        startDate: Date;
        endDate: Date;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        requiresApproval: boolean;
        description?: string | undefined;
        location?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        country?: string | null | undefined;
        latLon?: {
            lat?: number | null | undefined;
            lon?: number | null | undefined;
        } | null | undefined;
        virtualLink?: string | null | undefined;
        maxAttendees?: number | null | undefined;
        customFields?: {
            fields: {
                name: string;
                type: "number" | "boolean" | "date" | "text" | "url";
                description: string;
                inputType: "shortText" | "longText";
                required?: boolean | undefined;
                defaultValue?: string | number | boolean | undefined;
            }[];
            eventData?: Record<string, any>[] | undefined;
        } | null | undefined;
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
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            eventId: string;
            registrationData: {
                name: string;
                email: string;
                tickets: Record<string, number>;
                customFieldsData?: Record<string, any> | undefined;
            };
        };
        _input_out: {
            eventId: string;
            registrationData: {
                name: string;
                email: string;
                tickets: Record<string, number>;
                customFieldsData?: Record<string, any> | undefined;
            };
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        message: string;
        success: boolean;
        registration: {
            id: string;
            status: "PENDING" | "APPROVED" | "REJECTED";
            customFields: Record<string, any>;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            paid: boolean;
            paymentId: string | null;
        };
    }>;
    getUserRegistrationStatus: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
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
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: string;
        _input_out: string;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        colour: string;
        linkedin?: string | undefined;
        instagram?: string | undefined;
        website?: string | undefined;
        description?: string | undefined;
        logo?: string | undefined;
        facebook?: string | undefined;
        tiktok?: string | undefined;
        eventCount?: number | null | undefined;
    }>;
    checkExistingRegistration: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            eventId: string;
        };
        _input_out: {
            eventId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        customFields: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        tickets: {
            id: string;
            category: "GENERAL" | "VIP" | "BACKSTAGE";
            checkedInDate: Date | null;
            user?: {
                name: string;
                id: string;
                email: string;
                picture: string | null;
                emailVerified?: Date | null | undefined;
                phoneNumber?: string | null | undefined;
            } | null | undefined;
            ticketType?: {
                name: string;
                id: string;
                category: "GENERAL" | "VIP" | "BACKSTAGE";
                price: number;
                limit: number;
                ticketsPerPurchase: number;
                description?: string | undefined;
            } | null | undefined;
        }[];
        userId: string;
        user: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            emailVerified?: Date | null | undefined;
            phoneNumber?: string | null | undefined;
        };
        paid: boolean;
        paymentId: string | null;
    } | null>;
    createCheckoutSession: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            registrationId: string;
        };
        _input_out: {
            registrationId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        clientSecret: string;
    }>;
    markRegistrationPaid: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            registrationId: string;
        };
        _input_out: {
            registrationId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    getCommunities: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            limit?: number | undefined;
            page?: number | undefined;
            search?: string | undefined;
        } | undefined;
        _input_out: {
            limit: number;
            page: number;
            search?: string | undefined;
        } | undefined;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        communities: {
            name: string;
            id: string;
            linkedin: string | null;
            instagram: string | null;
            website: string | null;
            description: string | null;
            colour: string | null;
            logo: string | null;
            facebook: string | null;
            tiktok: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasMore: boolean;
            nextPage: number | null;
        };
    }>;
    getCommunityDetails: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            communityId: string;
        };
        _input_out: {
            communityId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        organization: {
            name: string;
            id: string;
            linkedin: string | null;
            instagram: string | null;
            website: string | null;
            description: string | null;
            colour: string | null;
            logo: string | null;
            facebook: string | null;
            tiktok: string | null;
        };
        events: {
            id: string;
            type: EventTypeEnum;
            title: string;
            startDate: Date;
            endDate: Date;
            requiresApproval: boolean;
            description?: string | undefined;
            location?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            country?: string | null | undefined;
            latLon?: {
                lat?: number | null | undefined;
                lon?: number | null | undefined;
            } | null | undefined;
            virtualLink?: string | null | undefined;
            maxAttendees?: number | null | undefined;
            customFields?: {
                fields: {
                    name: string;
                    type: "number" | "boolean" | "date" | "text" | "url";
                    description: string;
                    inputType: "shortText" | "longText";
                    required?: boolean | undefined;
                    defaultValue?: string | number | boolean | undefined;
                }[];
                eventData?: Record<string, any>[] | undefined;
            } | null | undefined;
            openGraphImage?: string | null | undefined;
        }[];
        members: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            emailVerified?: Date | null | undefined;
            phoneNumber?: string | null | undefined;
        }[];
        organizers: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            emailVerified?: Date | null | undefined;
            phoneNumber?: string | null | undefined;
        }[];
    }>;
    getTicketsWithEvents: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _ctx_out: Context;
        _input_in: typeof _trpc_server.unsetMarker;
        _input_out: typeof _trpc_server.unsetMarker;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
        _meta: object;
    }, {
        event: {
            id: string;
            type: "IN_PERSON" | "VIRTUAL";
            title: string;
            startDate: Date;
            endDate: Date;
            organizationId: string;
            openGraphImage: string;
            organization: {
                name: string;
                id: string;
                logo: string;
            };
        };
        tickets: {
            id: string;
            status: "PENDING" | "APPROVED" | "REJECTED";
            description: string | null;
            userId: string;
            category: "GENERAL" | "VIP" | "BACKSTAGE";
            checkedInDate: Date | null;
            registration: {
                customFields: {
                    name: string;
                    email: string;
                    tickets: Record<string, number>;
                };
                paid: boolean;
                paymentId: string | null;
            };
            registrationId: string;
            checkedInByUserId: string | null;
            ticketTypeId: string;
        }[];
    }[]>;
    getUserProfile: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _ctx_out: Context;
        _input_in: typeof _trpc_server.unsetMarker;
        _input_out: typeof _trpc_server.unsetMarker;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
        _meta: object;
    }, {
        name: string;
        id: string;
        email: string;
        stopCommunication: boolean;
        role: string;
        privacySettings: {
            email: boolean;
            phoneNumber: boolean;
            linkedin: boolean;
            x: boolean;
            website: boolean;
        };
        isLinkedinLinked: boolean;
        picture?: string | null | undefined;
        phoneNumber?: string | undefined;
        company?: string | null | undefined;
        position?: string | null | undefined;
        shortDescription?: string | null | undefined;
        linkedin?: string | null | undefined;
        x?: string | null | undefined;
        instagram?: string | null | undefined;
        website?: string | null | undefined;
        professionalMotivations?: string | null | undefined;
        communicationStyle?: string | null | undefined;
        professionalValues?: string | null | undefined;
        careerAspirations?: string | null | undefined;
        significantChallenge?: string | null | undefined;
        resumeUrl?: string | null | undefined;
        resumeText?: string | null | undefined;
        resumeLastUpdated?: string | null | undefined;
        linkedinAccessToken?: string | null | undefined;
    } | null>;
    updateUserProfile: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            name: string;
            id: string;
            email: string;
            role: string;
            picture?: string | null | undefined;
            phoneNumber?: string | undefined;
            company?: string | null | undefined;
            position?: string | null | undefined;
            shortDescription?: string | null | undefined;
            linkedin?: string | null | undefined;
            x?: string | null | undefined;
            instagram?: string | null | undefined;
            website?: string | null | undefined;
            professionalMotivations?: string | null | undefined;
            communicationStyle?: string | null | undefined;
            professionalValues?: string | null | undefined;
            careerAspirations?: string | null | undefined;
            significantChallenge?: string | null | undefined;
            resumeUrl?: string | null | undefined;
            resumeText?: string | null | undefined;
            resumeLastUpdated?: string | null | undefined;
            stopCommunication?: boolean | undefined;
            privacySettings?: {
                email?: boolean | undefined;
                phoneNumber?: boolean | undefined;
                linkedin?: boolean | undefined;
                x?: boolean | undefined;
                website?: boolean | undefined;
            } | undefined;
            linkedinAccessToken?: string | null | undefined;
            isLinkedinLinked?: boolean | undefined;
        };
        _input_out: {
            name: string;
            id: string;
            email: string;
            stopCommunication: boolean;
            role: string;
            privacySettings: {
                email: boolean;
                phoneNumber: boolean;
                linkedin: boolean;
                x: boolean;
                website: boolean;
            };
            isLinkedinLinked: boolean;
            picture?: string | null | undefined;
            phoneNumber?: string | undefined;
            company?: string | null | undefined;
            position?: string | null | undefined;
            shortDescription?: string | null | undefined;
            linkedin?: string | null | undefined;
            x?: string | null | undefined;
            instagram?: string | null | undefined;
            website?: string | null | undefined;
            professionalMotivations?: string | null | undefined;
            communicationStyle?: string | null | undefined;
            professionalValues?: string | null | undefined;
            careerAspirations?: string | null | undefined;
            significantChallenge?: string | null | undefined;
            resumeUrl?: string | null | undefined;
            resumeText?: string | null | undefined;
            resumeLastUpdated?: string | null | undefined;
            linkedinAccessToken?: string | null | undefined;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        success: boolean;
        user: {
            name: string;
            id: string;
            email: string;
            stopCommunication: boolean;
            role: string;
            privacySettings: {
                email: boolean;
                phoneNumber: boolean;
                linkedin: boolean;
                x: boolean;
                website: boolean;
            };
            isLinkedinLinked: boolean;
            picture?: string | null | undefined;
            phoneNumber?: string | undefined;
            company?: string | null | undefined;
            position?: string | null | undefined;
            shortDescription?: string | null | undefined;
            linkedin?: string | null | undefined;
            x?: string | null | undefined;
            instagram?: string | null | undefined;
            website?: string | null | undefined;
            professionalMotivations?: string | null | undefined;
            communicationStyle?: string | null | undefined;
            professionalValues?: string | null | undefined;
            careerAspirations?: string | null | undefined;
            significantChallenge?: string | null | undefined;
            resumeUrl?: string | null | undefined;
            resumeText?: string | null | undefined;
            resumeLastUpdated?: string | null | undefined;
            linkedinAccessToken?: string | null | undefined;
        };
    }>;
    deleteUserAccount: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _ctx_out: Context;
        _input_in: typeof _trpc_server.unsetMarker;
        _input_out: typeof _trpc_server.unsetMarker;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
        _meta: object;
    }, {
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    saveNetworkingProfile: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            company?: string | null | undefined;
            position?: string | null | undefined;
            shortDescription?: string | null | undefined;
            linkedin?: string | null | undefined;
            x?: string | null | undefined;
            instagram?: string | null | undefined;
            website?: string | null | undefined;
            professionalMotivations?: string | null | undefined;
            communicationStyle?: string | null | undefined;
            professionalValues?: string | null | undefined;
            careerAspirations?: string | null | undefined;
            significantChallenge?: string | null | undefined;
            resumeUrl?: string | null | undefined;
            resumeText?: string | null | undefined;
            resumeLastUpdated?: string | null | undefined;
        };
        _input_out: {
            company?: string | null | undefined;
            position?: string | null | undefined;
            shortDescription?: string | null | undefined;
            linkedin?: string | null | undefined;
            x?: string | null | undefined;
            instagram?: string | null | undefined;
            website?: string | null | undefined;
            professionalMotivations?: string | null | undefined;
            communicationStyle?: string | null | undefined;
            professionalValues?: string | null | undefined;
            careerAspirations?: string | null | undefined;
            significantChallenge?: string | null | undefined;
            resumeUrl?: string | null | undefined;
            resumeText?: string | null | undefined;
            resumeLastUpdated?: string | null | undefined;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    getOrganizationsByCurrentUser: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _ctx_out: Context;
        _input_in: typeof _trpc_server.unsetMarker;
        _input_out: typeof _trpc_server.unsetMarker;
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
        _meta: object;
    }, {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        colour: string;
        linkedin?: string | undefined;
        instagram?: string | undefined;
        website?: string | undefined;
        description?: string | undefined;
        logo?: string | undefined;
        facebook?: string | undefined;
        tiktok?: string | undefined;
        eventCount?: number | null | undefined;
    }[]>;
    getEventsByOrganization: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            organizationId: string;
        };
        _input_out: {
            organizationId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        type: EventTypeEnum;
        title: string;
        startDate: Date;
        endDate: Date;
        requiresApproval: boolean;
        description?: string | undefined;
        location?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        country?: string | null | undefined;
        latLon?: {
            lat?: number | null | undefined;
            lon?: number | null | undefined;
        } | null | undefined;
        virtualLink?: string | null | undefined;
        maxAttendees?: number | null | undefined;
        customFields?: {
            fields: {
                name: string;
                type: "number" | "boolean" | "date" | "text" | "url";
                description: string;
                inputType: "shortText" | "longText";
                required?: boolean | undefined;
                defaultValue?: string | number | boolean | undefined;
            }[];
            eventData?: Record<string, any>[] | undefined;
        } | null | undefined;
        openGraphImage?: string | null | undefined;
    }[]>;
    getEventRegistrations: _trpc_server.BuildProcedure<"query", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            eventId: string;
        };
        _input_out: {
            eventId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        customFields: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        tickets: {
            id: string;
            category: "GENERAL" | "VIP" | "BACKSTAGE";
            checkedInDate: Date | null;
            user?: {
                name: string;
                id: string;
                email: string;
                picture: string | null;
                emailVerified?: Date | null | undefined;
                phoneNumber?: string | null | undefined;
            } | null | undefined;
            ticketType?: {
                name: string;
                id: string;
                category: "GENERAL" | "VIP" | "BACKSTAGE";
                price: number;
                limit: number;
                ticketsPerPurchase: number;
                description?: string | undefined;
            } | null | undefined;
        }[];
        userId: string;
        user: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            emailVerified?: Date | null | undefined;
            phoneNumber?: string | null | undefined;
        };
        paid: boolean;
        paymentId: string | null;
    }[]>;
    checkInTicket: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            eventId: string;
            ticketId: string;
        };
        _input_out: {
            eventId: string;
            ticketId: string;
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, {
        id: string;
        category: "GENERAL" | "VIP" | "BACKSTAGE";
        checkedInDate: Date | null;
        user?: {
            name: string;
            id: string;
            email: string;
            picture: string | null;
            emailVerified?: Date | null | undefined;
            phoneNumber?: string | null | undefined;
        } | null | undefined;
        ticketType?: {
            name: string;
            id: string;
            category: "GENERAL" | "VIP" | "BACKSTAGE";
            price: number;
            limit: number;
            ticketsPerPurchase: number;
            description?: string | undefined;
        } | null | undefined;
    }>;
    checkTicketsAvailability: _trpc_server.BuildProcedure<"mutation", {
        _config: _trpc_server.RootConfig<{
            ctx: Context;
            meta: object;
            errorShape: _trpc_server.DefaultErrorShape;
            transformer: typeof superjson.default;
        }>;
        _meta: object;
        _ctx_out: Context;
        _input_in: {
            ticketOfferingsIds: string[];
        };
        _input_out: {
            ticketOfferingsIds: string[];
        };
        _output_in: typeof _trpc_server.unsetMarker;
        _output_out: typeof _trpc_server.unsetMarker;
    }, Record<string, number>>;
}>;
type AppRouter = typeof appRouter;

export type { AppRouter };
