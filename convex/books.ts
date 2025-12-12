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
            // Update status if it's different and being re-added/logged
            // This handles moving between "shelves"
            await ctx.db.patch(existing._id, { status: args.status });
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
            const updates: any = { userCurrentPage: args.page };

            // Auto-complete if finished
            if (args.page >= book.pageCount && book.pageCount > 0) {
                updates.status = "COMPLETED";
            } else if (args.page < book.pageCount && book.status === "COMPLETED") {
                // Optional: Revert to READING if page < total?
                // User didn't ask for this explicitly, but it makes sense.
                // Sticking to explicit request: "If reading reached n/n ... put in completed".
                // I won't auto-revert to avoid annoyance unless explicitly asked.
            }

            await ctx.db.patch(book._id, updates);
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
