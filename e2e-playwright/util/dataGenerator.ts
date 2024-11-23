import { faker } from "@faker-js/faker";
import { writeFileSync, readFileSync } from "fs";
import { StaffData } from "../page/StaffPage";
import { TagData } from "../page/TagPage";

const APRIORI_FILE = "apriori.json";
const DATA_POOL_GEN_PER_SCENARIO = 100;

export type DataPoolType = 'apriori' | 'dynamic' | 'random';
export const DataPools: DataPoolType[] = ['apriori', 'dynamic', 'random'];

type DataPool = Record<ScenarioIdentifier, ScenarioDataPool>;
type Model = 'member' | 'staff' | 'tag';
type ScenarioIdentifier = string
type ScenarioDataPool = Member[] | Staff[] | Tag[];

type Member = {
    name: string;
    email: string;
    notes: string;
    labels: string[];
};

type Staff = StaffData
type Tag = TagData

interface FieldOption {
    number?: number,
    length?: number,
    omit?: boolean,
    kind?: string,
    once?: boolean,
    generator?: () => string,
}

type DataOptions = Partial<Record<keyof Member | keyof Staff | keyof Tag, FieldOption>>

export interface ScenarioConfig {
    title: string,
    oracle: boolean,  // Should the scenario pass or not
    data: DataOptions,
    model: Model,
    pool?: DataPoolType,  // Used after the fact, chosen randomly
}

