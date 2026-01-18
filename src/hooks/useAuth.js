// /src/hooks/useAuth.js
'use client';

import { useAuth as useAuthContext } from '@/components/auth/AuthProvider';

// Re-export the useAuth hook for easier imports
export const useAuth = useAuthContext;
