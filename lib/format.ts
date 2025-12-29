/**
 * Formats a number as Indian Rupees with Crore/Lakhs notation
 * @param value - The number to format (in basic units, not already in Crore)
 * @returns Formatted string like "₹150 Cr" or "₹75 Lakh"
 */
export function formatINR(value: number | bigint): string {
    const num = typeof value === 'bigint' ? Number(value) : value;

    if (num === 0) return "N/A";

    const crore = 10000000; // 1 Crore = 10 Million
    const lakh = 100000;    // 1 Lakh = 100 Thousand

    if (num >= crore) {
        const cr = num / crore;
        return `₹${cr.toFixed(2)} Cr`;
    } else if (num >= lakh) {
        const lk = num / lakh;
        return `₹${lk.toFixed(2)} Lakh`;
    } else {
        return `₹${num.toLocaleString('en-IN')}`;
    }
}

/**
 * Formats a number as Indian Rupees using standard Intl formatter
 */
export function formatINRFull(value: number | bigint): string {
    const num = typeof value === 'bigint' ? Number(value) : value;
    if (num === 0) return "N/A";
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
}