type ScenarioSchema = Record<string, ScenarioConfig>;
export const Scenarios: ScenarioSchema = {
    emptyAllFields: {
        title: "Empty All Fields",
        oracle: false,
        data: {
            name: { omit: true },
            email: { omit: true },
            notes: { omit: true },
            labels: { omit: true },
        },
        model: 'member',
    },
    emptyName: {
        title: "Empty Name",
        oracle: true,
        data: {
            name: { omit: true },
        },
        model: 'member',
    },
    longName: {
        title: "Long Name",
        oracle: true,
        data: {
            name: { length: 120 },
        },
        model: 'member',
    },
    maxName: {
        title: "Max Name",
        oracle: true,
        data: {
            name: { length: 191 },
        },
        model: 'member',
    },
    overMaxName: {
        title: "Over Max Name",
        oracle: false,
        data: {
            name: { length: 192 },
        },
        model: 'member',
    },
    shortName: {
        title: "Short Name",
        oracle: true,
        data: {
            name: { length: 1 },
        },
        model: 'member',
    },
    emojiName: {
        title: "Emoji Name",
        oracle: true,
        data: {
            name: { kind: 'emoji' },
        },
        model: 'member',
    },
    emptyEmail: {
        title: "Empty Email",
        oracle: false,
        data: {
            email: { omit: true },
        },
        model: 'member',
    },
    normalEmail: {
        title: "Normal Email",
        oracle: true,
        data: {
            email: { length: 30 },
        },
        model: 'member',
    },
    longEmail: {
        title: "[BUG] Long Email",
        oracle: false,
        data: {
            email: { kind: 'long' },
        },
        model: 'member',
    },
    invalidEmail: {
        title: "Invalid Email",
        oracle: false,
        data: { email: { kind: 'invalid' } },
        model: 'member',
    },
    noTLDEmail: {
        title: "No Top Level Domain Email",
        oracle: false,
        data: { email: { kind: 'noTLD' } },
        model: 'member',
    },
    emojiEmail: {
        title: "Emoji Email",
        oracle: false,
        data: { email: { kind: 'emoji' } },
        model: 'member',
    },
    validEmojiEmail: {
        title: "[BUG] Valid Emoji Email",
        oracle: true,
        data: { email: { kind: 'validEmoji' } },
        model: 'member',
    },
    consecutiveDotsEmail: {
        title: "Consecutive Dots Email",
        oracle: false,
        data: { email: { kind: 'consecutiveDots' } },
        model: 'member',
    },
    firstDotEmail: {
        title: "First Dot Email",
        oracle: false,
        data: { email: { kind: 'firstDot' } },
        model: 'member',
    },
    lastDotEmail: {
        title: "Last Dot Email",
        oracle: false,
        data: { email: { kind: 'lastDot' } },
        model: 'member',
    },
    ipEmail: {
        title: "[BUG] IP Email",
        oracle: false,
        data: { email: { kind: 'ip' } },
        model: 'member',
    },
    ipv6Email: {
        title: "[BUG] IPv6 Email",
        oracle: false,
        data: { email: { kind: 'ipv6' } },
        model: 'member',
    },
    quotedStartingDotEmail: {
        title: "Quoted Starting Dot Email",
        oracle: true,
        data: { email: { kind: 'quotedStartingDot' } },
        model: 'member',
    },
    quotedEndingDotEmail: {
        title: "Quoted Ending Dot Email",
        oracle: true,
        data: { email: { kind: 'quotedEndingDot' } },
        model: 'member',
    },
    quotedConsecutiveDotsEmail: {
        title: "Quoted Consecutive Dots Email",
        oracle: true,
        data: { email: { kind: 'quotedConsecutiveDots' } },
        model: 'member',
    },
    quotedBannedCharsEmail: {
        title: "Quoted Banned Chars Email",
        oracle: true,
        data: { email: { kind: 'quotedBannedChars' } },
        model: 'member',
    },
    quotedWhitespaceEmail: {
        title: "Quoted Whitespace Email",
        oracle: true,
        data: { email: { kind: 'quotedWhitespace' } },
        model: 'member',
    },
    normalNotes: {
        title: "Normal Notes",
        oracle: true,
        data: { notes: { length: 100 } },
        model: 'member',
    },
    emptyNotes: {
        title: "Empty Notes",
        oracle: true,
        data: { notes: { omit: true } },
        model: 'member',
    },
    longNotes: {
        title: "Long Notes",
        oracle: false,
        data: { notes: { length: 501 } },
        model: 'member',
    },
    noteLessLimit: {
        title: "Note Less Than the limit (499)",
        oracle: true,
        data: { notes: { length: 499 } },
        model: 'member',
    },
    noteLimit: {
        title: "Note Limit (500)",
        oracle: true,
        data: { notes: { length: 500 } },
        model: 'member',
    },
    noteAboveLimit: {
        title: "Note Above Limit (501)",
        oracle: false,
        data: { notes: { length: 501 } },
        model: 'member',
    },
    label: {
        title: "Label",
        oracle: true,
        data: { labels: { number: 1, length: 5 } },
        model: 'member',
    },
    emptyLabel: {
        title: "Empty Label",
        oracle: true,
        data: { labels: { omit: true } },
        model: 'member',
    },
    onLimitLabel: {
        title: "Long Label at Limit (191)",
        oracle: true,
        data: { labels: { length: 191 } },
        model: 'member',
    },
    overLimitLabel: {
        title: "Long Label Over Limit (192)",
        oracle: false,
        data: { labels: { length: 192 } },
        model: 'member',
    },
    manyLabels: {
        title: "Many Labels",
        oracle: true,
        data: { labels: { number: 50, length: 5 } },
        model: 'member',
    },
    // STAFF SCENARIOS
    emptyStaffName: {
        title: "Empty Name",
        oracle: false,
        data: { name: { omit: true } },
        model: 'staff',
    },
    longStaffName: {
        title: "Long Name",
        oracle: true,
        data: { name: { length: 120 } },
        model: 'staff',
    },
    maxStaffName: {
        title: "Max Name",
        oracle: true,
        data: { name: { length: 191 } },
        model: 'staff',
    },
    overMaxStaffName: {
        title: "Over Max Name [truncated]",
        oracle: true,
        data: { name: { length: 192 } },
        model: 'staff',
    },
    shortStaffName: {
        title: "Short Name",
        oracle: true,
        data: { name: { length: 1 } },
        model: 'staff',
    },
    emojiStaffName: {
        title: "Emoji Name",
        oracle: true,
        data: { name: { kind: 'emoji' } },
        model: 'staff',
    },
    emptyStaffEmail: {
        title: "Empty Email",
        oracle: false,
        data: { email: { omit: true } },
        model: 'staff',
    },
    invalidStaffEmail: {
        title: "Invalid Email",
        oracle: false,
        data: { email: { kind: 'invalid' } },
        model: 'staff',
    },
    noTLDStaffEmail: {
        title: "No Top Level Domain Email",
        oracle: false,
        data: { email: { kind: 'noTLD' } },
        model: 'staff',
    },
    emojiStaffEmail: {
        title: "Emoji Email",
        oracle: false,
        data: { email: { kind: 'emoji' } },
        model: 'staff',
    },
    consecutiveDotsStaffEmail: {
        title: "Consecutive Dots Email",
        oracle: false,
        data: { email: { kind: 'consecutiveDots' } },
        model: 'staff',
    },
    firstDotStaffEmail: {
        title: "First Dot Email",
        oracle: false,
        data: { email: { kind: 'firstDot' } },
        model: 'staff',
    },
    lastDotStaffEmail: {
        title: "Last Dot Email",
        oracle: false,
        data: { email: { kind: 'lastDot' } },
        model: 'staff',
    },
    ipStaffEmail: {
        title: "[BUG] IP Email",
        oracle: false,
        data: { email: { kind: 'ip' } },
        model: 'staff',
    },
    ipv6StaffEmail: {
        title: "[BUG] IPv6 Email",
        oracle: false,
        data: { email: { kind: 'ipv6' } },
        model: 'staff',
    },
    normalStaffBio: {
        title: "Normal Bio",
        oracle: true,
        data: { bio: { length: 100 } },
        model: 'staff',
    },
    emptyStaffBio: {
        title: "Empty Bio",
        oracle: true,
        data: { bio: { omit: true } },
        model: 'staff',
    },
    bioLessLimit: {
        title: "Bio Less Than the limit (199)",
        oracle: true,
        data: { bio: { length: 199 } },
        model: 'staff',
    },
    bioLimit: {
        title: "Bio Limit (200)",
        oracle: true,
        data: { bio: { length: 200 } },
        model: 'staff',
    },
    bioAboveLimit: {
        title: "Bio Above Limit (201)",
        oracle: false,
        data: { bio: { length: 201 } },
        model: 'staff',
    },
    normalStaffWebsite: {
        title: "Normal Website",
        oracle: true,
        data: { website: { kind: 'regular' } },
        model: 'staff',
    },
    emptyStaffWebsite: {
        title: "Empty Website",
        model: 'staff',
        oracle: true,
        data: { website: { omit: true } },
    },
    invalidStaffWebsite: {
        title: "Invalid Website",
        oracle: false,
        data: { website: { kind: 'invalid' } },
        model: 'staff',
    },
    websiteNoTLD: {
        title: "No Top Level Domain Website",
        oracle: false,
        data: { website: { kind: 'noTLD' } },
        model: 'staff',
    },
    websiteNearFrontier: {
        title: "Website Near Frontier",
        oracle: true,
        data: { website: { length: 1999 } },
        model: 'staff',
    },
    websiteFrontier: {
        title: "Website Frontier",
        oracle: true,
        data: { website: { length: 2000 } },
        model: 'staff',
    },
    websiteOverFrontier: {
        title: "[BUG] Website Over Frontier",
        oracle: true,
        data: { website: { length: 2001 } },
        model: 'staff',
    },
    normalTwitter: {
        title: "Normal Twitter",
        oracle: true,
        data: { twitter: { length: 10 } },
        model: 'staff',
    },
    emptyTwitter: {
        title: "Empty Twitter",
        oracle: true,
        data: { twitter: { omit: true } },
        model: 'staff',
    },
    shortTwitter: {
        title: "Short Twitter",
        oracle: true,
        data: { twitter: { length: 1 } },
        model: 'staff',
    },
    twitterNearFrontier: {
        title: "Twitter Near Frontier (14)",
        oracle: true,
        data: { twitter: { length: 14 } },
        model: 'staff',
    },
    twitterFrontier: {
        title: "Twitter Frontier (15)",
        oracle: true,
        data: { twitter: { length: 15 } },
        model: 'staff',
    },
    twitterOverFrontier: {
        title: "[BUG] Twitter Over Frontier (16)",
        oracle: true,
        data: { twitter: { length: 16 } },
        model: 'staff',
    },
    normalFacebook: {
        title: "Normal Facebook",
        oracle: true,
        data: { facebook: { length: 30 } },
        model: 'staff',
    },
    emptyFacebook: {
        title: "Empty Facebook",
        oracle: true,
        data: { facebook: { omit: true } },
        model: 'staff',
    },
    facebookOverFrontier: {
        title: "[BUG] Facebook Over Frontier (50)",
        oracle: true,
        data: { facebook: { length: 51 } },
        model: 'staff',
    },
    // TAG SCENARIOS
    normalTag: {
        title: "Normal Tag",
        oracle: true,
        data: {
        },
        model: 'tag',
    },
    noNameTag: {
        title: "No Name Tag",
        oracle: false,
        data: {
            name: { omit: true },
        },
        model: 'tag',
    },
    longNameTag: {
        title: "Long Name Tag",
        oracle: true,
        data: {
            name: { length: 120 },
        },
        model: 'tag',
    },
    nearFrontierMinusOneNameTag: {
        title: "Name Near Frontier - 1 (189)",
        oracle: true,
        data: {
            name: { length: 189 },
        },
        model: 'tag',
    },
    nearFrontierNameTag: {
        title: "Name Near Frontier (190)",
        oracle: true,
        data: {
            name: { length: 190 },
        },
        model: 'tag',
    },
    frontierNameTag: {
        title: "Name Frontier (191)",
        oracle: true,
        data: {
            name: { length: 191 },
        },
        model: 'tag',
    },
    overFrontierNameTag: {
        title: "Name Over Frontier (192)",
        oracle: false,
        data: {
            name: { length: 192 },
        },
        model: 'tag',
    },
    onlyNameTag: {
        title: "Only Name Tag",
        oracle: true,
        data: {
            name: { once: true },
            color: { omit: true },
            description: { omit: true },
            slug: { omit: true },
        },
        model: 'tag',
    },
    colorWithPoundTag: {
        title: "Color with $ Tag",
        oracle: false,
        data: {
            color: { kind: 'colorWithPound' },
        },
        model: 'tag',
    },
    colorWithNoHashTag: {
        title: "Color with No # Tag",
        oracle: true,
        data: {
            color: { once: true },
        },
        model: 'tag',
    },
    colorWithHashTag: {
        title: "Color with # Tag",
        oracle: false,
        data: {
            color: { kind: 'colorWithHash' },
        },
        model: 'tag',
    },
    threeDigitColorTag: {
        title: "[BUG] Three Digit Color Tag",
        oracle: false,
        data: {
            color: { kind: 'threeDigitColor' },
        },
        model: 'tag',
    },
    emptyColorTag: {
        title: "Empty Color Tag",
        oracle: true,
        data: {
            color: { omit: true },
        },
        model: 'tag',
    },
    invalidColorTag: {
        title: "Invalid Color Tag",
        oracle: false,
        data: {
            color: { kind: 'invalidColor' },
        },
        model: 'tag',
    },
    normalDescriptionTag: {
        title: "Normal Description Tag",
        oracle: true,
        data: {
            description: { length: 100 },
        },
        model: 'tag',
    },
    emptyDescriptionTag: {
        title: "Empty Description Tag",
        oracle: true,
        data: {
            description: { omit: true },
        },
        model: 'tag',
    },
    nearLimitDescriptionMinusOneTag: {
        title: "Description Near Limit - 1 (498)",
        oracle: true,
        data: {
            description: { length: 498 },
        },
        model: 'tag',
    },
    nearLimitDescriptionTag: {
        title: "Description Near Limit (499)",
        oracle: true,
        data: {
            description: { length: 499 },
        },
        model: 'tag',
    },
    limitDescriptionTag: {
        title: "Description Limit (500)",
        oracle: true,
        data: {
            description: { length: 500 },
        },
        model: 'tag',
    },
    overLimitDescriptionTag: {
        title: "Description Over Limit (501)",
        oracle: false,
        data: {
            description: { length: 501 },
        },
        model: 'tag',
    },
    normalSlugTag: {
        title: "Normal Slug Tag",
        oracle: true,
        data: {
            slug: { once: true },
        },
        model: 'tag',
    },
    emptySlugTag: {
        title: "Empty Slug Tag",
        oracle: true,
        data: {
            slug: { omit: true },
        },
        model: 'tag',
    },
    longSlugTag: {
        title: "Long Slug Tag",
        oracle: true,
        data: {
            slug: { length: 120 },
        },
        model: 'tag',
    },
    nearFrontierSlugMinusOneTag: {
        title: "Slug Near Frontier - 1 (189)",
        oracle: true,
        data: {
            slug: { length: 189 },
        },
        model: 'tag',
    },
    nearFrontierSlugTag: {
        title: "Slug Near Frontier (190)",
        oracle: true,
        data: {
            slug: { length: 190 },
        },
        model: 'tag',
    },
    frontierSlugTag: {
        title: "Slug Frontier (191)",
        oracle: true,
        data: {
            slug: { length: 191 },
        },
        model: 'tag',
    },
    overFrontierSlugTag: {
        title: "Slug Over Frontier (192)",
        oracle: false,
        data: {
            slug: { length: 192 },
        },
        model: 'tag',
    },
} as const;

