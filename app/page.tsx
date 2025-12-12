"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { BookSearch } from "@/components/BookSearch";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isSignedIn, user } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-primary-green)] text-xl font-bold">
          Berry Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Auth Wrapper - only show if truly unauthenticated on both ends */}
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <div className="mb-8 relative w-32 h-32">
            {/* Strawberry Logo Placeholder */}
            <div className="w-full h-full bg-[var(--color-primary-green)]/20 rounded-full flex items-center justify-center text-4xl">
              🍓
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-main)] mb-4">
            Welcome to Bookberry
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-md">
            Your cozy space to track, rate, and review your reading journey.
          </p>
          <div className="bg-[var(--color-primary-green)] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer">
            <SignInButton mode="modal">
              <button>Start Reading</button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <AuthenticatedContent />
      </Authenticated>
    </div>
  );
}

function AuthenticatedContent() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center justify-center py-10 space-y-6">
        <h1 className="text-4xl font-black text-[var(--color-text-main)] text-center">
          Find Your Next <span className="text-[var(--color-primary-pink)]">Berry</span> Good Read
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg text-center max-w-2xl">
          Search the world's largest library of books and start tracking your reading journey today.
        </p>
      </div>

      <div className="flex justify-center">
        <BookSearch />
      </div>
    </div>
  );
}
