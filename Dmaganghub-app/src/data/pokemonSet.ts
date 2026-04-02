export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "double-rare"
  | "illustration-rare"
  | "ultra-rare"
  | "special-illustration-rare"
  | "mega-hyper-rare";

export interface PokemonCard {
  id: string;
  name: string;
  rarity: Rarity;
  hasReverse: boolean;
}

export const perfectOrderSet: PokemonCard[] = [
  // 001-010
  { id: "001", name: "Erika's Oddish", rarity: "common", hasReverse: true },
  { id: "002", name: "Bulbasaur", rarity: "common", hasReverse: true },
  { id: "003", name: "Ivysaur", rarity: "uncommon", hasReverse: true },
  { id: "004", name: "Erika's Bellsprout", rarity: "common", hasReverse: true },
  { id: "005", name: "Weepinbell", rarity: "uncommon", hasReverse: true },
  { id: "006", name: "Victreebel", rarity: "rare", hasReverse: true },
  { id: "007", name: "Erika's Tangela", rarity: "common", hasReverse: true },
  { id: "008", name: "Tangrowth", rarity: "uncommon", hasReverse: true },
  { id: "009", name: "Chikorita", rarity: "common", hasReverse: true },
  { id: "010", name: "Mega Meganium ex", rarity: "double-rare", hasReverse: false },

  // 011-020
  { id: "011", name: "Bayleef", rarity: "uncommon", hasReverse: true },
  { id: "012", name: "Meganium", rarity: "rare", hasReverse: true },
  { id: "013", name: "Beautifly", rarity: "common", hasReverse: true },
  { id: "014", name: "Silcoon", rarity: "common", hasReverse: true },
  { id: "015", name: "Cascoon", rarity: "common", hasReverse: true },
  { id: "016", name: "Budew", rarity: "common", hasReverse: true },
  { id: "017", name: "Roselia", rarity: "uncommon", hasReverse: true },
  { id: "018", name: "Roserade", rarity: "rare", hasReverse: true },
  { id: "019", name: "Team Rocket's Spidops", rarity: "uncommon", hasReverse: true },
  { id: "020", name: "Mega Masquerain ex", rarity: "double-rare", hasReverse: false },

  // 021-030
  { id: "021", name: "Charmander", rarity: "common", hasReverse: true },
  { id: "022", name: "Mega Charizard Y ex", rarity: "double-rare", hasReverse: false },
  { id: "023", name: "Charmeleon", rarity: "uncommon", hasReverse: true },
  { id: "024", name: "Charizard", rarity: "rare", hasReverse: true },
  { id: "025", name: "Entei", rarity: "rare", hasReverse: true },
  { id: "026", name: "Mega Entei ex", rarity: "double-rare", hasReverse: false },
  { id: "027", name: "Growlithe", rarity: "common", hasReverse: true },
  { id: "028", name: "Camerupt", rarity: "uncommon", hasReverse: true },
  { id: "029", name: "Numel", rarity: "common", hasReverse: true },
  { id: "030", name: "Mega Camerupt ex", rarity: "double-rare", hasReverse: false },

  // 031-040
  { id: "031", name: "Mega Emboar ex", rarity: "double-rare", hasReverse: false },
  { id: "032", name: "Tepig", rarity: "common", hasReverse: true },
  { id: "033", name: "Pignite", rarity: "uncommon", hasReverse: true },
  { id: "034", name: "Salandit", rarity: "common", hasReverse: true },
  { id: "035", name: "Salazzle", rarity: "uncommon", hasReverse: true },
  { id: "036", name: "Vulpix", rarity: "common", hasReverse: true },
  { id: "037", name: "Raboot", rarity: "common", hasReverse: true },
  { id: "038", name: "Scorbunny", rarity: "common", hasReverse: true },
  { id: "039", name: "Cinderace", rarity: "rare", hasReverse: true },
  { id: "040", name: "Golduck", rarity: "uncommon", hasReverse: true },

  // 041-050
  { id: "041", name: "Psyduck", rarity: "common", hasReverse: true },
  { id: "042", name: "Mega Golduck ex", rarity: "double-rare", hasReverse: false },
  { id: "043", name: "Mega Feraligatr ex", rarity: "double-rare", hasReverse: false },
  { id: "044", name: "Totodile", rarity: "common", hasReverse: true },
  { id: "045", name: "Croconaw", rarity: "uncommon", hasReverse: true },
  { id: "046", name: "Snorunt", rarity: "common", hasReverse: true },
  { id: "047", name: "Glalie", rarity: "uncommon", hasReverse: true },
  { id: "048", name: "Mega Glalie ex", rarity: "double-rare", hasReverse: false },
  { id: "049", name: "N's Vanillite", rarity: "common", hasReverse: true },
  { id: "050", name: "Vanillish", rarity: "uncommon", hasReverse: true },

  // 051-060
  { id: "051", name: "Vanilluxe", rarity: "rare", hasReverse: true },
  { id: "052", name: "Snom", rarity: "common", hasReverse: true },
  { id: "053", name: "Frosmoth", rarity: "uncommon", hasReverse: true },
  { id: "054", name: "Mega Frosmoth ex", rarity: "double-rare", hasReverse: false },
  { id: "055", name: "Pikachu", rarity: "common", hasReverse: true },
  { id: "056", name: "Raichu", rarity: "uncommon", hasReverse: true },
  { id: "057", name: "Mega Raichu ex", rarity: "double-rare", hasReverse: false },
  { id: "058", name: "Voltorb ex", rarity: "uncommon", hasReverse: true },
  { id: "059", name: "Electrode", rarity: "rare", hasReverse: true },
  { id: "060", name: "Mega Electrode ex", rarity: "double-rare", hasReverse: false },

  // 061-070
  { id: "061", name: "Mega Eelektross ex", rarity: "double-rare", hasReverse: false },
  { id: "062", name: "Tynamo", rarity: "common", hasReverse: true },
  { id: "063", name: "Eelektrik", rarity: "uncommon", hasReverse: true },
  { id: "064", name: "Heliolisk", rarity: "uncommon", hasReverse: true },
  { id: "065", name: "Helioptile", rarity: "common", hasReverse: true },
  { id: "066", name: "Mega Heliolisk ex", rarity: "double-rare", hasReverse: false },
  { id: "067", name: "Tapu Koko", rarity: "rare", hasReverse: true },
  { id: "068", name: "Tapu Bulu", rarity: "rare", hasReverse: true },
  { id: "069", name: "Tapu Fini", rarity: "rare", hasReverse: true },
  { id: "070", name: "Iono's Bellibolt ex", rarity: "double-rare", hasReverse: false },

  // 071-079
  { id: "071", name: "Tadbulb", rarity: "common", hasReverse: true },
  { id: "072", name: "Bellibolt", rarity: "uncommon", hasReverse: true },
  { id: "073", name: "Miraidon ex", rarity: "double-rare", hasReverse: false },
  { id: "074", name: "Magnemite", rarity: "common", hasReverse: true },
  { id: "075", name: "Magneton", rarity: "uncommon", hasReverse: true },
  { id: "076", name: "Lillie's Clefairy ex", rarity: "double-rare", hasReverse: false },
  { id: "077", name: "Clefairy", rarity: "common", hasReverse: true },
  { id: "078", name: "Clefable", rarity: "uncommon", hasReverse: true },
  { id: "079", name: "Team Rocket's Mewtwo ex", rarity: "double-rare", hasReverse: false },
];
