var products = [
    {
        "category": "Foods",
        "image": "food/food",
        "contents": [
            {
                "isAvailable": true,
                "name": "Fancy Feast",
                "image": "food/food1",
                "description": "Grilled Seafood Feast, Pack Canned Cat Food",
                "code": "FD Fncy Fst-",
                "sizes": [
                    {
                        "code": "2KG",
                        "price": 500
                    },
                    {
                        "code": "5KG",
                        "price": 700
                    },
                    {
                        "code": "8KG",
                        "price": 900
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Meow Mix",
                "image": "food/food2",
                "description": "Original Choice Dry Cat Food",
                "code": "FD Mw Mx-",
                "sizes": [
                    {
                        "code": "5KG",
                        "price": 850
                    },
                    {
                        "code": "8KG",
                        "price": 950
                    },
                    {
                        "code": "10KG",
                        "price": 1050
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Tiny Tiger",
                "image": "food/food3",
                "description": "Pate Beef & Poultry Recipes Variety Pack Grain-Free Canned Cat Food",
                "code": "FD Tny Tgr-",
                "sizes": [
                    {
                        "code": "5KG",
                        "price": 720
                    },
                    {
                        "code": "8KG",
                        "price": 830
                    },
                    {
                        "code": "10KG",
                        "price": 900
                    }
                ]
            },
            {
                "isAvailable": false,
                "name": "IAms",
                "image": "food/food4",
                "description": "",
                "code": "FD IAms-",
                "sizes": [
                    {
                        "code": "RG",
                        "price": 1560
                    },
                    {
                        "code": "MD",
                        "price": 1670
                    },
                    {
                        "code": "LG",
                        "price": 1790
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Orijen",
                "image": "food/food5",
                "description": "Original Grain-Free Dry Cat Food",
                "code": "FD Orjn-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1550
                    },
                    {
                        "code": "15KG",
                        "price": 1660
                    },
                    {
                        "code": "20KG",
                        "price": 1770
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Blue Buffalo",
                "image": "food/food6",
                "description": "Tastefuls Ocean Fish & Tuna Entrée Pate Wet Cat Food",
                "code": "FD Bl Bffl-",
                "sizes": [
                    {
                        "code": "2CNS",
                        "price": 120
                    },
                    {
                        "code": "3CNS",
                        "price": 240
                    },
                    {
                        "code": "4CNS",
                        "price": 330
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Temptations",
                "image": "food/food7",
                "description": "Tempting Tuna & Chicken Flavor Adult Dry Cat Food",
                "code": "FD Tmpttns-",
                "sizes": [
                    {
                        "code": "2KG",
                        "price": 450
                    },
                    {
                        "code": "5KG",
                        "price": 650
                    },
                    {
                        "code": "8KG",
                        "price": 800
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Purina One",
                "image": "food/food8",
                "description": "+Plus Healthy Kitten Formula Natural Dry Cat Food",
                "code": "FD Prn1-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1490
                    },
                    {
                        "code": "15KG",
                        "price": 1580
                    },
                    {
                        "code": "20KG",
                        "price": 1670
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Sheba",
                "image": "food/food9",
                "description": "Chicken & Salmon Pate Entree Variety Pack Adult Wet Cat Food Trays",
                "code": "FD Shb-",
                "sizes": [
                    {
                        "code": "1KG",
                        "price": 140
                    },
                    {
                        "code": "1.5KG",
                        "price": 260
                    },
                    {
                        "code": "2KG",
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
                "code": "TR FrsksG",
                "image": "treat/treat1",
                "description": "Mix Mixed Grill Crunch Flavor Crunchy Cat Treats, 6-oz bag",
                "price": 250
            },
            {
                "isAvailable": false,
                "name": "Friskies Chicken",
                "code": "TR FrsksC",
                "image": "treat/treat2",
                "description": "",
                "price": 200
            },
            {
                "isAvailable": true,
                "name": "Temptations",
                "code": "TR Tmpttns",
                "image": "treat/treat3",
                "description": "Classic Tasty Chicken Flavor Soft & Crunchy Cat Treats, 16-oz tub",
                "price": 430
            },
            {
                "isAvailable": true,
                "name": "Greenies",
                "code": "TR Grns",
                "image": "treat/treat4",
                "description": "Feline Oven Roasted Chicken Flavor Adult Dental Cat Treats, 4.6-oz bag",
                "price": 300
            },
            {
                "isAvailable": false,
                "name": "Meow Mix",
                "code": "TR Mw Mx",
                "image": "treat/treat5",
                "description": "",
                "price": 70
            },
            {
                "isAvailable": true,
                "name": "Hartz",
                "code": "TR Hrtz",
                "image": "treat/treat6",
                "description": "Delectables Squeeze Up Variety Pack Lickable Cat Treats, 0.5-oz tube, 24 count",
                "price": 760
            },
            {
                "isAvailable": true,
                "name": "Sheba",
                "code": "TR Shb",
                "image": "treat/treat7",
                "description": "Meaty Tender Sticks Chicken Flavor Soft Adult Cat Treats, 5 count",
                "price": 90
            },
            {
                "isAvailable": true,
                "name": "Applaws",
                "code": "TR Applws",
                "image": "treat/treat8",
                "description": "Salmon Grain-Free Freeze-Dried Cat Treats, 1-oz bag",
                "price": 350
            },  
            {
                "isAvailable": true,
                "name": "Fancy Feast",
                "code": "TR Fncy Fst",
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
                "code": "HLT Srst",
                "image": "health/health1",
                "description": "Flea & Tick Collar for Cats, 1 Collar (8-mos. supply)",
                "price": 3390
            },
            {
                "isAvailable": true,
                "name": "Capstar",
                "code": "HLT Cpstr",
                "image": "health/health2",
                "description": "Flea Oral Treatment for Cats, 2-25 lbs, 6 Tablets",
                "price": 1780
            },
            {
                "isAvailable": true,
                "name": "NextStar",
                "code": "HLT NxtStr",
                "image": "health/health3",
                "description": "Fast Acting Cat Flea & Tick Treatment 3 doses",
                "price": 2240
            },
            {
                "isAvailable": true,
                "name": "PetArmor",
                "code": "HLT Ptrmr",
                "image": "health/health4",
                "description": "PetArmor Coconut Berry Scented Flea & Tick Shampoo for Cats, 12-oz bottle",
                "price": 460
            },
            {
                "isAvailable": true,
                "name": "Elanco",
                "code": "HLT Lnc",
                "image": "health/health5",
                "description": "Dewormer for Tapeworms for Cats, 3 count",
                "price": 920
            },
            {
                "isAvailable": true,
                "name": "Fera Pets",
                "code": "HLT Fr Pts",
                "image": "health/health6",
                "description": "USDA Organic Pumpkin Plus Fiber Support for Dogs & Cats, 90 servings",
                "price": 1950
            },
            {
                "isAvailable": true,
                "name": "Zesty Paws",
                "code": "HLT Zsty Pws",
                "image": "health/health7",
                "description": "Digestion Gut Health Chicken Mousse Lickable Squeeze Supplement for Cats, 18 count",
                "price": 1030
            },
            {
                "isAvailable": false,
                "name": "Catstages",
                "code": "HLT Ctstgs",
                "image": "health/health8",
                "description": "",
                "price": 270
            },  
            {
                "isAvailable": true,
                "name": "Vetericyn",
                "code": "HLT Vtrcyn",
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
                "description": "Multi-Cat Extra Strength Scented Clumping Cat Litter",
                "code": "LTR Frsh Stp-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 830
                    },
                    {
                        "code": "12KG",
                        "price": 910
                    },
                    {
                        "code": "15KG",
                        "price": 970
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Pretty Litter",
                "image": "litter/litter2",
                "description": "Health Monitoring Cat Litter",
                "code": "LTR Prtty Lttr-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1200
                    },
                    {
                        "code": "15KG",
                        "price": 1320
                    },
                    {
                        "code": "20KG",
                        "price": 1490
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Arm & Hammer Litter Clump",
                "image": "litter/litter4",
                "description": "Clump & Seal Lightweight Scented Clumping Cat Litter",
                "code": "LTR R&H LttrC-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1100
                    },
                    {
                        "code": "15KG",
                        "price": 1240
                    },
                    {
                        "code": "20KG",
                        "price": 1370
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Dr.Elsey's",
                "image": "litter/litter5",
                "description": "Crystal Attract Long-Hair Crystal Cat Litter",
                "code": "LTR Dr lsy-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 910
                    },
                    {
                        "code": "12KG",
                        "price": 1080
                    },
                    {
                        "code": "15KG",
                        "price": 1190
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Tidy Cats Light",
                "image": "litter/litter5",
                "description": "Free & Clean Lightweight Unscented Clumping Clay Cat Litter",
                "code": "LTR Tdy CtsL-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1230
                    },
                    {
                        "code": "12KG",
                        "price": 1300
                    },
                    {
                        "code": "15KG",
                        "price": 1390
                    }
                ]
            },
            {
                "isAvailable": false,
                "name": "Arm & Hammer Litter Slide",
                "image": "litter/litter6",
                "description": "",
                "code": "LTR R&H LttrS-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1270
                    },
                    {
                        "code": "15KG",
                        "price": 1390
                    },
                    {
                        "code": "20KG",
                        "price": 1520
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Tidy Cats Clean",
                "image": "litter/litter7",
                "description": "Free & Clean Unscented Clumping Clay Cat Litter",
                "code": "LTR Tdy CtsC-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 910
                    },
                    {
                        "code": "12KG",
                        "price": 1010
                    },
                    {
                        "code": "15KG",
                        "price": 1110
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Dr.Elsey's Ultra",
                "image": "litter/litter8",
                "description": "Ultra Unscented Clumping Clay Cat Litter",
                "code": "LTR Dr LsyU-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 910
                    },
                    {
                        "code": "12KG",
                        "price": 1020
                    },
                    {
                        "code": "15KG",
                        "price": 1140
                    }
                ]
            },
            {
                "isAvailable": true,
                "name": "Scoop Away",
                "image": "litter/litter9",
                "description": "Complete Performance Fresh Scented Clumping Clay Cat Litter",
                "code": "LTR Scp Wy-",
                "sizes": [
                    {
                        "code": "10KG",
                        "price": 1160
                    },
                    {
                        "code": "12KG",
                        "price": 1210
                    },
                    {
                        "code": "15KG",
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
                "code": "TY CtstgsChw",
                "image": "toy/toys1",
                "description": "Fresh Breath Mint Stick Cat Chew Toy",
                "price": 160
            },
            {
                "isAvailable": true,
                "name": "SmartyKat",
                "code": "TY SmrtyKt",
                "image": "toy/toys2",
                "description": "Scratch N Spin Replacement Wand Cat Toy",
                "price": 1090
            },
            {
                "isAvailable": true,
                "name": "Catstages Tower",
                "code": "TY CtstgsTwr",
                "image": "toy/toys3",
                "description": "Tower of Tracks Cat Toy",
                "price": 510
            },
            {
                "isAvailable": false,
                "name": "KONG",
                "code": "TY Kng",
                "image": "toy/toys4",
                "description": "",
                "price": 340
            },
            {
                "isAvailable": true,
                "name": "Frisco Spring",
                "code": "TY Frsc Sprng",
                "image": "toy/toys5",
                "description": "Colorful Springs Cat Toy, 10 count",
                "price": 210
            },
            {
                "isAvailable": true,
                "name": "Turbo",
                "code": "TY Trb",
                "image": "toy/toys6",
                "description": "Lattice Ball Cat Toy",
                "price": 110
            },
            {
                "isAvailable": true,
                "name": "Yeowww!",
                "code": "TY Ywww",
                "image": "toy/toys7",
                "description": "Catnip Yellow Banana Cat Toy",
                "price": 700
            },
            {
                "isAvailable": true,
                "name": "Frisco Squirrel Plush",
                "code": "TY Frsc Sqrrl",
                "image": "toy/toys8",
                "description": "Squirrel Plush Cat Toy with Refillable Catnip, Brown Squirrel",
                "price": 280
            },  
            {
                "isAvailable": true,
                "name": "Ethical Pet",
                "code": "TY Thcl Pt",
                "image": "toy/toys9",
                "description": "Laser Exerciser Original 2 in 1 Dog & Cat Toy",
                "price": 540
            }
        ]
    }
]