export function getData({ pool, identifier }: { pool: DataPoolType, identifier: string }): Member | Staff | Tag {
    let config = Scenarios[identifier]
    let data: Member | Staff | Tag | undefined = undefined;
    if (!config) {
        throw new Error(`Unknown scenario: ${identifier}`)
    }

    switch (pool) {
        case 'apriori':
        case 'dynamic':
            data = getFromPool(identifier, pool)
            break;
        case 'random':
            if (config.model === 'member') {
                data = {
                    name: generateName(config.data.name || { once: true }),
                    email: generateEmail(config.data.email || { once: true }),
                    notes: generateNotes(config.data.notes || { once: true }),
                    labels: generateLabels(config.data.labels || { omit: true }),
                } as Member
            } else if (config.model === 'staff') {
                data = {
                    name: config.data.name && generateName(config.data.name),
                    email: config.data.email && generateEmail(config.data.email),
                    bio: config.data.bio && generateNotes(config.data.bio),
                    website: generateWebsite(config.data.website || { omit: true }),
                    twitter: generateName(config.data.twitter || { omit: true }),
                    facebook: generateName(config.data.facebook || { omit: true }),
                } as Staff
                data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
            } else if (config.model === 'tag') {
                data = {
                    name: generateTagName(config.data.name || { once: true }),
                    slug: generateName(config.data.slug || { once: true }),
                    description: generateNotes(config.data.description || { once: true }),
                    color: generateColor(config.data.color || { omit: true }),
                }
            }
            break;
        default:
            throw new Error('Unknown pool');
    }
    if (data) {
        return data
    } else {
        throw new Error('No data found')
    }
}

