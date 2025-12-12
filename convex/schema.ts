import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    books: defineTable({
        id: v.string(), // Google Books ID
        title: v.string(),
        authors: v.array(v.string()),
        description: v.optional(v.string()),
        coverUrl: v.optional(v.string()),
        pageCount: v.number(),
        isbn: v.optional(v.string()),
        status: v.string(), // ReadingStatus
        userRating: v.optional(v.number()),
        review: v.optional(v.string()),
        userCurrentPage: v.optional(v.number()),
        addedAt: v.string(),
        userId: v.string(),
    })
        .index("by_google_id", ["id"])
        .index("by_user_id", ["userId"]),
    users: defineTable({
        userId: v.string(), // Clerk ID
        readingGoal: v.number(),
        username: v.optional(v.string()), // Optional custom username
    }).index("by_user_id", ["userId"]),
});
