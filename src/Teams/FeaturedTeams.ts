import { Team } from "./Types";

export type FeaturedTeamType = {
  team: Team;
  name: string;
  description: string;
  author: string;
};

const featuredTeams: FeaturedTeamType[] = [
  {
    team: {
      code: "A7AGXNQ43N",
      team: [
        {
          pid: "e9bcbcd27cbf3b4b749425a8f69ab9f7",
          specie: "shroom_s",
          date: 45580.6433159722,
          number: "17",
          color: [1.013693396, 1.1540165136, 1.242261813, 1.242261813],
          name: "Felicia",
          spr_index: 0,
          xp: 22439,
          scale: 0.5222216705,
          vibe: 7,
          ability_index: 1,
          ba_r: 0.933618634,
          ha_r: 1,
          ma_r: 0.971516035,
          bd_r: 0.9065817846,
          hd_r: 1,
          md_r: 0.970676965,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 0,
          hd_t: 56,
          md_t: 0,
          attklist: ["bomb", "protect", "mark"],
        },
        {
          pid: "ecf41e2bceee7154c5915c9bf765be62",
          specie: "cheerleader",
          date: 45519.5569965278,
          number: "09",
          color: [
            0.653630292, 0.2595672291, 0.0774757769, 0.712597592, 0.2602927275,
            0.6102480628,
          ],
          name: "Daphne",
          spr_index: 0,
          xp: 24300,
          scale: 0.8710822463,
          vibe: 21,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 19,
          ha_t: 120,
          ma_t: 1,
          bd_t: 26,
          hd_t: 73,
          md_t: 1,
          attklist: ["set", "crowd", "cheer"],
        },
        {
          pid: "b34450d627245da8d60d0459540e2bd9",
          specie: "frog2",
          date: 45459.8536053241,
          number: "01",
          color: [0.6599869579, 0.8234936446, 0.0705553144, 0.5156844112],
          name: "Sedum",
          spr_index: 0,
          xp: 19586,
          scale: 0.0164620243,
          vibe: 21,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 49,
          ha_t: 0,
          ma_t: 0,
          bd_t: 120,
          hd_t: 71,
          md_t: 0,
          attklist: ["minddown", "myheartpass", "rhythm"],
        },
        {
          pid: "cb92c8cf72f7e57d12e774e0e01468bf",
          specie: "lyrebird",
          date: 45519.9111284722,
          number: "13",
          color: [
            0.1887647174, 0.3028412573, 0.7897929512, 0.7586407475,
            0.6365427636,
          ],
          name: "Iris",
          spr_index: 0,
          xp: 24030,
          scale: 0.2241644971,
          vibe: 15,
          ability_index: 0,
          ba_r: 0.988317203,
          ha_r: 0.9755222225,
          ma_r: 0.9611267594,
          bd_r: 0.9707265787,
          hd_r: 0.9623127877,
          md_r: 1,
          ba_t: 7,
          ha_t: 120,
          ma_t: 3,
          bd_t: 4,
          hd_t: 55,
          md_t: 3,
          attklist: ["dragontail", "bomb", "whirlwind"],
        },
        {
          pid: "fb1308b3872c6fd3100bd072511e673c",
          specie: "serval1",
          date: 45460.9770196759,
          number: "05",
          color: [
            1.3633312248, 1.455134701, 1.1380788647, 1.6971642785, 1.8474061154,
          ],
          name: "Thymus",
          spr_index: 0,
          xp: 21600,
          scale: 0.4655743502,
          vibe: 23,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 68,
          ha_t: 4,
          ma_t: 0,
          bd_t: 75,
          hd_t: 5,
          md_t: 88,
          attklist: ["tagattack", "feint", "rush"],
        },
      ],
    },
    name: "The Future Flowers",
    description: "Rally + Bang",
    author: "Jdavis",
  },
  {
    team: {
      code: "8CDGYVBMLZ",
      team: [
        {
          pid: "b1ca2e7bab0d63cf8a16c5f2f9b33b24",
          specie: "seal",
          date: 45580.6114756944,
          number: "13",
          color: [0.6739021689, 0.1738385707, 0.2833523899],
          name: "Tromby",
          spr_index: 0,
          xp: 30536,
          scale: 0.102305308,
          vibe: 15,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 120,
          ha_t: 0,
          ma_t: 0,
          bd_t: 0,
          hd_t: 109,
          md_t: 11,
          attklist: ["serve", "set", "healhit"],
        },
        {
          pid: "b86eb2619599f755a7de7760806411c7",
          specie: "lyrebird",
          date: 45460.6985590278,
          number: "09",
          color: [
            0.3568251319, 0.5745795108, 0.0728903897, 0.1631994287,
            0.8805142352,
          ],
          name: "Sax",
          spr_index: 0,
          xp: 24030,
          scale: 0.3804927804,
          vibe: 18,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 80,
          hd_t: 40,
          md_t: 0,
          attklist: ["cut", "bomb", "whirlwind"],
        },
        {
          pid: "fd7c32846c1060ef74291c4249991d97",
          specie: "bilby2",
          date: 45460.6203993056,
          number: "01",
          color: [
            1.3629381098, 1.5230561681, 1.2330299951, 1.8944110759,
            1.1999667026,
          ],
          name: "Bonne",
          spr_index: 0,
          xp: 24272,
          scale: 0.3385164328,
          vibe: 9,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 120,
          bd_t: 44,
          hd_t: 59,
          md_t: 17,
          attklist: ["trap", "set", "mindbomb"],
        },
        {
          pid: "0ed2fd9d6ba2167560366c28cb100c11",
          specie: "shroom_m",
          date: 45460.6203993056,
          number: "02",
          color: [0.7965793293, 0.8467342779, 0.3292826042, 0.3292826042],
          name: "Snare",
          spr_index: 0,
          xp: 27000,
          scale: 0.903122593,
          vibe: 10,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 120,
          bd_t: 0,
          hd_t: 60,
          md_t: 60,
          attklist: ["set", "hazeball", "trap"],
        },
        {
          pid: "6a7965591aed412041a8833148387ff5",
          specie: "cheerleader",
          date: 45518.4847395833,
          number: "10",
          color: [
            0.4268744364, 0.9540684894, 0.4569835439, 0.5106971338,
            0.0550119057, 0.4412161785,
          ],
          name: "Clair",
          spr_index: 0,
          xp: 24300,
          scale: 0.0266867075,
          vibe: 22,
          ability_index: 0,
          ba_r: 1,
          ha_r: 0.9999901922,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 60,
          hd_t: 120,
          md_t: 60,
          attklist: ["set", "healhit", "cheer"],
        },
      ],
    },
    name: "Jazz Hands V2.26",
    description: "Heavy pressure momentum team to force 50/50s or checkmates",
    author: "Pryn",
  },
  {
    team: {
      code: "H68PEKP5LS",
      team: [
        {
          pid: "d026c0d17ec1c41f17622ae667e6e922",
          specie: "alien1",
          date: 45516.8454918981,
          number: "99",
          color: [0.7936191633, 0.4682144299, 0.8252028897, 0.2044383064],
          name: "Cymbal",
          spr_index: 0,
          xp: 28890,
          scale: 0.6116939858,
          vibe: 19,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 120,
          bd_t: 60,
          hd_t: 60,
          md_t: 0,
          attklist: ["mindbomb", "refresh", "taunt"],
        },
        {
          pid: "ef54ab0eb08fb6b48e3a209b537c4be6",
          specie: "platypus2",
          date: 45454.0305729167,
          number: "06",
          color: [0.2028763816, 0.2519027218, 0.429354541],
          name: "Theremin",
          spr_index: 0,
          xp: 27270,
          scale: 0.5538546368,
          vibe: 23,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 120,
          bd_t: 0,
          hd_t: 60,
          md_t: 60,
          attklist: ["hazeball", "trap", "stress"],
        },
        {
          pid: "662a449fbeaf7b675e866d4cdfb1aa77",
          specie: "rocklizard2",
          date: 45516.7299826389,
          number: "20",
          color: [0.2315416038, 0.1436685026, 0.1956836879, 0.6385847032],
          name: "Maraca",
          spr_index: 0,
          xp: 27540,
          scale: 0.3216843307,
          vibe: 6,
          ability_index: 0,
          ba_r: 0.9999946312,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 120,
          ha_t: 0,
          ma_t: 0,
          bd_t: 60,
          hd_t: 60,
          md_t: 0,
          attklist: ["rocket", "feint", "protect"],
        },
        {
          pid: "98c2d414c9a4d61e7e1cf6f83fbb04c8",
          specie: "dragonfly",
          date: 45453.7539872685,
          number: "02",
          color: [
            0.4265552238, 0.2701427713, 0.052838333, 0.1702093261, 0.8452986078,
          ],
          name: "Drammatico",
          spr_index: 0,
          xp: 26730,
          scale: 0.6952878907,
          vibe: 8,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 60,
          hd_t: 60,
          md_t: 0,
          attklist: ["damagedattack", "rush", "whirlwind"],
        },
        {
          pid: "f67e72a1d1a0f276ce3beb0fd457fea1",
          specie: "cheerleader",
          date: 45517.3001793982,
          number: "27",
          color: [
            0.8105163202, 0.5025195405, 0.6732123122, 0.5467877313,
            0.3807240352, 0.5843072459,
          ],
          name: "Melody",
          spr_index: 0,
          xp: 24300,
          scale: 0.3950994834,
          vibe: 11,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 100,
          hd_t: 20,
          md_t: 120,
          attklist: ["shakenhit", "set", "cheer"],
        },
      ],
    },
    name: "The Showstoppers",
    description:
      "A balance team that uses various forms of opponent disruption (Provoke, Cyclone, Frazzle, Tractor Beam) to create weaknesses in the opposing team before switching to a powerful Cheer or Feint boosted offense.",
    author: "Score",
  },
  {
    team: {
      code: "GT111VJ9Y0",
      team: [
        {
          pid: "de2c71766bdbacae53d5cbcabbfff834",
          specie: "seal",
          date: 45580.0612326389,
          number: "37",
          color: [0.8869131804, 0.6856588125, 0.8094605207],
          name: "Broslidon",
          spr_index: 0,
          xp: 27675,
          scale: 0.6882799864,
          vibe: 23,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 0.9999937212,
          ba_t: 83,
          ha_t: 0,
          ma_t: 0,
          bd_t: 82,
          hd_t: 0,
          md_t: 75,
          attklist: ["serve", "dig", "swordsdance"],
        },
        {
          pid: "3c8e3223c122b9463ca74cfa223d3244",
          specie: "cheerleader",
          date: 45516.8495081018,
          number: "29",
          color: [
            0.411010243, 0.5167391375, 0.2094666138, 0.7164270356, 0.3093131557,
            0.6112295464,
          ],
          name: "Cherrily",
          spr_index: 0,
          xp: 24300,
          scale: 0.1728425995,
          vibe: 1,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 120,
          hd_t: 48,
          md_t: 72,
          attklist: ["freeball", "shakenhit", "rhythm"],
        },
        {
          pid: "5f89c8e889d4218a74d05e44173c5d8d",
          specie: "frog2",
          date: 45455.9569965278,
          number: "99",
          color: [0.9958736412, 0.3192763887, 0.9371686988, 0.6477795504],
          name: "Hopsong",
          spr_index: 0,
          xp: 27000,
          scale: 0.6800038777,
          vibe: 7,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 105,
          ma_t: 0,
          bd_t: 86,
          hd_t: 49,
          md_t: 0,
          attklist: ["heart", "rhythm", "myheartpass"],
        },
        {
          pid: "b042316feba367b28179c3c995ce154e",
          specie: "bestie",
          date: 45462.5564178241,
          number: "24",
          color: [0.8995430022, 0.5180261284, 0.0827575475],
          name: "Diggum",
          spr_index: 0,
          xp: 29430,
          scale: 0.9791655093,
          vibe: 7,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 120,
          hd_t: 120,
          md_t: 0,
          attklist: ["libero", "set", "refresh"],
        },
        {
          pid: "6821b82bf899a7c538b1430dc5a8a0be",
          specie: "shroom_s",
          date: 45581.601880787,
          number: "38",
          color: [0.533512857, 0.7762490157, 0.6821781695, 0.6821781695],
          name: "Surgus",
          spr_index: 0,
          xp: 27000,
          scale: 0.5349489562,
          vibe: 4,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 0,
          hd_t: 120,
          md_t: 0,
          attklist: ["bomb", "crowd", "refresh"],
        },
      ],
    },
    name: "Brosong",
    description:
      "Broslidon works as a setup and good lead; the team's constant healing is designed to help it stay on the field. If required however, Rally surgus and Epass Hopsong an work as powerful attackers.",
    author: "Ket",
  },
  {
    team: {
      code: "1F6MN8J3SQ",
      team: [
        {
          pid: "a91d6db6c3f79bb5e856257891447445",
          specie: "seal",
          date: 45582.8650173611,
          number: "56",
          color: [0.3164851442, 0.3109860495, 0.7331418172],
          name: "Broslidon",
          spr_index: 0,
          xp: 27675,
          scale: 0.6213205829,
          vibe: 1,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 0.9999906388,
          ba_t: 120,
          ha_t: 0,
          ma_t: 0,
          bd_t: 60,
          hd_t: 60,
          md_t: 0,
          attklist: ["serve", "curse", "dig"],
        },
        {
          pid: "023fff2ba22f6d58837eed97de56962c",
          specie: "bestie",
          date: 45520.9088599537,
          number: "44",
          color: [0.6585698351, 0.5460050032, 0.9909728393],
          name: "Diggum",
          spr_index: 0,
          xp: 29430,
          scale: 0.4943937287,
          vibe: 12,
          ability_index: 1,
          ba_r: 0.9866356306,
          ha_r: 0.9886794776,
          ma_r: 0.9918957665,
          bd_r: 0.9931943671,
          hd_r: 1,
          md_r: 0.9889396475,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 80,
          hd_t: 40,
          md_t: 120,
          attklist: ["set", "heart", "allyrush"],
        },
        {
          pid: "77e2d96fb03088f4c3e52d9567d35d51",
          specie: "psychic",
          date: 45580.9083506944,
          number: "49",
          color: [
            0.4024686217, 0.3477131724, 0.3076128364, 0.0525342822,
            0.5935515764,
          ],
          name: "Psylusc",
          spr_index: 0,
          xp: 28350,
          scale: 0.6648616195,
          vibe: 14,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 120,
          bd_t: 0,
          hd_t: 0,
          md_t: 120,
          attklist: ["telekinesis", "lockon", "moon"],
        },
        {
          pid: "006dea506c86d26f84e04290e4a61973",
          specie: "millipede",
          date: 45522.7633275463,
          number: "46",
          color: [0.2855664641, 0.1171927005, 0.2388849407],
          name: "Demolipede",
          spr_index: 0,
          xp: 28350,
          scale: 0.3105043322,
          vibe: 20,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 120,
          ha_t: 0,
          ma_t: 0,
          bd_t: 60,
          hd_t: 60,
          md_t: 0,
          attklist: ["rest", "body", "protect"],
        },
        {
          pid: "45577a034170a15d64efda36a1111499",
          specie: "moth",
          date: 45520.8216956019,
          number: "43",
          color: [
            0.2248280235, 0.1493756063, 0.6377838291, 0.6572705396,
            0.6572705396,
          ],
          name: "Plumask",
          spr_index: 0,
          xp: 12133,
          scale: 0.8568082082,
          vibe: 2,
          ability_index: 0,
          ba_r: 0.7543948004,
          ha_r: 0.6941135435,
          ma_r: 0.8829467148,
          bd_r: 0.8939972652,
          hd_r: 0.6944568081,
          md_r: 0.9889355963,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 0,
          hd_t: 120,
          md_t: 0,
          attklist: ["preblock", "facade", "protect"],
        },
      ],
    },
    name: "team 1",
    description: "Lock Target + Rainbow with support",
    author: "scissors",
  },
  {
    team: {
      code: "JX10GDQT0X",
      team: [
        {
          pid: "db97b2d7a956a2625991bdf7a0883d1f",
          specie: "bilby2",
          date: 45579.97234375,
          number: "01",
          color: [
            1.552340921, 1.669044476, 1.5170907639, 1.5389300697, 1.7474790663,
          ],
          name: "Moon",
          spr_index: 0,
          xp: 27000,
          scale: 0.9656085186,
          vibe: 20,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 80,
          bd_t: 40,
          hd_t: 80,
          md_t: 40,
          attklist: ["mind", "stresspass", "protect"],
        },
        {
          pid: "34b75c2ce70bb1fa7eb8e09bc2e8d0c4",
          specie: "lyrebird",
          date: 45582.9913599537,
          number: "05",
          color: [
            0.96906472, 0.0637039319, 0.1205214935, 0.783483495, 0.640753679,
          ],
          name: "Nova",
          spr_index: 0,
          xp: 24030,
          scale: 0.3202901259,
          vibe: 23,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 0,
          hd_t: 120,
          md_t: 0,
          attklist: ["flyback", "rush", "whirlwind"],
        },
        {
          pid: "fd0a69db936175a0c265fbf168edf2f8",
          specie: "dog",
          date: 45582.9934895833,
          number: "06",
          color: [
            0.8337727729, 0.7911027074, 0.3001170754, 0.1830299497,
            0.0129347444,
          ],
          name: "Apollo",
          spr_index: 0,
          xp: 24840,
          scale: 0.0640395619,
          vibe: 6,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 60,
          ma_t: 0,
          bd_t: 120,
          hd_t: 60,
          md_t: 0,
          attklist: ["damagedattack", "dig", "protect"],
        },
        {
          pid: "d579aa59be578e2439bb75fc5e525357",
          specie: "daredevil",
          date: 45582.9977141204,
          number: "07",
          color: [
            0.8951974923, 0.097535111, 0.8686215952, 0.4356528893, 0.1293484643,
          ],
          name: "Orion",
          spr_index: 0,
          xp: 22950,
          scale: 0.8819397243,
          vibe: 24,
          ability_index: 0,
          ba_r: 0.9359798548,
          ha_r: 0.8434173389,
          ma_r: 0.847003564,
          bd_r: 0.9728132155,
          hd_r: 0.9374902248,
          md_r: 1,
          ba_t: 120,
          ha_t: 0,
          ma_t: 0,
          bd_t: 120,
          hd_t: 0,
          md_t: 0,
          attklist: ["tagattack", "dig", "bench"],
        },
        {
          pid: "97988301805cff8d699aaea7dea45e0b",
          specie: "cheerleader",
          date: 45583.6890104167,
          number: "13",
          color: [
            0.9090492427, 0.1803575456, 0.5282644928, 0.6451281011,
            0.9808060825, 0.8865462244,
          ],
          name: "Venus",
          spr_index: 0,
          xp: 16672,
          scale: 0.7950580362,
          vibe: 7,
          ability_index: 1,
          ba_r: 0.971538157,
          ha_r: 0.9708323772,
          ma_r: 0.9677022859,
          bd_r: 0.9666593878,
          hd_r: 0.9710776518,
          md_r: 0.9681350972,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 100,
          hd_t: 80,
          md_t: 60,
          attklist: ["set", "rhythm", "followme"],
        },
      ],
    },
    name: "Please Nerf Airblast",
    description:
      "Offense team with a heavy focus on Airblast with Zefyre. Handicoot and Cherrily help with setting Zefyre up. Fetcham and Radillo help with Zefyre's lack of physical bulk, and they can also become alternate win conditions. The team does have a weakspot in Powerful Mind moves, so keep an eye on those teams. Keeping heavy control on momentum and your lack of clear bulk is key to winning.",
    author: "Cham Cham",
  },
  {
    team: {
      code: "UC09H65LWL",
      team: [
        {
          pid: "d380f3163b290493769c7477dad81663",
          specie: "dragonfly",
          date: 45581.9401446759,
          number: "97",
          color: [
            0.6624929495, 0.4983930327, 0.6105990894, 0.5900136866,
            0.0531789251,
          ],
          name: "Kiwi",
          spr_index: 0,
          xp: 26730,
          scale: 0.6823723502,
          vibe: 24,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 40,
          ma_t: 0,
          bd_t: 120,
          hd_t: 20,
          md_t: 60,
          attklist: ["dragontail", "followme", "protect"],
        },
        {
          pid: "0218b91432df396788339d1013cf9ed1",
          specie: "jellyfish2",
          date: 45581.8876446759,
          number: "000",
          color: [0.0346282795, 0.3211043256],
          name: "Plum",
          spr_index: 0,
          xp: 29430,
          scale: 0.301385887,
          vibe: 0,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 0,
          bd_t: 100,
          hd_t: 60,
          md_t: 80,
          attklist: ["careful", "trap", "sting"],
        },
        {
          pid: "bbdf7fe8fa1110402f4e78849ffcfe40",
          specie: "bilby2",
          date: 45581.7949247685,
          number: "99",
          color: [
            0.7169030886, 0.5588758197, 0.3111351859, 0.4550858494,
            0.4858468138,
          ],
          name: "Blueberry",
          spr_index: 0,
          xp: 27000,
          scale: 0.7057869341,
          vibe: 18,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 0,
          ma_t: 120,
          bd_t: 40,
          hd_t: 80,
          md_t: 0,
          attklist: ["passattack", "set", "dig"],
        },
        {
          pid: "b9465a79aab54a00581cbb8561bc9c13",
          specie: "shroom_s",
          date: 45581.7949247685,
          number: "101",
          color: [0.5389499217, 0.5527110249, 0.3528197557, 0.3528197557],
          name: "Coconut",
          spr_index: 0,
          xp: 27000,
          scale: 0.8731486946,
          vibe: 8,
          ability_index: 1,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 0,
          ha_t: 120,
          ma_t: 0,
          bd_t: 40,
          hd_t: 0,
          md_t: 80,
          attklist: ["bomb", "callout", "refresh"],
        },
        {
          pid: "3c36bf5952fefb911120457ba6b00a3d",
          specie: "football",
          date: 45583.1860243056,
          number: "52",
          color: [1.3967301771, 1.6096804962, 1.6778619811, 1.6711805277],
          name: "Grape",
          spr_index: 0,
          xp: 27270,
          scale: 0.5076218769,
          vibe: 17,
          ability_index: 0,
          ba_r: 1,
          ha_r: 1,
          ma_r: 1,
          bd_r: 1,
          hd_r: 1,
          md_r: 1,
          ba_t: 120,
          ha_t: 0,
          ma_t: 0,
          bd_t: 0,
          hd_t: 120,
          md_t: 0,
          attklist: ["rocket", "allyrush", "powswitch"],
        },
      ],
    },
    name: "The Violet Lights",
    description: "Not much competitively, but they're my guys and I love them.",
    author: "xXChickyChuXx",
  },
];

export default featuredTeams;
