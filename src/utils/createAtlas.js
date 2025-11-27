export default function createAtlas(scene) {
    //INDICES ATLAS ---------------------------------------------------------
    scene.ingredientsAtlas = {
        //POLLO ---------
        rawChicken_0: { index: 28, next: { grill: "grilledChicken_0", table: "slicedChicken_0" } },
        grilledChicken_0: { index: 29, next: { grill: "grilledChicken_1" } },
        grilledChicken_1: { index: 30, next: { grill: "grilledChicken_2" } },
        grilledChicken_2: { index: 31, next: { grill: "burnedChicken_0" } },
        burnedChicken_0: { index: 32, next: { brazier: "carbon_1" } },
        slicedChicken_0: { index: 36, next: { table: "choppedChicken_0" }, fusion: { gratedBread_0: "chickenMila_0" } },
        choppedChicken_0: { index: 35, fusion: { empanadaLid_0: "chickenEmpanada_0" } },

        //MILANESAS --------------
        chickenMila_0: { index: 37, next: { frier: "chickenMila_1" } },
        chickenMila_1: { index: 38, next: { frier: "burnedChickenMila" }, fusion: { choppedBread_0: "breadChickenMila_0", chicoryBread_0: "chickenMilaSandwich_0" } },
        burnedChickenMila: { index: 39, next: { brazier: "carbon_1" } },
        beefMila_0: { index: 7, next: { frier: "beefMila_1" } },
        beefMila_1: { index: 8, next: { frier: "burnedBeefMila" }, fusion: { choppedBread_0: "breadBeefMila_0", chicoryBread_0: "beefMilaSandwich_0" } },
        burnedBeefMila: { index: 9, next: { brazier: "carbon_1" } },
        chickenMilaSandwich_0: { index: 41 },
        beefMilaSandwich_0: { index: 11 },
        breadBeefMila_0: { index: 10, fusion: { choppedChicory_0: "beefMilaSandwich_0" } },
        breadChickenMila_0: { index: 40, fusion: { choppedChicory_0: "chickenMilaSandwich_0" } },

        //LOMO ---------------
        rawLoin_0: { index: 21, next: { grill: "loin_0" } },
        loin_0: { index: 22, next: { grill: "loin_1" } },
        loin_1: { index: 23, next: { grill: "loin_2" } },
        loin_2: { index: 24, next: { grill: "burnedLoin", table: "choppedLoin" } },
        burnedLoin: { index: 25, next: { brazier: "carbon_1" } },
        choppedLoin: { index: 26, fusion: { empanadaLid_0: "meatEmpanada_0" } },

        //EMPANADAS -------------
        empanadaLid_0: { index: 56, fusion: { asadoPicado: "meatEmpanada_0", choppedChicken_0: "chickenEmpanada_0" } },
        chickenEmpanada_0: { index: 57, next: { table: "chickenEmpanada_1" } },
        chickenEmpanada_1: { index: 59, next: { frier: "chickenEmpanada_2" } },
        chickenEmpanada_2: { index: 61, next: { frier: "burnedChickenEmpanda" } },
        burnedChickenEmpanda: { index: 33, next: { brazier: "carbon_1" } },
        meatEmpanada_0: { index: 58, next: { table: "meatEmpanada_1" } },
        meatEmpanada_1: { index: 60, next: { frier: "meatEmpanada_2" } },
        meatEmpanada_2: { index: 62, next: { frier: "burnedMeatEmpanada" } },
        burnedMeatEmpanada: { index: 34, next: { brazier: "carbon_1" } },

        //ACHICORIA ----------
        rawChicory_0: { index: 0, next: { table: "choppedChicory_0" } },
        choppedChicory_0: { index: 1, fusion: { choppedBread_0: "chicoryBread_0", breadChickenMila_0: "chickenMilaSandwich_0" } },

        //PAN --------------
        rawBread_0: { index: 3, next: { table: "choppedBread_0" } },
        choppedBread_0: { index: 4, next: { table: "gratedBread_0" }, fusion: { choppedChicory_0: "chicoryBread_0", chorizo_2: "breadChorizo_0", beef_2: "panBife_2", beefMila_1: "breadBeefMila_0", chickenMila_1: "breadChickenMila_0" } },
        chicoryBread_0: { index: 6, fusion: { chickenMila_1: "chickenMilaSandwich_0", beefMila_1: "sanMilaCarme_0", beef_2: "beefSandwich_0", chorizo_2: "pancho" } },
        gratedBread_0: { index: 5, fusion: { slicedChicken_0: "chickenMila_0", rawBeef_0: "beefMila_0" } },

        //CARBON -----------
        coal_0: { index: 2, next: { brazier: "carbon_1" } },
        carbon_1: { index: 12 },

        //PAPAS --------------
        rawPotato_0: { index: 49, next: { table: "choppedPotato_0", grill: "grilledPotato_0" } },
        choppedPotato_0: { index: 50, next: { frier: "choppedPotato_1" } },
        choppedPotato_1: { index: 51, next: { frier: "burnedChoppedPotato" } },
        burnedChoppedPotato: { index: 53, next: { brazier: "carbon_1" } },
        grilledPotato_0: { index: 52, next: { grill: "burnedGrilledPotato" } },
        burnedGrilledPotato: { index: 54, next: { brazier: "carbon_1" } },

        //Chorizo
        rawChorizo_0: { index: 42, next: { grill: "chorizo_0" } },
        chorizo_0: { index: 43, next: { grill: "chorizo_1" } },
        chorizo_1: { index: 44, next: { grill: "chorizo_2" } },
        chorizo_2: { index: 45, next: { grill: "burnedChorizo" }, fusion: { choppedBread_0: "breadChorizo_0", chicoryBread_0: "pancho" } },
        burnedChorizo: { index: 46, next: { brazier: "carbon_1" } },
        breadChorizo_0: { index: 47, fusion: { choppedChicory_0: "pancho" } },
        pancho: { index: 48 },

        //Bifes
        rawBeef_0: { index: 14, next: { grill: "beef_0" }, fusion: { gratedBread_0: "beefMila_0" } },
        beef_0: { index: 15, next: { grill: "beef_1" } },
        beef_1: { index: 16, next: { grill: "beef_2" } },
        beef_2: { index: 17, next: { grill: "burnedBeef" }, fusion: { choppedBread_0: "breadBeef_0", chicoryBread_0: "beefSandwich_0" } },
        burnedBeef: { index: 18, next: { brazier: "carbon_1" } },
        breadBeef_0: { index: 19, fusion: { choppedChicory_0: "beefSandwich_0" } },
        beefSandwich_0: { index: 20 },

    } //index: numero de aparicion en atlas

    scene.devicesAtlas = {
        table: {
            accepts: { //si se lo puede depositar en esta maquina o no
                //POLLO ---------
                rawChicken_0: true,
                grilledChicken_0: true,
                grilledChicken_1: true,
                grilledChicken_2: true,
                burnedChicken_0: true,
                slicedChicken_0: true,
                choppedChicken_0: true,

                //MILANESAS --------------
                chickenMila_0: true,
                chickenMila_1: true,
                burnedChickenMila: true,
                chickenMilaSandwich_0: true,
                breadChickenMila_0: true,
                beefMila_0: true,
                beefMila_1: true,
                burnedBeefMila: true,
                beefMilaSandwich_0: true,
                breadBeefMila_0: true,

                //LOMO ------------
                rawLoin_0: true,
                loin_0: true,
                loin_1: true,
                loin_2: true,
                burnedLoin: true,
                choppedLoin: true,

                //EMPANADAS --------------
                empanadaLid_0: true,
                chickenEmpanada_0: true,
                chickenEmpanada_1: true,
                chickenEmpanada_2: true,
                burnedChickenEmpanda: true,
                meatEmpanada_0: true,
                meatEmpanada_1: true,
                meatEmpanada_2: true,
                burnedMeatEmpanada: true,

                //ACHICORIA ----------
                rawChicory_0: true,
                choppedChicory_0: true,

                //PAN --------------
                rawBread_0: true,
                choppedBread_0: true,
                chicoryBread_0: true,
                gratedBread_0: true,

                //CARBON -----------
                coal_0: true,

                //PAPAS --------------
                rawPotato_0: true,
                choppedPotato_0: true,
                choppedPotato_1: true,
                burnedChoppedPotato: true,
                grilledPotato_0: true,
                burnedGrilledPotato: true,

                //CHORIZO -------------
                rawChorizo_0: true,
                chorizo_0: true,
                chorizo_1: true,
                chorizo_2: true,
                burnedChorizo: true,
                breadChorizo_0: true,
                pancho: true,

                //BIFES --------------
                rawBeef_0: true,
                beef_0: true,
                beef_1: true,
                beef_2: true,
                burnedBeef: true,
                breadBeef_0: true,
                beefSandwich_0: true,

            }
        },
        grill: {
            accepts: { //si se lo puede depositar en esta maquina o no
                rawChicken_0: true,
                grilledChicken_0: true,
                grilledChicken_1: true,
                grilledChicken_2: true,
                burnedChicken_0: true,

                rawPotato_0: true,
                grilledPotato_0: true,
                burnedGrilledPotato: true,

                rawBeef_0: true,
                beef_0: true,
                beef_1: true,
                beef_2: true,
                burnedBeef: true,

                rawChorizo_0: true,
                chorizo_0: true,
                chorizo_1: true,
                chorizo_2: true,
                burnedChorizo: true,

                rawLoin_0: true,
                loin_0: true,
                loin_1: true,
                loin_2: true,
                burnedLoin: true,
            }
        },
        frier: {
            accepts: { //si se lo puede depositar en esta maquina o no
                chickenMila_0: true,
                chickenMila_1: true,
                burnedChickenMila: true,

                beefMila_0: true,
                beefMila_1: true,
                burnedBeefMila: true,

                choppedPotato_0: true,
                choppedPotato_1: true,
                burnedChoppedPotato: true,

                chickenEmpanada_1: true,
                chickenEmpanada_2: true,
                burnedChickenEmpanda: true,
                meatEmpanada_1: true,
                meatEmpanada_2: true,
                burnedMeatEmpanada: true,
            }
        },
        brazier: {
            accepts: { //si se lo puede depositar en esta maquina o no

                coal_0: true,
                burnedChicken_0: true,
                burnedChickenMila: true,
                burnedBeefMila: true,
                burnedLoin: true,
                burnedChickenEmpanda: true,
                burnedMeatEmpanada: true,
                burnedChoppedPotato: true,
                burnedGrilledPotato: true,
                burnedBeef: true,
                burnedChorizo: true,

            }
        },
    }
}