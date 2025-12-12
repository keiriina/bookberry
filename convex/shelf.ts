import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Mutation to add a book to the user's shelf
 */
export const addToShelf = mutation({
    args: {
        id: v.string(), // Google Books ID
        title: v.string(),
        authors: v.array(v.string()),
        description: v.optional(v.string()),
        coverUrl: v.optional(v.string()),
        pageCount: v.number(),
        isbn: v.optional(v.string()),
        status: v.string(), // ReadingStatus
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("You must be logged in to add books to your shelf.");
        }

        const userId = identity.subject; // Or tokenIdentifier

        // Check if book already exists for this user
        // Note: We might need a compound index or just query by user and filter
        // For now, let's query my books and see if ID matches
        const existing = await ctx.db
            .query("books")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("id"), args.id))
            .first();

        if (existing) {
            return; // Already in shelf
        }

        await ctx.db.insert("books", {
            ...args,
            addedAt: new Date().toISOString(),
            userId: userId,
        });
    },
});

/**
 * Query to get the current user's shelf
 */
export const getMyShelf = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return []; // Return empty if not logged in
        }

        const userId = identity.subject;

        return await ctx.db
            .query("books")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();
    },
});
