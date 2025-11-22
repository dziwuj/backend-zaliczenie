export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString();
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}
