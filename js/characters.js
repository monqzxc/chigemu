export const CHIBI_CHARACTERS = {
    IRUMA: {
        id: 'IRUMA', name: 'Iruma', title: 'Honor Demon Student', mbti: 'INFJ', quote: 'Please do not eat me!',
        spriteUrl: 'assets/iruma.png',
        speed: 4.0,
        palette: { primary: '#2563eb', secondary: '#60a5fa' },
        specialSkill: { type: 'DODGE', name: 'Evasion Veil', color: '#38bdf8', desc: 'Grants complete invincibility for 6 seconds.' }
    },
    CLARA: {
        id: 'CLARA', name: 'Clara', title: 'Wild Toymaker', mbti: 'ENFP', quote: 'Let us play together forever!',
        spriteUrl: 'assets/clara.png',
        speed: 4.5,
        palette: { primary: '#22c55e', secondary: '#4ade80' },
        specialSkill: { type: 'CANDY', name: 'Girly Toy Barrage', color: '#ec4899', desc: 'Throws multi-hit candies and toys.' }
    },
    KALEGO: {
        id: 'KALEGO', name: 'Kalego', title: 'Strict Homeroom Guardian', mbti: 'ISTJ', quote: 'Silence! Maintain order!',
        spriteUrl: 'assets/kalego.png',
        speed: 3.9,
        palette: { primary: '#475569', secondary: '#64748b' },
        specialSkill: { type: 'CERBERUS', name: 'Cerberus Summon', color: '#f59e0b', desc: 'Summons a thunder Cerberus.' }
    },
    ASMODEUS: {
        id: 'ASMODEUS', name: 'Asmodeus', title: 'Flame Noble Prodigy', mbti: 'ISFP', quote: 'For the glory of Lord Iruma!',
        spriteUrl: 'assets/asmodeus.png',
        speed: 4.4,
        palette: { primary: '#f43f5e', secondary: '#fb7185' },
        specialSkill: { type: 'FIRE', name: 'Hellfire Torrent', color: '#ef4444', desc: 'Throws explosive demonic fire.' }
    },
    AMERI: {
        id: 'AMERI', name: 'Ameri', title: 'Student Council President', mbti: 'ENTJ', quote: 'A true leader never yields!',
        spriteUrl: 'assets/ameri.png',
        speed: 4.3,
        palette: { primary: '#b91c1c', secondary: '#ef4444' },
        specialSkill: { type: 'BUFF', name: 'Overclocked Aura', color: '#f43f5e', desc: 'Grants x2 damage for 6 seconds.' }
    }
};

export function getChibiCharacter(key) {
    return CHIBI_CHARACTERS[key] || CHIBI_CHARACTERS.IRUMA;
}