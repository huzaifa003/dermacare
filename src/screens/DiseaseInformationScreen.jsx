import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Searchbar, Card, Button, Text, Divider } from 'react-native-paper';


import DiseaseInformation from "../components/Patient/DiseaseInformation";
import GeneralHeader from '../components/GeneralHeader';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dummyDiseases = [
    { id: 1, name: 'Diabetes', image: 'https://example.com/diabetes.jpg' },
    { id: 2, name: 'Hypertension', image: 'https://example.com/hypertension.jpg' },
    { id: 3, name: 'Common Cold', image: 'https://example.com/commoncold.jpg' }
];

// import image from "../../assets/SameFileFitz/acanthosis nigricans/disease.jpg"
// import image from "../../assets/SameFileFitz/acne/disease.jpg"
// import image from "../../assets/SameFileFitz/acne vulgaris/disease.jpg"
// import image from "../../assets/SameFileFitz/acquired autoimmune bullous diseaseherpes gestationis/disease.jpg"
// import image from "../../assets/SameFileFitz/acrodermatitis enteropathica/disease.jpg"
// import image from "../../assets/SameFileFitz/actinic keratosis/disease.jpg"
// import image from "../../assets/SameFileFitz/allergic contact dermatitis/disease.jpg"
// import image from "../../assets/SameFileFitz/aplasia cutis/disease.jpg"
// import image from "../../assets/SameFileFitz/basal cell carcinoma/disease.jpg"
// import image from "../../assets/SameFileFitz/basal cell carcinoma morpheiform/disease.jpg"
// import image from "../../assets/SameFileFitz/becker nevus/disease.jpg"
// import image from "../../assets/SameFileFitz/behcets disease/disease.jpg"
// import image from "../../assets/SameFileFitz/calcinosis cutis/disease.jpg"
// import image from "../../assets/SameFileFitz/cheilitis/disease.jpg"
// import image from "../../assets/SameFileFitz/congenital nevus/disease.jpg"
// import image from "../../assets/SameFileFitz/dariers disease/disease.jpg"
// import image from "../../assets/SameFileFitz/dermatofibroma/disease.jpg"
// import image from "../../assets/SameFileFitz/dermatomyositis/disease.jpg"
// import image from "../../assets/SameFileFitz/disseminated actinic porokeratosis/disease.jpg"
// import image from "../../assets/SameFileFitz/drug eruption/disease.jpg"
// import image from "../../assets/SameFileFitz/drug induced pigmentary changes/disease.jpg"
// import image from "../../assets/SameFileFitz/dyshidrotic eczema/disease.jpg"
// import image from "../../assets/SameFileFitz/eczema/disease.jpg"
// import image from "../../assets/SameFileFitz/ehlers danlos syndrome/disease.jpg"
// import image from "../../assets/SameFileFitz/epidermal nevus/disease.jpg"
// import image from "../../assets/SameFileFitz/epidermolysis bullosa/disease.jpg"
// import image from "../../assets/SameFileFitz/erythema annulare centrifigum/disease.jpg"
// import image from "../../assets/SameFileFitz/erythema elevatum diutinum/disease.jpg"
// import image from "../../assets/SameFileFitz/erythema multiforme/disease.jpg"
// import image from "../../assets/SameFileFitz/erythema nodosum/disease.jpg"
// import image from "../../assets/SameFileFitz/factitial dermatitis/disease.jpg"
// import image from "../../assets/SameFileFitz/fixed eruptions/disease.jpg"
// import image from "../../assets/SameFileFitz/folliculitis/disease.jpg"
// import image from "../../assets/SameFileFitz/fordyce spots/disease.jpg"
// import image from "../../assets/SameFileFitz/granuloma annulare/disease.jpg"
// import image from "../../assets/SameFileFitz/granuloma pyogenic/disease.jpg"
// import image from "../../assets/SameFileFitz/hailey hailey disease/disease.jpg"
// import image from "../../assets/SameFileFitz/halo nevus/disease.jpg"
// import image from "../../assets/SameFileFitz/hidradenitis/disease.jpg"
// import image from "../../assets/SameFileFitz/ichthyosis vulgaris/disease.jpg"
// import image from "../../assets/SameFileFitz/incontinentia pigmenti/disease.jpg"
// import image from "../../assets/SameFileFitz/juvenile xanthogranuloma/disease.jpg"
// import image from "../../assets/SameFileFitz/kaposi sarcoma/disease.jpg"
// import image from "../../assets/SameFileFitz/keloid/disease.jpg"
// import image from "../../assets/SameFileFitz/keratosis pilaris/disease.jpg"
// import image from "../../assets/SameFileFitz/langerhans cell histiocytosis/disease.jpg"
// import image from "../../assets/SameFileFitz/lentigo maligna/disease.jpg"
// import image from "../../assets/SameFileFitz/lichen amyloidosis/disease.jpg"
// import image from "../../assets/SameFileFitz/lichen planus/disease.jpg"
// import image from "../../assets/SameFileFitz/lichen simplex/disease.jpg"
// import image from "../../assets/SameFileFitz/livedo reticularis/disease.jpg"
// import image from "../../assets/SameFileFitz/lupus erythematosus/disease.jpg"
// import image from "../../assets/SameFileFitz/lupus subacute/disease.jpg"
// import image from "../../assets/SameFileFitz/lyme disease/disease.jpg"
// import image from "../../assets/SameFileFitz/lymphangioma/disease.jpg"
// import image from "../../assets/SameFileFitz/malignant melanoma/disease.jpg"
// import image from "../../assets/SameFileFitz/melanoma/disease.jpg"
// import image from "../../assets/SameFileFitz/milia/disease.jpg"
// import image from "../../assets/SameFileFitz/mucinosis/disease.jpg"
// import image from "../../assets/SameFileFitz/mucous cyst/disease.jpg"
// import image from "../../assets/SameFileFitz/mycosis fungoides/disease.jpg"
// import image from "../../assets/SameFileFitz/myiasis/disease.jpg"
// import image from "../../assets/SameFileFitz/naevus comedonicus/disease.jpg"
// import image from "../../assets/SameFileFitz/necrobiosis lipoidica/disease.jpg"
// import image from "../../assets/SameFileFitz/nematode infection/disease.jpg"
// import image from "../../assets/SameFileFitz/neurodermatitis/disease.jpg"
// import image from "../../assets/SameFileFitz/neurofibromatosis/disease.jpg"
// import image from "../../assets/SameFileFitz/neurotic excoriations/disease.jpg"
// import image from "../../assets/SameFileFitz/neutrophilic dermatoses/disease.jpg"
// import image from "../../assets/SameFileFitz/nevocytic nevus/disease.jpg"
// import image from "../../assets/SameFileFitz/nevus sebaceous of jadassohn/disease.jpg"
// import image from "../../assets/SameFileFitz/papilomatosis confluentes and reticulate/disease.jpg"
// import image from "../../assets/SameFileFitz/paronychia/disease.jpg"
// import image from "../../assets/SameFileFitz/pediculosis lids/disease.jpg"
// import image from "../../assets/SameFileFitz/perioral dermatitis/disease.jpg"
// import image from "../../assets/SameFileFitz/photodermatoses/disease.jpg"
// import image from "../../assets/SameFileFitz/pilar cyst/disease.jpg"
// import image from "../../assets/SameFileFitz/pilomatricoma/disease.jpg"
// import image from "../../assets/SameFileFitz/pityriasis lichenoides chronica/disease.jpg"
// import image from "../../assets/SameFileFitz/pityriasis rosea/disease.jpg"
// import image from "../../assets/SameFileFitz/pityriasis rubra pilaris/disease.jpg"
// import image from "../../assets/SameFileFitz/porokeratosis actinic/disease.jpg"
// import image from "../../assets/SameFileFitz/porokeratosis of mibelli/disease.jpg"
// import image from "../../assets/SameFileFitz/porphyria/disease.jpg"
// import image from "../../assets/SameFileFitz/port wine stain/disease.jpg"
// import image from "../../assets/SameFileFitz/prurigo nodularis/disease.jpg"
// import image from "../../assets/SameFileFitz/psoriasis/disease.jpg"
// import image from "../../assets/SameFileFitz/pustular psoriasis/disease.jpg"
// import image from "../../assets/SameFileFitz/pyogenic granuloma/disease.jpg"
// import image from "../../assets/SameFileFitz/rhinophyma/disease.jpg"
// import image from "../../assets/SameFileFitz/rosacea/disease.jpg"
// import image from "../../assets/SameFileFitz/sarcoidosis/disease.jpg"
// import image from "../../assets/SameFileFitz/scabies/disease.jpg"
// import image from "../../assets/SameFileFitz/scleroderma/disease.jpg"
// import image from "../../assets/SameFileFitz/scleromyxedema/disease.jpg"
// import image from "../../assets/SameFileFitz/seborrheic dermatitis/disease.jpg"
// import image from "../../assets/SameFileFitz/seborrheic keratosis/disease.jpg"
// import image from "../../assets/SameFileFitz/solid cystic basal cell carcinoma/disease.jpg"
// import image from "../../assets/SameFileFitz/squamous cell carcinoma/disease.jpg"
// import image from "../../assets/SameFileFitz/stasis edema/disease.jpg"
// import image from "../../assets/SameFileFitz/stevens johnson syndrome/disease.jpg"
// import image from "../../assets/SameFileFitz/striae/disease.jpg"
// import image from "../../assets/SameFileFitz/sun damaged skin/disease.jpg"
// import image from "../../assets/SameFileFitz/superficial spreading melanoma ssm/disease.jpg"
// import image from "../../assets/SameFileFitz/syringoma/disease.jpg"
// import image from "../../assets/SameFileFitz/telangiectases/disease.jpg"
// import image from "../../assets/SameFileFitz/tick bite/disease.jpg"
// import image from "../../assets/SameFileFitz/tuberous sclerosis/disease.jpg"
// import image from "../../assets/SameFileFitz/tungiasis/disease.jpg"
// import image from "../../assets/SameFileFitz/urticaria/disease.jpg"
// import image from "../../assets/SameFileFitz/urticaria pigmentosa/disease.jpg"
// import image from "../../assets/SameFileFitz/vitiligo/disease.jpg"
// import image from "../../assets/SameFileFitz/xanthomas/disease.jpg"
// import image from "../../assets/SameFileFitz/xeroderma pigmentosum/disease.jpg"

