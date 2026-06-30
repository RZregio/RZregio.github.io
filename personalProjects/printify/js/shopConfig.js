export const shopConfig = {
    shopName: "Printify Studio",
    heroTitle: "Fast, Reliable Document Printing",
    heroSubtitle: "Upload your PDFs, customize your preferences, and monitor your print status in real-time.",
    reminders: [
        "We currently only accept .PDF formats.",
        "Wait for the admin to call your name once the status is 'Done'."
    ],
    // NEW: Enterprise Pricing Matrix
    pricing: {
        "A4": { bw: 2.00, color: 5.00 },
        "Letter": { bw: 2.00, color: 5.00 },
        "Legal": { bw: 3.00, color: 7.00 },
        promo: {
            threshold: 250,      // Number of total pages required to trigger the promo
            discountType: 'percent', // 'percent' or 'fixed'
            discountValue: 0.10  // 10% off (if percent) OR a fixed price per page (if fixed)
        }
    }
};