function generateColor(options: FieldOption): string {
    let color = '';
    if (options.kind === 'colorWithPound') {
        color = '$000000';
    } else if (options.kind === 'colorWithHash') {
        color = '#000000';
    } else if (options.kind === 'threeDigitColor') {
        color = 'fff';
    } else if (options.kind === 'invalidColor') {
        color = 'invalid';
    } else {
        let generator = () => faker.internet.color();
        color = stringGenerator({
            ...options,
            generator,
        });
        color = color.replace('#', '');
    }
    return color;
}

function generateEmail(options: FieldOption): string {
    let email = '';
    if (options.kind === 'invalid') {
        email = 'invalid';
    } else if (options.kind === 'noTLD') {
        email = 'test@ghost';
    } else if (options.kind === 'emoji') {
        email = '😀@' + faker.internet.domainName();
    } else if (options.kind === 'validEmoji') {
        email = '✨❤️@' + faker.internet.domainName();
    } else if (options.kind === 'consecutiveDots') {
        email = 'test@ghost..io';
    } else if (options.kind === 'firstDot') {
        email = '.' + faker.person.firstName() + '@' + faker.internet.domainName();
    } else if (options.kind === 'lastDot') {
        email = 'test.@' + faker.internet.domainName();
    } else if (options.kind === 'ip') {
        email = 'test@[' + faker.internet.ipv4() + ']';
    } else if (options.kind === 'ipv6') {
        email = 'test@[' + faker.internet.ipv6() + ']';
    } else if (options.kind === 'quotedStartingDot') {
        email = '".' + faker.word.noun() + '"@' + faker.internet.domainName();
    } else if (options.kind === 'quotedEndingDot') {
        email = '"' + faker.word.noun() + '."@' + faker.internet.domainName();
    } else if (options.kind === 'quotedConsecutiveDots') {
        email = '"test..test"@' + faker.internet.domainName();
    } else if (options.kind === 'quotedBannedChars') {
        email = '"(),:;<>[]"@' + faker.internet.domainName();
    } else if (options.kind === 'quotedWhitespace') {
        email = '"test test"@' + faker.internet.domainName();
    } else if (options.kind === 'long') {
        email = 'soyelemailmaslargodelmundoperomientrastantolohagosinfaker@elmundodelfaker-perosinfakerenverdadprefieroasiparaprobarweiofgjiweofjiowejf-fiojwejiojwfeij.com';
    } else {
        let generator = () => faker.string.alphanumeric();
        email = emailGenerator({
            ...options,
            generator,
        });
    };
    return email;
}