const dermatologicalConditions = [
    "acanthosis nigricans",
    "acne",
    "acne vulgaris",
    "acquired autoimmune bullous diseaseherpes gestationis",
    "acrodermatitis enteropathica",
    "actinic keratosis",
    "allergic contact dermatitis",
    "aplasia cutis",
    "basal cell carcinoma",
    "basal cell carcinoma morpheiform",
    "becker nevus",
    "behcets disease",
    "calcinosis cutis",
    "cheilitis",
    "congenital nevus",
    "dariers disease",
    "dermatofibroma",
    "dermatomyositis",
    "disseminated actinic porokeratosis",
    "drug eruption",
    "drug induced pigmentary changes",
    "dyshidrotic eczema",
    "eczema",
    "ehlers danlos syndrome",
    "epidermal nevus",
    "epidermolysis bullosa",
    "erythema annulare centrifigum",
    "erythema elevatum diutinum",
    "erythema multiforme",
    "erythema nodosum",
    "factitial dermatitis",
    "fixed eruptions",
    "folliculitis",
    "fordyce spots",
    "granuloma annulare",
    "granuloma pyogenic",
    "hailey hailey disease",
    "halo nevus",
    "hidradenitis",
    "ichthyosis vulgaris",
    "incontinentia pigmenti",
    "juvenile xanthogranuloma",
    "kaposi sarcoma",
    "keloid",
    "keratosis pilaris",
    "langerhans cell histiocytosis",
    "lentigo maligna",
    "lichen amyloidosis",
    "lichen planus",
    "lichen simplex",
    "livedo reticularis",
    "lupus erythematosus",
    "lupus subacute",
    "lyme disease",
    "lymphangioma",
    "malignant melanoma",
    "melanoma",
    "milia",
    "mucinosis",
    "mucous cyst",
    "mycosis fungoides",
    "myiasis",
    "naevus comedonicus",
    "necrobiosis lipoidica",
    "nematode infection",
    "neurodermatitis",
    "neurofibromatosis",
    "neurotic excoriations",
    "neutrophilic dermatoses",
    "nevocytic nevus",
    "nevus sebaceous of jadassohn",
    "papilomatosis confluentes and reticulate",
    "paronychia",
    "pediculosis lids",
    "perioral dermatitis",
    "photodermatoses",
    "pilar cyst",
    "pilomatricoma",
    "pityriasis lichenoides chronica",
    "pityriasis rosea",
    "pityriasis rubra pilaris",
    "porokeratosis actinic",
    "porokeratosis of mibelli",
    "porphyria",
    "port wine stain",
    "prurigo nodularis",
    "psoriasis",
    "pustular psoriasis",
    "pyogenic granuloma",
    "rhinophyma",
    "rosacea",
    "sarcoidosis",
    "scabies",
    "scleroderma",
    "scleromyxedema",
    "seborrheic dermatitis",
    "seborrheic keratosis",
    "solid cystic basal cell carcinoma",
    "squamous cell carcinoma",
    "stasis edema",
    "stevens johnson syndrome",
    "striae",
    "sun damaged skin",
    "superficial spreading melanoma ssm",
    "syringoma",
    "telangiectases",
    "tick bite",
    "tuberous sclerosis",
    "tungiasis",
    "urticaria",
    "urticaria pigmentosa",
    "vitiligo",
    "xanthomas",
    "xeroderma pigmentosum",
];


