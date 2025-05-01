var products = [
    {
        "category": "Foods",
        "image": "food/food",
        "contents": [
            {
                "isAvailable": true,
                "name": "Fancy Feast",
                "image": "food/food1",
                "description": "Grilled Seafood Feast, Pack Canned Cat Food 3-oz & Case of 24",
                "code": "a-Fncy-Fst",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 500
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 700
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 900
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Meow Mix",
                "image": "food/food2",
                "description": "Original Choice Dry Cat Food, 22-lb bag",
                "code": "a-Mw-Mx",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 850
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 950
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1050
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Tiny Tiger",
                "image": "food/food3",
                "description": "Pate Beef & Poultry Recipes Variety Pack Grain-Free Canned Cat Food, 3-oz can, case of 24",
                "code": "a-Tny-Tgr",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 720
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 830
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 900
                    }
                ]
            },
            {
                "isAvailable": false,
                "name": "IAms",
                "image": "food/food4",
                "description": "",
                "code": "a-IAms",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1560
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1670
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1790
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Orijen",
                "image": "food/food5",
                "description": "Original Grain-Free Dry Cat Food, 4-lb bag",
                "code": "a-Orjn",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1550
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1660
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1770
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Blue Buffalo",
                "image": "food/food6",
                "description": "Tastefuls Ocean Fish & Tuna Entrée Pate Wet Cat Food, 3-oz can, case of 4",
                "code": "a-Bl-Bffl",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 120
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 240
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 330
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Temptations",
                "image": "food/food7",
                "description": "Tempting Tuna & Chicken Flavor Adult Dry Cat Food, 13.5-lb bag",
                "code": "a-Tmpttns",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 450
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 650
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 800
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Purina One",
                "image": "food/food8",
                "description": "+Plus Healthy Kitten Formula Natural Dry Cat Food, 16-lb bag",
                "code": "a-Prn-1",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1490
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1580
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1670
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Sheba",
                "image": "food/food9",
                "description": "Chicken & Salmon Pate Entree Variety Pack Adult Wet Cat Food Trays, 2.6-oz, case of 6 twin-packs",
                "code": "a-Shb",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 140
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 260
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 360
                    }
                ]
            }
        ]
    },
    {
        "category": "Treats",
        "image": "treat/treat",
        "contents": [
            {
                "isAvailable": true,
                "name": "Friskies Grill",
                "code": "b-FrsksG",
                "image": "treat/treat1",
                "description": "Mix Mixed Grill Crunch Flavor Crunchy Cat Treats, 6-oz bag",
                "price": 250
            },
            {
                "isAvailable": false,
                "name": "Friskies Chicken",
                "code": "b-FrsksC",
                "image": "treat/treat2",
                "description": "",
                "price": 200
            },
            {
                "isAvailable": true,
                "name": "Temptations",
                "code": "b-Tmpttns",
                "image": "treat/treat3",
                "description": "Classic Tasty Chicken Flavor Soft & Crunchy Cat Treats, 16-oz tub",
                "price": 430
            },
            {
                "isAvailable": true,
                "name": "Greenies",
                "code": "b-Grns",
                "image": "treat/treat4",
                "description": "Feline Oven Roasted Chicken Flavor Adult Dental Cat Treats, 4.6-oz bag",
                "price": 300
            },
            {
                "isAvailable": false,
                "name": "Meow Mix",
                "code": "b-Mw-Mx",
                "image": "treat/treat5",
                "description": "",
                "price": 70
            },
            {
                "isAvailable": true,
                "name": "Hartz",
                "code": "b-Hrtz",
                "image": "treat/treat6",
                "description": "Delectables Squeeze Up Variety Pack Lickable Cat Treats, 0.5-oz tube, 24 count",
                "price": 760
            },
            {
                "isAvailable": true,
                "name": "Sheba",
                "code": "b-Shb",
                "image": "treat/treat7",
                "description": "Meaty Tender Sticks Chicken Flavor Soft Adult Cat Treats, 5 count",
                "price": 90
            },
            {
                "isAvailable": true,
                "name": "Applaws",
                "code": "b-Applws",
                "image": "treat/treat8",
                "description": "Salmon Grain-Free Freeze-Dried Cat Treats, 1-oz bag",
                "price": 350
            },  
            {
                "isAvailable": true,
                "name": "Fancy Feast",
                "code": "b-Fncy-Fst",
                "image": "treat/treat9",
                "description": "Purina Fancy Feast Purely Natural Chicken, Tuna & Salmon Variety Pack Soft Cat Treat, 10 count",
                "price": 200
            }
        ]
    },
    {
        "category": "Health",
        "image": "health/health",
        "contents": [
            {
                "isAvailable": true,
                "name": "Seresto",
                "code": "c-Srst",
                "image": "health/health1",
                "description": "Flea & Tick Collar for Cats, 1 Collar (8-mos. supply)",
                "price": 3390
            },
            {
                "isAvailable": true,
                "name": "Capstar",
                "code": "c-Cpstr",
                "image": "health/health2",
                "description": "Flea Oral Treatment for Cats, 2-25 lbs, 6 Tablets",
                "price": 1780
            },
            {
                "isAvailable": true,
                "name": "NextStar",
                "code": "c-NxtStr",
                "image": "health/health3",
                "description": "Fast Acting Cat Flea & Tick Treatment 3 doses",
                "price": 2240
            },
            {
                "isAvailable": true,
                "name": "PetArmor",
                "code": "c-Ptrmr",
                "image": "health/health4",
                "description": "PetArmor Coconut Berry Scented Flea & Tick Shampoo for Cats, 12-oz bottle",
                "price": 460
            },
            {
                "isAvailable": true,
                "name": "Elanco",
                "code": "c-Lnc",
                "image": "health/health5",
                "description": "Dewormer for Tapeworms for Cats, 3 count",
                "price": 920
            },
            {
                "isAvailable": true,
                "name": "Fera Pets",
                "code": "c-Fr-Pts",
                "image": "health/health6",
                "description": "USDA Organic Pumpkin Plus Fiber Support for Dogs & Cats, 90 servings",
                "price": 1950
            },
            {
                "isAvailable": true,
                "name": "Zesty Paws",
                "code": "c-Zsty-Pws",
                "image": "health/health7",
                "description": "Digestion Gut Health Chicken Mousse Lickable Squeeze Supplement for Cats, 18 count",
                "price": 1030
            },
            {
                "isAvailable": false,
                "name": "Catstages",
                "code": "c-Ctstgs",
                "image": "health/health8",
                "description": "",
                "price": 270
            },  
            {
                "isAvailable": true,
                "name": "Vetericyn",
                "code": "c-Vtrcyn",
                "image": "health/health9",
                "description": "Plus Antimicrobial Cat Wound Care Spray, 3-oz bottle",
                "price": 750
            }
        ]
    },
    {
        "category": "Litters",
        "image": "litter/litter",
        "contents": [
            {
                "isAvailable": true,
                "name": "Fresh Step",
                "image": "litter/litter1",
                "description": "Multi-Cat Extra Strength Scented Clumping Cat Litter, 25-lb",
                "code": "d-Frsh-Stp",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 830
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 910
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 970
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Pretty Litter",
                "image": "litter/litter2",
                "description": "Health Monitoring Cat Litter, 8-lb bag",
                "code": "d-Prtty-Lttr",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1200
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1320
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1490
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Arm & Hammer Litter Clump",
                "image": "litter/litter4",
                "description": "Clump & Seal Lightweight Scented Clumping Cat Litter, 18-lb bag",
                "code": "d-R&H-LttrC",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1100
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1240
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1370
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Dr.Elsey's",
                "image": "litter/litter5",
                "description": "Crystal Attract Long-Hair Crystal Cat Litter, 8-lb bag",
                "code": "d-D-lsy",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 910
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1080
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1190
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Tidy Cats Light",
                "image": "litter/litter5",
                "description": "Free & Clean Lightweight Unscented Clumping Clay Cat Litter, 17-lb box",
                "code": "d-Tdy-CtsL",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1230
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1300
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1390
                    }
                ]
            },
            {
                "isAvailable": false,
                "name": "Arm & Hammer Litter Slide",
                "image": "litter/litter6",
                "description": "",
                "code": "d-R&H-LttrS",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1270
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1390
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1520
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Tidy Cats Clean",
                "image": "litter/litter7",
                "description": "Free & Clean Unscented Clumping Clay Cat Litter, 35-lb pail",
                "code": "d-Tdy-CtsC",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 910
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1010
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1110
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Dr.Elsey's Ultra",
                "image": "litter/litter8",
                "description": "Ultra Unscented Clumping Clay Cat Litter, 40-lb bag",
                "code": "d-D-LsyU",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 910
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1020
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1140
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Scoop Away",
                "image": "litter/litter9",
                "description": "Complete Performance Fresh Scented Clumping Clay Cat Litter, 10.5-lb bag, pack of 4",
                "code": "d-Scp-Wy",
                "sizes": [
                    {
                        "name": "regular",
                        "code": "RG",
                        "price": 1160
                    },
                    {
                        "name": "medium",
                        "code": "MD",
                        "price": 1210
                    },
                    {
                        "name": "large",
                        "code": "LG",
                        "price": 1320
                    }
                ]
            }
        ]
    },
    {
        "category": "Toys",
        "image": "toy/toys",
        "contents": [
            {
                "isAvailable": true,
                "name": "Catstages Chew Toy",
                "code": "e-CtstgsChw",
                "image": "toy/toys1",
                "description": "Fresh Breath Mint Stick Cat Chew Toy",
                "price": 160
            },
            {
                "isAvailable": true,
                "name": "SmartyKat",
                "code": "e-SmrtyKt",
                "image": "toy/toys2",
                "description": "Scratch N Spin Replacement Wand Cat Toy",
                "price": 1090
            },
            {
                "isAvailable": true,
                "name": "Catstages Tower",
                "code": "e-CtstgsTwr",
                "image": "toy/toys3",
                "description": "Tower of Tracks Cat Toy",
                "price": 510
            },
            {
                "isAvailable": false,
                "name": "KONG",
                "code": "e-Kng",
                "image": "toy/toys4",
                "description": "",
                "price": 340
            },
            {
                "isAvailable": true,
                "name": "Frisco Spring",
                "code": "e-Frsc-Sprng",
                "image": "toy/toys5",
                "description": "Colorful Springs Cat Toy, 10 count",
                "price": 210
            },
            {
                "isAvailable": true,
                "name": "Turbo",
                "code": "e-Trb",
                "image": "toy/toys6",
                "description": "Lattice Ball Cat Toy",
                "price": 110
            },
            {
                "isAvailable": true,
                "name": "Yeowww!",
                "code": "e-Ywww",
                "image": "toy/toys7",
                "description": "Catnip Yellow Banana Cat Toy",
                "price": 700
            },
            {
                "isAvailable": true,
                "name": "Frisco Squirrel Plush",
                "code": "e-Frsc-Sqrrl",
                "image": "toy/toys8",
                "description": "Squirrel Plush Cat Toy with Refillable Catnip, Brown Squirrel",
                "price": 280
            },  
            {
                "isAvailable": true,
                "name": "Ethical Pet",
                "code": "e-Thcl-Pt",
                "image": "toy/toys9",
                "description": "Laser Exerciser Original 2 in 1 Dog & Cat Toy",
                "price": 540
            }
        ]
    }
]