function generateName(options: FieldOption): string {
    let name = '';
    if (options.kind === 'emoji') {
        return '😀';
    } else {
        let generator = () => faker.person.firstName();
        name = stringGenerator({
            ...options,
            generator,
        });
    }

    return name;
}

function generateTagName(options: FieldOption): string {
    let generator = () => faker.word.verb();
    return stringGenerator({
        ...options,
        generator,
    });
}

function generateLabels(options: FieldOption): string[] {
    let labels: string[] = [];
    let { number } = options;
    number = number || 1;
    number = options.omit ? 0 : number;
    let generator = () => faker.word.verb();
    for (let i = 0; i < number; i++) {
        labels.push(stringGenerator({
            ...options,
            generator,
        }));
    }
    return labels;
}

function generateWebsite(options: FieldOption): string {
    let res: string = '';
    if (options.kind === 'regular') {
        res = faker.internet.url();
    } else if (options.kind === 'noTLD') {
        res = faker.word.verb();
    } else if (options.kind === 'invalid') {
        res = 'invalid';
    } else {
        let generator = () => faker.string.alphanumeric();
        res = stringGenerator({
            ...options,
            generator,
        })
        if (options.length) {
            res = res.slice(0, options.length - 4) + '.com'
        }
    }
    return res;
}

