import type { User } from '../types'

const now = new Date().toISOString()

export const mockUsers: User[] = [
  {
    id: 'user-customer-1',
    firebaseUid: 'mock-firebase-customer-1',
    email: 'alex.rivera@example.com',
    displayName: 'Alex Rivera',
    photoUrl: 'https://i.pravatar.cc/150?img=12',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-admin-1',
    firebaseUid: 'mock-firebase-admin-1',
    email: 'admin@zrentals.example.com',
    displayName: 'Z Rentals Admin',
    photoUrl: 'https://i.pravatar.cc/150?img=33',
    role: 'ADMIN',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-customer-2',
    firebaseUid: 'mock-firebase-customer-2',
    email: 'maria.santos@example.com',
    displayName: 'Maria Santos',
    photoUrl: 'https://i.pravatar.cc/150?img=47',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-customer-3',
    firebaseUid: 'mock-firebase-customer-3',
    email: 'james.lee@example.com',
    displayName: 'James Lee',
    photoUrl: null,
    role: 'CUSTOMER',
    isActive: false,
    createdAt: now,
    updatedAt: now,
  },
]
