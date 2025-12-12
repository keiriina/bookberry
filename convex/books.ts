import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function getBookForUser(ctx: any, googleBookId: string) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    return await ctx.db
        .query("books")
        .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
        .filter((q: any) => q.eq(q.field("id"), googleBookId))
        .first();
}

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const userId = identity.subject;

        return await ctx.db
            .query("books")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();
    },
});

export const add = mutation({
    args: {
        id: v.string(), // Google Books ID
        title: v.string(),
        authors: v.array(v.string()),
        description: v.optional(v.string()),
        coverUrl: v.optional(v.string()),
        pageCount: v.number(),
        isbn: v.optional(v.string()),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated call to mutation");
        }
        const userId = identity.subject;

        // Check if book already exists for this user
        const existing = await ctx.db
            .query("books")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("id"), args.id))
            .first();

        if (existing) {
            // If it exists, maybe just update status if different? 
            // For now, allow re-adding to just return success or do nothing.
            return existing._id;
        }

        const newBookId = await ctx.db.insert("books", {
            ...args,
            userId,
            addedAt: new Date().toISOString(),
        });
        return newBookId;
    },
});

export const updateStatus = mutation({
    args: { id: v.string(), status: v.string() },
    handler: async (ctx, args) => {
        const book = await getBookForUser(ctx, args.id);
        if (book) {
            await ctx.db.patch(book._id, { status: args.status });
        }
    },
});

export const updateProgress = mutation({
    args: { id: v.string(), page: v.number() },
    handler: async (ctx, args) => {
        const book = await getBookForUser(ctx, args.id);
        if (book) {
            await ctx.db.patch(book._id, { userCurrentPage: args.page });
        }
    },
});

export const rate = mutation({
    args: { id: v.string(), rating: v.number(), review: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const book = await getBookForUser(ctx, args.id);
        if (book) {
            await ctx.db.patch(book._id, {
                userRating: args.rating,
                review: args.review,
                status: "COMPLETED",
            });
        }
    },
});

export const remove = mutation({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const book = await getBookForUser(ctx, args.id);
        if (book) {
            await ctx.db.delete(book._id);
        }
    },
});

export const clear = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;
        const userId = identity.subject;

        const books = await ctx.db
            .query("books")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        for (const book of books) {
            await ctx.db.delete(book._id);
        }
    },
});