const dermatologicalConditionsImages = [
    require("../../assets/SameFileFitz/acanthosis nigricans/disease.jpg"),
    require("../../assets/SameFileFitz/acne/disease.jpg"),
    require("../../assets/SameFileFitz/acne vulgaris/disease.jpg"),
    require("../../assets/SameFileFitz/acquired autoimmune bullous diseaseherpes gestationis/disease.jpg"),
    require("../../assets/SameFileFitz/acrodermatitis enteropathica/disease.jpg"),
    require("../../assets/SameFileFitz/actinic keratosis/disease.jpg"),
    require("../../assets/SameFileFitz/allergic contact dermatitis/disease.jpg"),
    require("../../assets/SameFileFitz/aplasia cutis/disease.jpg"),
    require("../../assets/SameFileFitz/basal cell carcinoma/disease.jpg"),
    require("../../assets/SameFileFitz/basal cell carcinoma morpheiform/disease.jpg"),
    require("../../assets/SameFileFitz/becker nevus/disease.jpg"),
    require("../../assets/SameFileFitz/behcets disease/disease.jpg"),
    require("../../assets/SameFileFitz/calcinosis cutis/disease.jpg"),
    require("../../assets/SameFileFitz/cheilitis/disease.jpg"),
    require("../../assets/SameFileFitz/congenital nevus/disease.jpg"),
    require("../../assets/SameFileFitz/dariers disease/disease.jpg"),
    require("../../assets/SameFileFitz/dermatofibroma/disease.jpg"),
    require("../../assets/SameFileFitz/dermatomyositis/disease.jpg"),
    require("../../assets/SameFileFitz/disseminated actinic porokeratosis/disease.jpg"),
    require("../../assets/SameFileFitz/drug eruption/disease.jpg"),
    require("../../assets/SameFileFitz/drug induced pigmentary changes/disease.jpg"),
    require("../../assets/SameFileFitz/dyshidrotic eczema/disease.jpg"),
    require("../../assets/SameFileFitz/eczema/disease.jpg"),
    require("../../assets/SameFileFitz/ehlers danlos syndrome/disease.jpg"),
    require("../../assets/SameFileFitz/epidermal nevus/disease.jpg"),
    require("../../assets/SameFileFitz/epidermolysis bullosa/disease.jpg"),
    require("../../assets/SameFileFitz/erythema annulare centrifigum/disease.jpg"),
    require("../../assets/SameFileFitz/erythema elevatum diutinum/disease.jpg"),
    require("../../assets/SameFileFitz/erythema multiforme/disease.jpg"),
    require("../../assets/SameFileFitz/erythema nodosum/disease.jpg"),
    require("../../assets/SameFileFitz/factitial dermatitis/disease.jpg"),
    require("../../assets/SameFileFitz/fixed eruptions/disease.jpg"),
    require("../../assets/SameFileFitz/folliculitis/disease.jpg"),
    require("../../assets/SameFileFitz/fordyce spots/disease.jpg"),
    require("../../assets/SameFileFitz/granuloma annulare/disease.jpg"),
    require("../../assets/SameFileFitz/granuloma pyogenic/disease.jpg"),
    require("../../assets/SameFileFitz/hailey hailey disease/disease.jpg"),
    require("../../assets/SameFileFitz/halo nevus/disease.jpg"),
    require("../../assets/SameFileFitz/hidradenitis/disease.jpg"),
    require("../../assets/SameFileFitz/ichthyosis vulgaris/disease.jpg"),
    require("../../assets/SameFileFitz/incontinentia pigmenti/disease.jpg"),
    require("../../assets/SameFileFitz/juvenile xanthogranuloma/disease.jpg"),
    require("../../assets/SameFileFitz/kaposi sarcoma/disease.jpg"),
    require("../../assets/SameFileFitz/keloid/disease.jpg"),
    require("../../assets/SameFileFitz/keratosis pilaris/disease.jpg"),
    require("../../assets/SameFileFitz/langerhans cell histiocytosis/disease.jpg"),
    require("../../assets/SameFileFitz/lentigo maligna/disease.jpg"),
    require("../../assets/SameFileFitz/lichen amyloidosis/disease.jpg"),
    require("../../assets/SameFileFitz/lichen planus/disease.jpg"),
    require("../../assets/SameFileFitz/lichen simplex/disease.jpg"),
    require("../../assets/SameFileFitz/livedo reticularis/disease.jpg"),
    require("../../assets/SameFileFitz/lupus erythematosus/disease.jpg"),
    require("../../assets/SameFileFitz/lupus subacute/disease.jpg"),
    require("../../assets/SameFileFitz/lyme disease/disease.jpg"),
    require("../../assets/SameFileFitz/lymphangioma/disease.jpg"),
    require("../../assets/SameFileFitz/malignant melanoma/disease.jpg"),
    require("../../assets/SameFileFitz/melanoma/disease.jpg"),
    require("../../assets/SameFileFitz/milia/disease.jpg"),
    require("../../assets/SameFileFitz/mucinosis/disease.jpg"),
    require("../../assets/SameFileFitz/mucous cyst/disease.jpg"),
    require("../../assets/SameFileFitz/mycosis fungoides/disease.jpg"),
    require("../../assets/SameFileFitz/myiasis/disease.jpg"),
    require("../../assets/SameFileFitz/naevus comedonicus/disease.jpg"),
    require("../../assets/SameFileFitz/necrobiosis lipoidica/disease.jpg"),
    require("../../assets/SameFileFitz/nematode infection/disease.jpg"),
    require("../../assets/SameFileFitz/neurodermatitis/disease.jpg"),
    require("../../assets/SameFileFitz/neurofibromatosis/disease.jpg"),
    require("../../assets/SameFileFitz/neurotic excoriations/disease.jpg"),
    require("../../assets/SameFileFitz/neutrophilic dermatoses/disease.jpg"),
    require("../../assets/SameFileFitz/nevocytic nevus/disease.jpg"),
    require("../../assets/SameFileFitz/nevus sebaceous of jadassohn/disease.jpg"),
    require("../../assets/SameFileFitz/papilomatosis confluentes and reticulate/disease.jpg"),
    require("../../assets/SameFileFitz/paronychia/disease.jpg"),
    require("../../assets/SameFileFitz/pediculosis lids/disease.jpg"),
    require("../../assets/SameFileFitz/perioral dermatitis/disease.jpg"),
    require("../../assets/SameFileFitz/photodermatoses/disease.jpg"),
    require("../../assets/SameFileFitz/pilar cyst/disease.jpg"),
    require("../../assets/SameFileFitz/pilomatricoma/disease.jpg"),
    require("../../assets/SameFileFitz/pityriasis lichenoides chronica/disease.jpg"),
    require("../../assets/SameFileFitz/pityriasis rosea/disease.jpg"),
    require("../../assets/SameFileFitz/pityriasis rubra pilaris/disease.jpg"),
    require("../../assets/SameFileFitz/porokeratosis actinic/disease.jpg"),
    require("../../assets/SameFileFitz/porokeratosis of mibelli/disease.jpg"),
    require("../../assets/SameFileFitz/porphyria/disease.jpg"),
    require("../../assets/SameFileFitz/port wine stain/disease.jpg"),
    require("../../assets/SameFileFitz/prurigo nodularis/disease.jpg"),
    require("../../assets/SameFileFitz/psoriasis/disease.jpg"),
    require("../../assets/SameFileFitz/pustular psoriasis/disease.jpg"),
    require("../../assets/SameFileFitz/pyogenic granuloma/disease.jpg"),
    require("../../assets/SameFileFitz/rhinophyma/disease.jpg"),
    require("../../assets/SameFileFitz/rosacea/disease.jpg"),
    require("../../assets/SameFileFitz/sarcoidosis/disease.jpg"),
    require("../../assets/SameFileFitz/scabies/disease.jpg"),
    require("../../assets/SameFileFitz/scleroderma/disease.jpg"),
    require("../../assets/SameFileFitz/scleromyxedema/disease.jpg"),
    require("../../assets/SameFileFitz/seborrheic dermatitis/disease.jpg"),
    require("../../assets/SameFileFitz/seborrheic keratosis/disease.jpg"),
    require("../../assets/SameFileFitz/solid cystic basal cell carcinoma/disease.jpg"),
    require("../../assets/SameFileFitz/squamous cell carcinoma/disease.jpg"),
    require("../../assets/SameFileFitz/stasis edema/disease.jpg"),
    require("../../assets/SameFileFitz/stevens johnson syndrome/disease.jpg"),
    require("../../assets/SameFileFitz/striae/disease.jpg"),
    require("../../assets/SameFileFitz/sun damaged skin/disease.jpg"),
    require("../../assets/SameFileFitz/superficial spreading melanoma ssm/disease.jpg"),
    require("../../assets/SameFileFitz/syringoma/disease.jpg"),
    require("../../assets/SameFileFitz/telangiectases/disease.jpg"),
    require("../../assets/SameFileFitz/tick bite/disease.jpg"),
    require("../../assets/SameFileFitz/tuberous sclerosis/disease.jpg"),
    require("../../assets/SameFileFitz/tungiasis/disease.jpg"),
    require("../../assets/SameFileFitz/urticaria/disease.jpg"),
    require("../../assets/SameFileFitz/urticaria pigmentosa/disease.jpg"),
    require("../../assets/SameFileFitz/vitiligo/disease.jpg"),
    require("../../assets/SameFileFitz/xanthomas/disease.jpg"),
    require("../../assets/SameFileFitz/xeroderma pigmentosum/disease.jpg"),
];



