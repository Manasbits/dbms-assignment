import { users } from './mocks';

// Mock users data

// Simple authentication function
export const authenticateUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        return {
            success: true,
            user: {
                ...user,
                password: undefined // Remove password from returned data
            }
        };
    }
    return {
        success: false,
        error: 'Invalid credentials'
    };
}; 