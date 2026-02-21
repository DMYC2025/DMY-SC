/**
 * DMYSC Centralized Holiday Data for 2026
 * Used by User Event Calendar and Admin Event Manager.
 */

window.DMY_HOLIDAYS = {
    fixed: {
        "01-01": "New Year"
    },
    specific: {
        "2025-01-13": "Duruthu Poya", "2025-02-12": "Navam Poya", "2025-03-13": "Medin Poya",
        "2025-04-12": "Bak Poya", "2025-05-12": "Vesak Poya", "2025-06-10": "Poson Poya",
        "2025-07-10": "Esala Poya", "2025-08-08": "Nikini Poya", "2025-09-07": "Binara Poya",
        "2025-10-06": "Vap Poya", "2025-11-05": "Il Poya", "2025-12-04": "Unduvap Poya",

        // 2026 
        "2026-01-03": "දුරුතු පෝය (Duruthu Poya)",
        "2026-01-15": "තායි පොන්ගල් (Thai Pongal)",
        "2026-02-01": "නවම් පෝය (Nawam Poya)",
        "2026-02-04": "නිදහස් දිනය (Independence Day)",
        "2026-02-15": "මහා ශිවරාත්රි (Maha Sivarathri)",
        "2026-03-02": "මැදින් පෝය (Medin Poya)",
        "2026-03-21": "රාමසාන් (Id-Ul-Fitr)",
        "2026-04-01": "බක් පෝය (Bak Poya)",
        "2026-04-03": "මහ සිකුරාදා (Good Friday)",
        "2026-04-13": "අලුත් අවුරුදු පෙර දිනය (New Year Eve)",
        "2026-04-14": "අලුත් අවුරුදු දිනය (New Year Day)",
        "2026-05-01": "වෙසක් පෝය / කම්කරු දිනය (Vesak Poya / May Day)",
        "2026-05-02": "වෙසක් පසු දිනය (Day After Vesak)",
        "2026-05-28": "හජ් උත්සවය (Id-Ul-Alha)",
        "2026-05-30": "අධි පොසොන් පෝය (Adhi Poson Poya)",
        "2026-06-29": "පොසොන් පෝය (Poson Poya)",
        "2026-07-29": "ඇසළ පෝය (Esala Poya)",
        "2026-08-26": "මිලාද්-උන්-නබි (Milad-Un-Nabi)",
        "2026-08-27": "නිකිණි පෝය (Nikini Poya)",
        "2026-09-26": "බිනර පෝය (Binara Poya)",
        "2026-10-25": "වප් පෝය (Vap Poya)",
        "2026-11-08": "දීපවාලි (Deepavali)",
        "2026-11-24": "ඉල් පෝය (Il Poya)",
        "2026-12-23": "උඳුවප් පෝය (Unduvap Poya)",
        "2026-12-25": "නත්තල් දිනය (Christmas Day)"
    },

    // Categorization logic
    getType(name) {
        if (!name) return null;
        if (name.includes('පෝය') || name.includes('Poya')) return 'poya';
        if (/පොන්ගල්|Pongal|ශිවරාත්රි|Sivarathri|දීපවාලි|Deepavali/.test(name)) return 'tamil';
        if (/රාමසාන්|Ramazan|හජ්|Hadji|නබි|Nabi|Fitr|Alha/.test(name)) return 'islamic';
        if (/සිකුරාදා|Friday|නත්තල්|Christmas/.test(name)) return 'christian';
        return 'national';
    }
};