const xyz = "../../assets/SameFileFitz/xeroderma pigmentosum/disease.jpg";
const DiseaseInformationScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        console.log("DiseaseInformationScreen mounted");
        dermatologicalConditions.forEach(disease => {
            console.log(disease);
        }
        );

    }
        , []);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDiseases, setFilteredDiseases] = useState(dermatologicalConditions);

    const onChangeSearch = query => {
        setSearchQuery(query);
        if (query) {
            const filtered = dermatologicalConditions.filter(disease => disease.toLowerCase().includes(query.toLowerCase()));
            setFilteredDiseases(filtered);
        } else {
            setFilteredDiseases(dermatologicalConditions);
        }
    };





    return (
        <>
            <GeneralHeader title="Disease Information" />
            <View style={{ flex: 1 }}>
                {/* <GeneralHeader title="Disease Information" /> */}
                <Searchbar
                    mode='view'
                    placeholder="Search Diseases"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                <Text />
                {filteredDiseases.length === 0 && <Text>No diseases found</Text>}
                <ScrollView style={{ margin: 4, marginHorizontal: 20 }}>
                    {filteredDiseases.map((disease, index) => (
                        <View>

                            <TouchableOpacity onPress={() => navigation.navigate("Visual Search", { "image": dermatologicalConditionsImages[index] })}><DiseaseInformation key={index} disease={disease} image={dermatologicalConditionsImages[index]} /></TouchableOpacity>
                            <Text />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

export default DiseaseInformationScreen;