function generateNotes(options: FieldOption): string {
    let generator = () => faker.lorem.paragraph(1);
    return stringGenerator({
        ...options,
        generator,
    });
}

// Generates a string from a given generator function matching the given
// options. For example generate a name using faker.name.findName, if the name
// needs to be 100 character longs keep string concatenating or slicing until
// it's 100 characters long.
function stringGenerator({ length, generator, omit, once }: FieldOption):
    string {
    let res = '';

    if (length) {
        while (res.length < length) {
            if (!generator) {
                throw new Error('generator is not defined');
            }
            res += generator();
        }
        if (res.length > length) {
            // Slice from the right
            res = res.slice(0, length);
        }
    }

    if (once === true) {
        // Once it's the default value, meaning one call to the generator
        if (!generator) {
            throw new Error('generator is not defined');
        }
        return generator();
    } else if (omit === true) {
        // Omit is true, return empty string
        return res
    }

    // If it ends with a space, change it for a random alphaNumeric, since ghost
    // removes trailing whitespaces in some fileds
    if (res.endsWith(' ')) {
        res = res.slice(0, -1) + faker.string.alphanumeric(1);
    }

    // Return a random string from the generator function compying with the given characteristics.
    return res;
}

function emailGenerator({ length, generator, omit, once }: FieldOption): string {
    let res = '';

    if (omit === true) {
        return res;
    }

    res = faker.internet.email();

    if (length) {
        while (res.length < length) {
            res = faker.string.alphanumeric(1) + res;
        }
        if (res.length > length) {
            res = res.slice(res.length - length);
        }
    }

    return res;
}

let DynamicPool: DataPool;
let LoadedDP = false;

let AprioriPool: DataPool;
let LoadedAP = false;

function getFromPool(identifier: string, poolType: DataPoolType): Member | Staff {
    let pool: DataPool;
    if (poolType === 'dynamic') {
        // Generate pool
        if (!LoadedDP) {
            DynamicPool = generatePool(false);
            LoadedDP = true;
        }
        pool = DynamicPool;
    } else if (poolType === 'apriori') {
        if (!LoadedAP) {
            // Read from file
            AprioriPool = JSON.parse(readFileSync(APRIORI_FILE, 'utf8')) as DataPool;
            LoadedAP = true;
        }
        pool = AprioriPool;
    } else {
        throw new Error('Invalid pool type');
    }

    let scenarioPool = pool[identifier];
    if (!scenarioPool) {
        throw new Error('Invalid identifier' + identifier);
    }

    let random = Math.floor(Math.random() * scenarioPool.length);
    let data = scenarioPool[random];
    scenarioPool.splice(random, 1);
    return data;
}

export function generatePool(write: boolean = true, seed?: number): DataPool {
    if (seed) {
        faker.seed(seed);
    }
    let pool: DataPool = {};
    Object.entries(Scenarios).forEach(([identifier, _]) => {
        // For each of the member scenarios let's create a "smaller" "inner" pool
        // of size DATA_POOL_GEN_PER_SCENARIO
        let scenarioData: Array<Staff | Member> = [];
        for (let i = 0; i < DATA_POOL_GEN_PER_SCENARIO; i++) {
            scenarioData.push(getData({ pool: 'random', identifier: identifier }));
        }
        pool[identifier] = scenarioData;
    });

    if (write) {
        // Only pass write when we want to update the apriori data pool
        writeFileSync(APRIORI_FILE, JSON.stringify(pool, null, 2));
    }
    return pool;
}

if (require.main === module) {
    generatePool(true, 23);
}