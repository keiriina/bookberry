import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        return await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();
    },
});

export const updateGoal = mutation({
    args: { goal: v.number() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const existing = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { readingGoal: args.goal });
        } else {
            await ctx.db.insert("users", {
                userId: identity.subject,
                readingGoal: args.goal,
            });
        }
    },

});

export const updateUsername = mutation({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const existing = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { username: args.username });
        } else {
            await ctx.db.insert("users", {
                userId: identity.subject,
                readingGoal: 10, // Default
                username: args.username,
            });
        }
    },
});

export const getPublicProfile = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();
    },
});
