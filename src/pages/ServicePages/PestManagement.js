import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pest icon using Font Awesome with risk level colors
const createPestIcon = (riskLevel) => {
  const color = riskLevel === 'High' ? '#dc2626' : riskLevel === 'Medium' ? '#d97706' : '#059669';
  return L.divIcon({
    html: `<i class="fa fa-bug" style="font-size: 24px; color: ${color};"></i>`,
    className: 'bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const PestManagement = () => {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [weatherData, setWeatherData] = useState(null);
  const [pestRisks, setPestRisks] = useState([]);
  const [filteredPestRisks, setFilteredPestRisks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('corn');
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [cropFilter, setCropFilter] = useState('all');
  const [pestFilter, setPestFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [riskFactorFilter, setRiskFactorFilter] = useState('all');

  // Comprehensive global crop list with 50 crops
  const globalCrops = [
    'alfalfa', 'almond', 'apple', 'avocado', 'banana', 
    'barley', 'bean', 'blueberry', 'cacao', 'carrot',
    'cassava', 'cherry', 'citrus', 'coffee', 'corn', 
    'cotton', 'cucumber', 'date', 'eggplant', 'ginger',
    'grape', 'kiwi', 'lentil', 'lettuce', 'mango',
    'melon', 'millet', 'oat', 'olive', 'onion',
    'palm', 'papaya', 'pea', 'peanut', 'pepper',
    'potato', 'rice', 'sorghum', 'soybean', 'spinach',
    'squash', 'strawberry', 'sugarcane', 'sunflower', 'sweet potato',
    'tea', 'tomato', 'walnut', 'watermelon', 'wheat'
  ];

  // Comprehensive list of risk factors
  const riskFactors = [
    'High humidity', 'High temperature', 'Drought conditions', 'Continuous monocropping',
    'Early planting', 'Late planting', 'Heavy rainfall', 'Poor drainage',
    'Nearby infested fields', 'Lack of crop rotation', 'Recent mild winter',
    'Sandy soil', 'Clayey soil', 'Plant stress', 'Excessive nitrogen',
    'Wind dispersal', 'Irrigation practices', 'Poor sanitation', 'Improper pruning',
    'Weed pressure', 'Soil compaction', 'Field borders', 'Previous infestation'
  ];

  // Common crops and their associated pests with expanded data
  const cropPests = {
    corn: [
      { 
        name: 'Corn Earworm', 
        scientificName: 'Helicoverpa zea',
        riskFactors: ['High humidity', 'Temperatures above 80°F', 'Late planting', 'Nearby tomato fields'],
        management: 'Monitor with pheromone traps, apply Bt-based insecticides when detected, plant early to avoid peak populations, use resistant varieties',
        description: 'Larvae feed on corn silk and kernels, causing direct damage to the marketable portion of the crop.',
        symptoms: 'Damaged kernels at ear tip, frass (waste) inside ear, larvae feeding on developing kernels'
      },
      { 
        name: 'European Corn Borer', 
        scientificName: 'Ostrinia nubilalis',
        riskFactors: ['Warm nights', 'High humidity', 'Continuous corn planting', 'Crop debris from previous season'],
        management: 'Crop rotation, Bt corn varieties, targeted insecticide application, thorough post-harvest destruction of crop residue',
        description: 'Larvae bore into stalks, weakening plants and causing breakage; they can also feed on ears.',
        symptoms: 'Broken tassels, entry/exit holes in stalks, stalk tunneling, broken stalks, ear dropping'
      },
      { 
        name: 'Corn Rootworm', 
        scientificName: 'Diabrotica spp.',
        riskFactors: ['Continuous corn planting', 'Dry soil conditions', 'Clay soils', 'History of infestation'],
        management: 'Crop rotation, soil insecticides at planting, rootworm resistant varieties, adult beetle monitoring',
        description: 'Larvae feed on roots, reducing uptake of water and nutrients; adult beetles feed on silks and can reduce pollination.',
        symptoms: 'Lodging (leaning) of plants, stunted growth, "goose-necking" growth pattern, pruned roots'
      },
      {
        name: 'Fall Armyworm',
        scientificName: 'Spodoptera frugiperda',
        riskFactors: ['Warm temperatures', 'High humidity', 'Late planted crops', 'Mild winters'],
        management: 'Early planting, Bt corn varieties, targeted foliar insecticides, monitoring with pheromone traps',
        description: 'Highly voracious larvae that can rapidly defoliate plants and cause significant yield loss.',
        symptoms: 'Ragged leaf feeding, window-paning of leaves, frass in whorl, destruction of emerging tassels'
      },
      {
        name: 'Corn Leaf Aphid',
        scientificName: 'Rhopalosiphum maidis',
        riskFactors: ['Drought stress', 'High temperatures', 'Early season stress', 'Excess nitrogen'],
        management: 'Conserve natural enemies, manage irrigation to reduce plant stress, use recommended nitrogen rates',
        description: 'Aphids feed on plant sap and can transmit viral diseases; severe infestations can reduce plant vigor.',
        symptoms: 'Sticky honeydew on leaves, black sooty mold, stunted plants, discolored tassels'
      }
    ],
    wheat: [
      { 
        name: 'Hessian Fly', 
        scientificName: 'Mayetiola destructor',
        riskFactors: ['Early planting', 'Warm fall weather', 'Continuous wheat production', 'No-till practices'],
        management: 'Delayed planting after fly-free date, resistant varieties, crop rotation away from wheat',
        description: 'Larvae feed at the base of wheat plants, weakening stems and reducing yield and quality.',
        symptoms: 'Stunted plants, lodging, heads with fewer kernels, dark green color, thickened stems'
      },
      { 
        name: 'Wheat Stem Sawfly', 
        scientificName: 'Cephus cinctus',
        riskFactors: ['Dry conditions', 'Previous infestation', 'Field edges near grasslands', 'No-till practices'],
        management: 'Solid-stem wheat varieties, early harvest when possible, trap crops, tillage of stubble',
        description: 'Larvae tunnel inside wheat stems, weakening them and causing lodging before harvest.',
        symptoms: 'Lodging near harvest, cut stems with sawdust-like frass, stem discoloration'
      },
      { 
        name: 'Aphids', 
        scientificName: 'Various species',
        riskFactors: ['Mild winters', 'Cool spring', 'Early planting', 'Volunteer wheat'],
        management: 'Natural predator conservation, targeted insecticide application, delayed planting',
        description: 'Multiple aphid species feed on wheat sap and transmit viral diseases like Barley Yellow Dwarf Virus.',
        symptoms: 'Yellowing leaves, stunted growth, honeydew secretions, sooty mold'
      },
      {
        name: 'Wheat Midge',
        scientificName: 'Sitodiplosis mosellana',
        riskFactors: ['Humid conditions during flowering', 'Continuous wheat production', 'Improper timing of planting'],
        management: 'Plant resistant varieties, rotate crops, time planting to avoid midge emergence, apply insecticides at heading',
        description: 'Small orange flies whose larvae feed on developing wheat kernels, reducing yield and quality.',
        symptoms: 'Shriveled, distorted kernels, premature ripening, yield reduction'
      },
      {
        name: 'Russian Wheat Aphid',
        scientificName: 'Diuraphis noxia',
        riskFactors: ['Drought stress', 'Cool dry spring', 'Volunteer wheat', 'Wind dispersal'],
        management: 'Plant resistant varieties, eliminate volunteer wheat, timely insecticide application',
        description: 'Small light green aphids that inject toxins while feeding, causing distinctive leaf rolling.',
        symptoms: 'Longitudinal white or purple streaks on leaves, leaf rolling, trapped awns, stunted growth'
      }
    ],
    soybean: [
      { 
        name: 'Soybean Aphid', 
        scientificName: 'Aphis glycines',
        riskFactors: ['Mild winters', 'Early season stress', 'Presence of buckthorn (winter host)', 'Early planting'],
        management: 'Scout fields regularly, apply insecticides at threshold levels, use resistant varieties',
        description: 'Small yellow aphids that feed on plant sap, reducing yield and potentially spreading viruses.',
        symptoms: 'Stunted plants, yellowing, leaf curling, reduced pod formation, honeydew and sooty mold'
      },
      { 
        name: 'Bean Leaf Beetle', 
        scientificName: 'Cerotoma trifurcata',
        riskFactors: ['Early planting', 'Mild winters', 'Nearby alfalfa', 'Previous soybean fields'],
        management: 'Delayed planting, seed treatments, foliar insecticides when necessary, crop rotation',
        description: 'Adults feed on leaves, pods, and stems, and can transmit bean pod mottle virus.',
        symptoms: 'Round holes in leaves, scarred pods, clipped stems on seedlings'
      },
      { 
        name: 'Soybean Cyst Nematode', 
        scientificName: 'Heterodera glycines',
        riskFactors: ['Sandy soils', 'Previous infestation', 'Continuous soybean planting', 'Soil compaction'],
        management: 'Resistant varieties, crop rotation, soil testing, nematicides in severe cases',
        description: 'Microscopic roundworms that infect roots, reducing nutrient uptake and yield.',
        symptoms: 'Stunted yellow patches in field, reduced root systems, small white/yellow cysts on roots'
      },
      {
        name: 'Japanese Beetle',
        scientificName: 'Popillia japonica',
        riskFactors: ['Well-irrigated fields', 'Nearby ornamental plants', 'Grassy areas for larvae', 'Sandy soils'],
        management: 'Foliar insecticides when defoliation exceeds thresholds, avoid attractant trap crops nearby',
        description: 'Metallic green beetles with copper-colored wing covers that skeletonize leaves.',
        symptoms: 'Lace-like skeletonization of leaves, defoliation from field edges inward'
      },
      {
        name: 'Stink Bugs',
        scientificName: 'Various species',
        riskFactors: ['Nearby wooded areas', 'Late season', 'Dry weather', 'Field borders'],
        management: 'Edge treatment when populations warrant, targeted insecticides, maintain field borders',
        description: 'Shield-shaped insects that pierce pods and seeds, reducing quality and yield.',
        symptoms: 'Flattened or shriveled beans, delayed maturity, "stay green" effect, dimpled seeds'
      }
    ],
    cotton: [
      { 
        name: 'Cotton Bollworm', 
        scientificName: 'Helicoverpa zea',
        riskFactors: ['High temperatures', 'Previous crop residue', 'Nearby corn fields', 'Drought stress'],
        management: 'Bt cotton varieties, targeted spraying, destroy crop residues, maintain beneficial insects',
        description: 'Larvae feed on squares (flower buds) and bolls, causing direct yield loss.',
        symptoms: 'Round holes in squares and bolls, feeding damage to developing lint, frass inside bolls'
      },
      { 
        name: 'Boll Weevil', 
        scientificName: 'Anthonomus grandis',
        riskFactors: ['Mild winters', 'Nearby infested fields', 'Extended growing season', 'Unmanaged cotton'],
        management: 'Pheromone traps, early stalk destruction, preventative spraying, area-wide management',
        description: 'Beetle that lays eggs inside squares and bolls, causing them to abort or develop poorly.',
        symptoms: 'Yellow-stained blooms, flared squares that drop, damaged bolls with feeding punctures'
      },
      { 
        name: 'Spider Mites', 
        scientificName: 'Tetranychus urticae',
        riskFactors: ['Hot, dry conditions', 'Dusty field edges', 'Excessive nitrogen', 'Broad-spectrum insecticide use'],
        management: 'Conserve natural enemies, avoid drought stress, miticides when necessary, avoid pyrethroid overuse',
        description: 'Tiny arachnids that feed on the undersides of leaves, causing stippling and defoliation.',
        symptoms: 'Reddish or yellow stippling on upper leaf surface, webbing on undersides, bronzing, defoliation'
      },
      {
        name: 'Cotton Aphid',
        scientificName: 'Aphis gossypii',
        riskFactors: ['Early season stress', 'Excessive nitrogen', 'Broad-spectrum insecticide use', 'Cool conditions'],
        management: 'Conserve natural enemies, use recommended nitrogen rates, targeted insecticides if needed',
        description: 'Small insects that feed on plant sap, reducing vigor and potentially causing sticky cotton.',
        symptoms: 'Curled leaves, stunted growth, honeydew, sooty mold, sticky cotton lint'
      },
      {
        name: 'Thrips',
        scientificName: 'Various species',
        riskFactors: ['Cool spring weather', 'Nearby small grain crops', 'Minimum tillage', 'Early planting'],
        management: 'Seed treatments, in-furrow insecticides, foliar treatments for heavy infestations',
        description: 'Tiny insects that rasp leaf surfaces of seedling cotton, delaying early growth.',
        symptoms: 'Silvery or bronzed leaves, curled leaf edges, terminal damage, stunted growth'
      }
    ],
    rice: [
      { 
        name: 'Rice Water Weevil', 
        scientificName: 'Lissorhoptrus oryzophilus',
        riskFactors: ['Early flooding', 'Nearby infested fields', 'Levees with grassy weeds', 'Shallow flooding'],
        management: 'Delayed flooding, seed treatments, drain fields when larvae detected, manage levee vegetation',
        description: 'Adults feed on leaves while larvae feed on roots, reducing plant vigor and yield.',
        symptoms: 'Linear leaf scarring, reduced root systems, lodging, stunted growth, yield reduction'
      },
      { 
        name: 'Rice Stink Bug', 
        scientificName: 'Oebalus pugnax',
        riskFactors: ['Heading stage', 'Nearby grassy areas', 'Field borders', 'Staggered planting dates'],
        management: 'Scout during heading, treat when thresholds reached, manage field borders, uniform planting',
        description: 'Adults feed on developing grains, causing unfilled or discolored kernels.',
        symptoms: 'Discolored kernels, "pecky" rice, empty hulls, reduced milling quality'
      },
      { 
        name: 'Fall Armyworm', 
        scientificName: 'Spodoptera frugiperda',
        riskFactors: ['Late planting', 'Drought stress', 'Nearby host crops', 'Reduced flood depth'],
        management: 'Early planting, maintain optimal water levels, targeted insecticide application',
        description: 'Larvae can defoliate rice plants, particularly damaging to seedlings and young plants.',
        symptoms: 'Ragged leaf feeding, skeletonized leaves, cut seedlings, feeding in the whorl'
      },
      {
        name: 'Rice Leaf Beetle',
        scientificName: 'Oulema oryzae',
        riskFactors: ['High humidity', 'Dense canopy', 'Excessive nitrogen', 'Nearby host plants'],
        management: 'Balanced fertilization, appropriate spacing, targeted insecticides if damage is severe',
        description: 'Adults and larvae feed on rice leaves, reducing photosynthetic area.',
        symptoms: 'Linear striping on leaves, windowpaning, skeletonized patches on leaves'
      },
      {
        name: 'Rice Stem Borer',
        scientificName: 'Various species',
        riskFactors: ['Continuous rice cropping', 'Late planting', 'High nitrogen rates', 'Stubble retention'],
        management: 'Early planting, balanced fertilization, destruction of stubble, resistant varieties',
        description: 'Larvae bore into rice stems, causing deadhearts (dead central shoots) or whiteheads (empty panicles).',
        symptoms: 'Deadhearts, whiteheads, broken tillers, bored stems, emergence holes'
      }
    ],
    palm: [
      { 
        name: 'Red Palm Weevil', 
        scientificName: 'Rhynchophorus ferrugineus',
        riskFactors: ['Wounds in trunk', 'Nearby infested palms', 'Improper pruning', 'Young palms'],
        management: 'Regular inspection, pheromone traps, trunk injection with systemic insecticides, proper pruning protocols',
        description: 'Large reddish-brown weevil whose larvae tunnel through the palm trunk, often killing the tree.',
        symptoms: 'Wilting fronds, holes in trunk with reddish-brown sawdust, fermented odor, empty pupal cases'
      },
      { 
        name: 'Dubas Bug', 
        scientificName: 'Ommatissus lybicus',
        riskFactors: ['High temperatures', 'Dense planting', 'Nearby infested palms', 'Inadequate maintenance'],
        management: 'Canopy sprays during nymph stage, proper spacing between trees, natural predator conservation',
        description: 'Small planthopper that feeds on palm sap, secreting honeydew that leads to sooty mold.',
        symptoms: 'Yellowing fronds, honeydew, black sooty mold, reduced fruit quality'
      },
      { 
        name: 'Date Palm Scale', 
        scientificName: 'Parlatoria blanchardi',
        riskFactors: ['Dry conditions', 'High temperatures', 'Wind dispersal', 'Poor nutrition'],
        management: 'Horticultural oil sprays, pruning of heavily infested fronds, natural predator introduction',
        description: 'Armored scale insect that attaches to fronds and fruits, sucking sap and reducing vigor.',
        symptoms: 'White or gray encrustations on fronds, yellowing, reduced growth, poor fruit quality'
      },
      {
        name: 'Rhinoceros Beetle',
        scientificName: 'Oryctes rhinoceros',
        riskFactors: ['Decaying organic matter nearby', 'Rainy season', 'Young palms', 'Poor sanitation'],
        management: 'Pheromone traps, removal of breeding sites, biological control with fungi or viruses',
        description: 'Large black beetle that bores into the crown of palm trees, damaging growing tissue.',
        symptoms: 'V-shaped cuts in fronds, holes at frond bases, damaged or dead growing point'
      },
      {
        name: 'Palm Aphid',
        scientificName: 'Cerataphis brasiliensis',
        riskFactors: ['High humidity', 'Crowded plantings', 'Heavy nitrogen fertilization', 'Young tissue'],
        management: 'Water sprays to dislodge colonies, insecticidal soap, systemic insecticides if severe',
        description: 'Small black insects with white waxy covering that feed on young tissue.',
        symptoms: 'Distorted new growth, honeydew, sooty mold, yellowing fronds'
      }
    ],
    citrus: [
      { 
        name: 'Citrus Leafminer', 
        scientificName: 'Phyllocnistis citrella',
        riskFactors: ['New flush growth', 'High humidity', 'Frequent pruning', 'Young trees'],
        management: 'Time sprays with flush growth, natural enemy conservation, avoid excess nitrogen fertilization',
        description: 'Small moth whose larvae tunnel inside leaves, creating distinctive serpentine mines.',
        symptoms: 'Silvery tunnels in leaves, twisted or curled new growth, reduced photosynthesis'
      },
      { 
        name: 'Asian Citrus Psyllid', 
        scientificName: 'Diaphorina citri',
        riskFactors: ['New flush growth', 'Warm temperatures', 'Nearby infected trees', 'Year-round growth'],
        management: 'Regular scouting, systemic insecticides, yellow sticky traps for monitoring, regional management',
        description: 'Small jumping insect that vectors huanglongbing (citrus greening), a devastating bacterial disease.',
        symptoms: 'Twisted new growth, waxy tubules on leaves, nymphs with blue/green coloration'
      },
      { 
        name: 'Citrus Mealybug', 
        scientificName: 'Planococcus citri',
        riskFactors: ['Dry environment', 'Ants protecting colonies', 'Dense canopy', 'Dusty conditions'],
        management: 'Horticultural oils, ant control, beneficial insect release, systemic insecticides',
        description: 'Soft-bodied insects covered in white wax that feed on sap and produce honeydew.',
        symptoms: 'White cottony masses, honeydew, sooty mold, fruit drop, reduced vigor'
      },
      {
        name: 'Citrus Rust Mite',
        scientificName: 'Phyllocoptruta oleivora',
        riskFactors: ['Warm humid weather', 'Dense foliage', 'Dusty conditions', 'Previous infestation'],
        management: 'Horticultural oils, miticides, proper pruning for air circulation, predatory mite conservation',
        description: 'Microscopic mites that cause russeting on fruit and damage to leaves.',
        symptoms: 'Bronze or silver russeting on fruit, reduced fruit size, leaf bronzing'
      },
      {
        name: 'Citrus Thrips',
        scientificName: 'Scirtothrips citri',
        riskFactors: ['Hot dry weather', 'Young trees', 'Spring flush', 'Water stress'],
        management: 'Avoid water stress, targeted insecticide applications, selective materials to preserve beneficials',
        description: 'Tiny insects that rasp surface cells of fruit, leaves, and stems, causing scarring.',
        symptoms: 'Scarred ring around fruit stem end, silvery scars on fruit, deformed leaves, stunted growth'
      }
    ],
    tomato: [
      { 
        name: 'Tomato Hornworm', 
        scientificName: 'Manduca quinquemaculata',
        riskFactors: ['Warm weather', 'Previous solanaceous crops', 'Nearby weedy areas', 'Late summer'],
        management: 'Handpicking, Bt applications, beneficial wasps, row covers, crop rotation',
        description: 'Large green caterpillars with a horn-like projection that can rapidly defoliate plants.',
        symptoms: 'Defoliated upper portions of plants, dark frass (droppings), stems stripped of leaves'
      },
      { 
        name: 'Tomato Fruitworm', 
        scientificName: 'Helicoverpa zea',
        riskFactors: ['High temperatures', 'Early fruit set', 'Nearby corn fields', 'Previous infestation'],
        management: 'Pheromone traps, timed insecticide applications, Bt products, encouraging beneficial insects',
        description: 'Caterpillars that bore into fruit, making them unmarketable.',
        symptoms: 'Small entry holes in fruit with frass, internal feeding damage, caterpillars inside fruit'
      },
      { 
        name: 'Whitefly', 
        scientificName: 'Bemisia tabaci',
        riskFactors: ['High temperatures', 'Protected cultivation', 'Nearby host crops', 'Insecticide resistance'],
        management: 'Yellow sticky traps, insecticidal soaps, neem oil, beneficial insects, row covers',
        description: 'Small white flying insects that feed on plant sap and transmit viral diseases.',
        symptoms: 'Yellowing leaves, honeydew, sooty mold, stunted growth, irregular fruit ripening'
      },
      {
        name: 'Root-knot Nematode',
        scientificName: 'Meloidogyne spp.',
        riskFactors: ['Sandy soils', 'Warm soil temperatures', 'Previous infestation', 'Continuous cultivation'],
        management: 'Resistant varieties, crop rotation, soil solarization, organic amendments, grafting',
        description: 'Microscopic worms that infect roots, forming galls and reducing plant vigor.',
        symptoms: 'Stunted plants, wilting in hot weather, root galls, poor fruit set, nutrient deficiencies'
      },
      {
        name: 'Spider Mites',
        scientificName: 'Tetranychus urticae',
        riskFactors: ['Hot dry weather', 'Dusty conditions', 'Broad-spectrum insecticide use', 'Water stress'],
        management: 'Regular misting, predatory mites, horticultural oils, avoiding pyrethroid insecticides',
        description: 'Tiny arachnids that feed on leaf cells, causing stippling, bronzing, and webbing.',
        symptoms: 'Yellow or white stippling on leaves, fine webbing, leaf bronzing, defoliation'
      }
    ],
    potato: [
      { 
        name: 'Colorado Potato Beetle', 
        scientificName: 'Leptinotarsa decemlineata',
        riskFactors: ['Overwintered adults nearby', 'Early planted fields', 'Continuous potato cultivation', 'Insecticide resistance'],
        management: 'Crop rotation, deep plowing of previous potato fields, Bt sprays, systemic insecticides, row covers',
        description: 'Yellow and black striped beetles and red larvae that defoliate potato plants.',
        symptoms: 'Skeletonized leaves, complete defoliation, small red egg masses on leaf undersides'
      },
      { 
        name: 'Potato Leafhopper', 
        scientificName: 'Empoasca fabae',
        riskFactors: ['Southern winds in spring', 'Hot dry weather', 'Nearby alfalfa', 'Early season'],
        management: 'Monitoring, systemic insecticides, border sprays, kaolin clay applications',
        description: 'Small green wedge-shaped insects that cause hopperburn through toxic saliva.',
        symptoms: 'Triangular leaf burn starting at tips, stunted growth, reduced tuber size and quality'
      },
      { 
        name: 'Wireworms', 
        scientificName: 'Various Elateridae species',
        riskFactors: ['Newly broken sod', 'High organic matter soils', 'Cool wet spring', 'Previous grass crops'],
        management: 'Soil sampling before planting, seed treatments, soil insecticides, crop rotation',
        description: 'Slender hard-bodied larvae that bore into seed pieces and developing tubers.',
        symptoms: 'Slender holes in tubers, tunneling in seed pieces, poor stand establishment'
      },
      {
        name: 'Potato Aphid',
        scientificName: 'Macrosiphum euphorbiae',
        riskFactors: ['Mild winter', 'Early season', 'Nearby host plants', 'Dense canopy'],
        management: 'Scouting, preserving natural enemies, systemic insecticides, managing weed hosts',
        description: 'Large green or pink aphids that feed on plant sap and can transmit viral diseases.',
        symptoms: 'Curled leaves, stunted growth, honeydew, sooty mold, virus symptoms'
      },
      {
        name: 'Potato Cyst Nematode',
        scientificName: 'Globodera species',
        riskFactors: ['Previous infestation', 'Imported seed potatoes', 'Shared equipment', 'Short rotation'],
        management: 'Clean seed potatoes, equipment sanitation, resistant varieties, long rotations',
        description: 'Microscopic worms that form cysts on roots, severely reducing yields in infested fields.',
        symptoms: 'Stunted plants in patches, early senescence, poor yields, tiny cysts on roots'
      }
    ],
    apple: [
      { 
        name: 'Codling Moth', 
        scientificName: 'Cydia pomonella',
        riskFactors: ['Previous infestation', 'Nearby unmanaged apple trees', 'Poor orchard sanitation', 'Missed spray timing'],
        management: 'Pheromone traps for monitoring, mating disruption, well-timed insecticide sprays, sanitation',
        description: 'Small moth whose larvae tunnel into apples, making fruit unmarketable.',
        symptoms: 'Entry/exit holes in fruit, tunneling to core, frass at entry points, premature fruit drop'
      },
      { 
        name: 'Apple Maggot', 
        scientificName: 'Rhagoletis pomonella',
        riskFactors: ['Wild hosts nearby', 'Previous infestation', 'Early varieties', 'Poor sanitation'],
        management: 'Red sphere traps, kaolin clay applications, perimeter trapping, well-timed insecticides',
        description: 'Small fly whose maggots tunnel through apple flesh, causing dimpling and fruit decay.',
        symptoms: 'Dimpling and distortion of fruit surface, brownish tunnels in flesh, premature ripening'
      },
      { 
        name: 'Rosy Apple Aphid', 
        scientificName: 'Dysaphis plantaginea',
        riskFactors: ['Early season', 'Previous infestation', 'Vigorous growth', 'Susceptible varieties'],
        management: 'Dormant oils, early season systemic insecticides, predator conservation',
        description: 'Pinkish aphids that cause severe leaf curl and fruit distortion.',
        symptoms: 'Tightly curled leaves, distorted fruits, honeydew, sooty mold, reduced fruit size'
      },
      {
        name: 'Apple Scab',
        scientificName: 'Venturia inaequalis',
        riskFactors: ['Wet spring weather', 'Poor air circulation', 'Leaf litter retention', 'Susceptible varieties'],
        management: 'Resistant varieties, fungicide applications, leaf litter removal, proper pruning',
        description: 'Fungal disease that causes scab-like lesions on leaves and fruit.',
        symptoms: 'Olive-green to black scabby spots on leaves and fruit, leaf drop, cracked fruit'
      },
      {
        name: 'Fire Blight',
        scientificName: 'Erwinia amylovora',
        riskFactors: ['Warm wet bloom period', 'Hail or storm damage', 'Susceptible varieties', 'Insect injuries'],
        management: 'Resistant varieties, copper sprays, antibiotic applications during bloom, pruning out infections',
        description: "Bacterial disease that causes rapid dieback of shoots and branches, often with a characteristic shepherd's crook appearance.",
        symptoms: "Blackened shoots with shepherd's crook, oozing bacteria, fruit mummification, rapid branch death"
      }
    ],
    almond: [
      {
        name: 'Navel Orangeworm',
        scientificName: 'Amyelois transitella',
        riskFactors: ['Unharvested "mummy" nuts', 'Hull split timing', 'Heat accumulation', 'Previous infestation'],
        management: 'Winter sanitation, timely harvest, mating disruption, well-timed insecticides',
        description: 'Moths that lay eggs on split hulls; larvae feed inside nuts causing direct damage and aflatoxin contamination.',
        symptoms: 'Entry holes in hulls, internal feeding damage, webbing and frass inside nuts'
      },
      {
        name: 'Peach Twig Borer',
        scientificName: 'Anarsia lineatella',
        riskFactors: ['Mild winter', 'Previous infestation', 'Early varieties', 'Nearby stone fruit'],
        management: 'Dormant oil sprays, Bt at bloom, mating disruption, well-timed insecticides',
        description: 'Small moth whose larvae damage shoots and nuts by boring into them.',
        symptoms: 'Flagged shoots with dying tips, entry holes in nuts, frass at entry points'
      },
      {
        name: 'Web-spinning Spider Mites',
        scientificName: 'Tetranychus species',
        riskFactors: ['Hot dry conditions', 'Dusty orchards', 'Broad-spectrum insecticide use', 'Water stress'],
        management: 'Predatory mite releases, miticides, dust control, proper irrigation, avoiding pyrethroids',
        description: 'Tiny arachnids that feed on leaf cells, causing bronzing, defoliation, and reduced yields.',
        symptoms: 'Bronzed leaves, webbing, stippling, premature leaf drop, reduced nut size'
      },
      {
        name: 'Leaffooted Bug',
        scientificName: 'Leptoglossus species',
        riskFactors: ['Nearby pomegranates', 'Early spring', 'Overwintering sites nearby', 'Previous year infestation'],
        management: 'Monitoring overwintering sites, early season treatments, removing alternative hosts',
        description: 'Large bugs with leaf-like hind legs that pierce nuts, causing gumming and kernel damage.',
        symptoms: 'Gummy exudate from nuts, shriveled or darkened kernels, dropped nuts'
      },
      {
        name: 'Bacterial Spot',
        scientificName: 'Xanthomonas arboricola pv. pruni',
        riskFactors: ['Wet spring conditions', 'Overhead irrigation', 'Susceptible varieties', 'Previous infection'],
        management: 'Copper sprays, avoiding overhead irrigation, resistant varieties if available',
        description: 'Bacterial disease that affects leaves, twigs, and nuts, causing lesions and gumming.',
        symptoms: 'Angular leaf spots with yellow halos, twig cankers, gumming on nuts, kernel damage'
      }
    ],
    // Additional crops would be added with their pests here...
  };

  // Extract all unique pests and risk factors across all crops
  const allPests = useMemo(() => {
    const pests = new Set();
    Object.values(cropPests).forEach(cropPestList => {
      cropPestList.forEach(pest => {
        pests.add(pest.name);
      });
    });
    return Array.from(pests).sort();
  }, [cropPests]);

  // Region-specific pest information
  const regionPests = {
    // UAE - Dubai specific pests
    "AE": {
      "Dubai": [
        {
          name: "Red Palm Weevil",
          scientificName: "Rhynchophorus ferrugineus",
          description: "Major pest of date palms in Dubai and throughout UAE. Adult weevils are reddish-brown with a long snout and can fly up to 1km. Larvae tunnel through palm trunk causing severe damage.",
          symptoms: "Wilting fronds, holes in trunk with reddish-brown sawdust, fermented odor, empty pupal cases around base of tree.",
          management: "Regular inspection, pheromone traps, injection of systemic insecticides, proper pruning and sanitation techniques. Affected palms should be reported to municipality.",
          severity: "High",
          image: "https://www.plantwise.org/KnowledgeBank/800x640/PMDG_98764.jpg"
        },
        {
          name: "Dubas Bug",
          scientificName: "Ommatissus lybicus",
          description: "Small whitish planthopper that feeds on date palm sap. Causes honeydew secretion that leads to black sooty mold growth.",
          symptoms: "Yellowing of fronds, sticky honeydew on leaves, black sooty mold, reduced fruit quality and yield.",
          management: "Canopy sprays during nymph stages (April-May and October-November), proper spacing between trees, natural predator conservation.",
          severity: "Medium",
          image: "https://www.ecoport.org/fileadmin/ecoport/0/37500.jpg"
        },
        {
          name: "Rhinoceros Beetle",
          scientificName: "Oryctes rhinoceros",
          description: "Large black beetle that bores into the crown of palms and damages the growing point. Common in organic farms and areas with decaying vegetation.",
          symptoms: "V-shaped cuts in fronds, holes at base of fronds, damaged or dead growing point.",
          management: "Pheromone traps, removal of breeding sites like decaying vegetation, application of beneficial fungi Metarhizium anisopliae.",
          severity: "Medium",
          image: "https://www.infonet-biovision.org/sites/default/files/plant_health/pests/621.jpeg"
        }
      ]
    },
    // US - Washington DC
    "US": {
      "20001": [
        {
          name: "Brown Marmorated Stink Bug",
          scientificName: "Halyomorpha halys",
          description: "Invasive pest that damages fruits, vegetables, and ornamental plants in the DC area. Shield-shaped body with distinctive brown marbled pattern.",
          symptoms: "Sunken areas and cat-facing on fruits, stippling on leaves, early fruit drop.",
          management: "Seal home entry points, use pheromone traps, targeted applications of insecticidal soap and neem oil for home gardens.",
          severity: "Medium",
          image: "https://entomology.ces.ncsu.edu/wp-content/uploads/2013/09/BMSB-on-Apple-2.jpg"
        },
        {
          name: "Emerald Ash Borer",
          scientificName: "Agrilus planipennis",
          description: "Metallic green beetle that infests and kills all species of ash trees in the DC region. A significant threat to urban forests.",
          symptoms: "D-shaped exit holes in bark, S-shaped tunnels under bark, canopy dieback, woodpecker feeding.",
          management: "Preventative systemic insecticides for valuable trees, removal and proper disposal of infested trees, avoid moving firewood.",
          severity: "High",
          image: "https://extension.umd.edu/sites/extension.umd.edu/files/styles/optimized/public/2021-03/EAB-symptoms_tunnels.jpg"
        }
      ]
    }
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const [regionSpecificPests, setRegionSpecificPests] = useState([]);
  const [regionInfo, setRegionInfo] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API key and endpoint
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,alerts&units=imperial&appid=${apiKey}`
        );
        setWeatherData(response.data);
        
        // Calculate pest risks based on weather conditions
        calculatePestRisks(response.data, selectedCrop);

        // Get location data for region-specific pests
        try {
          const geoResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.lng}&limit=1&appid=${apiKey}`
          );
          
          if (geoResponse.data && geoResponse.data.length > 0) {
            const locationData = geoResponse.data[0];
            const countryCode = locationData.country;
            const city = locationData.name;
            const zipCode = locationData.zip || '';
            
            setRegionInfo({
              countryCode,
              city,
              zipCode
            });
            
            // Check if we have region-specific pest data
            if (regionPests[countryCode]) {
              // First check for zip code match
              if (zipCode && regionPests[countryCode][zipCode]) {
                setRegionSpecificPests(regionPests[countryCode][zipCode]);
              } 
              // Then try city match
              else if (regionPests[countryCode][city]) {
                setRegionSpecificPests(regionPests[countryCode][city]);
              } 
              // Default to empty array if no match
              else {
                setRegionSpecificPests([]);
              }
            } else {
              setRegionSpecificPests([]);
            }
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
          setRegionSpecificPests([]);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, selectedCrop]);

  const calculatePestRisks = (weather, crop) => {
    if (!weather || !cropPests[crop]) return;

    const currentTemp = weather.current.temp;
    const humidity = weather.current.humidity;
    const windSpeed = weather.current.wind_speed;
    const rainfall = weather.daily.slice(0, 7).reduce((sum, day) => sum + (day.rain ? day.rain : 0), 0);
    
    // Calculate risk levels for each pest based on current conditions
    const risks = cropPests[crop].map(pest => {
      let riskLevel = 'Low';
      let riskScore = 0;
      
      // Temperature factor
      if (currentTemp > 80) riskScore += 3;
      else if (currentTemp > 70) riskScore += 2;
      else if (currentTemp > 60) riskScore += 1;
      
      // Humidity factor
      if (humidity > 80) riskScore += 3;
      else if (humidity > 60) riskScore += 2;
      else if (humidity > 40) riskScore += 1;
      
      // Rainfall factor
      if (rainfall < 0.5) riskScore += 2; // Dry conditions often favor certain pests
      else if (rainfall > 3) riskScore += 2; // Heavy rain can favor fungal diseases
      
      // Determine risk level based on score
      if (riskScore >= 6) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';
      
      // Generate random coordinates near the user's location for visualization
      const randomLat = location.lat + (Math.random() - 0.5) * 0.05;
      const randomLng = location.lng + (Math.random() - 0.5) * 0.05;
      
      return {
        ...pest,
        riskLevel,
        riskScore,
        location: { lat: randomLat, lng: randomLng }
      };
    });
    
    setPestRisks(risks);
    applyFilters(risks); // Apply filters immediately to the new data
  };

  // Apply filters to the pest risks
  const applyFilters = (currentPestRisks) => {
    if (!currentPestRisks) return;
    
    let filtered = [...currentPestRisks];
    
    // Apply risk level filter
    if (riskLevelFilter !== 'all') {
      filtered = filtered.filter(pest => pest.riskLevel === riskLevelFilter);
    }
    
    // Apply pest filter
    if (pestFilter !== 'all') {
      filtered = filtered.filter(pest => pest.name === pestFilter);
    }
    
    // Apply risk factor filter
    if (riskFactorFilter !== 'all') {
      filtered = filtered.filter(pest => 
        pest.riskFactors.some(factor => 
          factor.toLowerCase().includes(riskFactorFilter.toLowerCase())
        )
      );
    }
    
    setFilteredPestRisks(filtered);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters(pestRisks);
  }, [riskLevelFilter, pestFilter, riskFactorFilter, pestRisks]);

  // Handle crop selection
  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    setCropFilter('all'); // Reset filters when crop changes
    setPestFilter('all');
    setRiskLevelFilter('all');
    setRiskFactorFilter('all');
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6">
            <h1 className="text-3xl font-bold text-white">Pest Management</h1>
            <p className="text-green-100 mt-2">
              Monitor and manage pest risks based on real-time weather conditions and crop selection
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Crop Selection & Filters */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Select Your Crop</h2>
                  <div className="relative">
                    <select 
                      className="w-full p-2 border border-green-300 rounded-md bg-white text-green-800"
                      value={selectedCrop}
                      onChange={(e) => handleCropChange(e.target.value)}
                    >
                      {globalCrops.map(crop => (
                        <option key={crop} value={crop}>
                          {crop.charAt(0).toUpperCase() + crop.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                  <h2 className="text-lg font-semibold text-green-800 mb-3">Filter Options</h2>
                  
                  <div className="space-y-4">
                    {/* Pest Filter */}
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Pest Type</label>
                      <select 
                        className="w-full p-2 border border-green-300 rounded-md text-sm"
                        value={pestFilter}
                        onChange={(e) => setPestFilter(e.target.value)}
                      >
                        <option value="all">All Pests</option>
                        {cropPests[selectedCrop]?.map(pest => (
                          <option key={pest.name} value={pest.name}>
                            {pest.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Risk Level Filter */}
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Risk Level</label>
                      <select 
                        className="w-full p-2 border border-green-300 rounded-md text-sm"
                        value={riskLevelFilter}
                        onChange={(e) => setRiskLevelFilter(e.target.value)}
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    
                    {/* Risk Factor Filter */}
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">Risk Factor</label>
                      <select 
                        className="w-full p-2 border border-green-300 rounded-md text-sm"
                        value={riskFactorFilter}
                        onChange={(e) => setRiskFactorFilter(e.target.value)}
                      >
                        <option value="all">All Risk Factors</option>
                        {riskFactors.map(factor => (
                          <option key={factor} value={factor}>
                            {factor}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {weatherData && (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Current Weather</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Temperature:</span>
                        <span className="font-medium">{Math.round(weatherData.current.temp)}°F</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Humidity:</span>
                        <span className="font-medium">{weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Wind:</span>
                        <span className="font-medium">{Math.round(weatherData.current.wind_speed)} mph</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Conditions:</span>
                        <span className="font-medium">{weatherData.current.weather[0].description}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Middle & Right Columns - Map & Risk Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-green-800 p-4 border-b border-gray-200">
                    Pest Risk Map
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {filteredPestRisks.length} {filteredPestRisks.length === 1 ? 'pest' : 'pests'} displayed
                    </span>
                  </h2>
                  <div className="h-96">
                    {!loading ? (
                      <MapContainer 
                        center={[location.lat, location.lng]} 
                        zoom={12} 
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* User location marker */}
                        <Marker position={[location.lat, location.lng]}>
                          <Popup>
                            Your location
                          </Popup>
                        </Marker>
                        
                        {/* Pest risk markers */}
                        {filteredPestRisks.map((pest, index) => (
                          <Marker 
                            key={index}
                            position={[pest.location.lat, pest.location.lng]}
                            icon={createPestIcon(pest.riskLevel)}
                          >
                            <Popup>
                              <div className="text-sm">
                                <h3 className="font-bold">{pest.name}</h3>
                                <p className="text-xs italic text-gray-600">{pest.scientificName}</p>
                                <p className={`font-semibold ${
                                  pest.riskLevel === 'High' ? 'text-red-600' : 
                                  pest.riskLevel === 'Medium' ? 'text-yellow-600' : 
                                  'text-green-600'
                                }`}>
                                  Risk Level: {pest.riskLevel}
                                </p>
                                <div className="mt-1">
                                  <p className="font-semibold text-xs">Risk Factors:</p>
                                  <ul className="text-xs list-disc list-inside">
                                    {pest.riskFactors.slice(0, 2).map((factor, i) => (
                                      <li key={i}>{factor}</li>
                                    ))}
                                    {pest.riskFactors.length > 2 && <li>+ {pest.riskFactors.length - 2} more</li>}
                                  </ul>
                                </div>
                                <p className="mt-1 text-xs">
                                  <span className="font-semibold">Management:</span> {pest.management.split(',')[0]}...
                                </p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                          <p className="mt-2 text-green-800">Loading pest data...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pest Risk Table */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-green-800">
                  Pest Risk Assessment for {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {filteredPestRisks.length} of {pestRisks.length} pests
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Pest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Risk Factors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Management Recommendations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPestRisks.length > 0 ? (
                      filteredPestRisks.map((pest, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{pest.name}</div>
                            <div className="text-xs text-gray-500 italic">{pest.scientificName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pest.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                              pest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {pest.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <ul className="list-disc list-inside">
                              {pest.riskFactors.map((factor, i) => (
                                <li key={i} className={riskFactorFilter !== 'all' && factor.toLowerCase().includes(riskFactorFilter.toLowerCase()) 
                                  ? 'font-semibold text-green-700' 
                                  : ''
                                }>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {pest.management.split(', ').map((item, i) => (
                              <div key={i} className="mb-1">• {item}</div>
                            ))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No pests match your current filters. Try adjusting your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pest Details Section (Expanded for selected pest) */}
            {pestFilter !== 'all' && filteredPestRisks.length > 0 && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-green-50 p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-green-800">
                    Detailed Pest Information
                  </h2>
                </div>
                
                <div className="p-6">
                  {filteredPestRisks.map((pest, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-green-800">{pest.name}</h3>
                        <span className="text-sm italic text-gray-600">({pest.scientificName})</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Description</h4>
                          <p className="text-gray-700">{pest.description}</p>
                          
                          <h4 className="font-semibold text-green-700 mt-4 mb-2">Symptoms</h4>
                          <p className="text-gray-700">{pest.symptoms}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Risk Assessment</h4>
                          <div className="flex items-center mb-3">
                            <span className="mr-2">Current Risk:</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              pest.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                              pest.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {pest.riskLevel}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold text-green-700 mt-4 mb-2">Risk Factors</h4>
                          <ul className="list-disc list-inside text-gray-700">
                            {pest.riskFactors.map((factor, i) => (
                              <li key={i}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Comprehensive Management Strategy</h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          {pest.management.split(', ').map((strategy, i) => (
                            <div key={i} className="mb-2 flex items-start">
                              <span className="text-green-700 mr-2">•</span>
                              <span>{strategy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Region-Specific Pest Information */}
            {regionSpecificPests.length > 0 && (
              <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                  {regionInfo?.city ? `Local Pest Alerts for ${regionInfo.city}` : 'Local Pest Alerts'}
                </h2>
                
                <div className="space-y-6">
                  {regionSpecificPests.map((pest, index) => (
                    <div key={index} className="bg-white rounded-lg p-5 border border-yellow-200 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4">
                          {pest.image && (
                            <img 
                              src={pest.image} 
                              alt={pest.name} 
                              className="w-full h-auto rounded-lg object-cover"
                              onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x300?text=Pest+Image"}}
                            />
                          )}
                        </div>
                        <div className="md:w-3/4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-yellow-800">{pest.name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              pest.severity === 'High' ? 'bg-red-100 text-red-800' : 
                              pest.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {pest.severity} Risk
                            </span>
                          </div>
                          
                          <p className="text-sm italic text-gray-600 mt-1">{pest.scientificName}</p>
                          
                          <p className="mt-3 text-sm text-gray-700">{pest.description}</p>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <h4 className="font-semibold text-yellow-700 text-sm">Key Symptoms</h4>
                              <p className="mt-1 text-sm text-gray-600">{pest.symptoms}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-700 text-sm">Management</h4>
                              <p className="mt-1 text-sm text-gray-600">{pest.management}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organic Pest Management Section */}
            <div className="mt-8 bg-green-50 rounded-lg border border-green-200 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Sustainable Pest Management Strategies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Beneficial Insects</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Introduce ladybugs, lacewings, and predatory mites to naturally control pest populations without chemicals.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Crop Rotation</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Disrupt pest life cycles by rotating crops annually. This prevents pest populations from becoming established.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Companion Planting</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Plant pest-repelling herbs and flowers alongside crops to naturally deter common agricultural pests.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Physical Barriers</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Use row covers, netting, and other physical barriers to prevent pests from reaching your crops.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Biological Controls</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Apply Bacillus thuringiensis (Bt), nematodes, and other biological agents that target specific pests.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-700">Trap Crops</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Plant sacrificial crops that attract pests away from your main crop, then treat or remove the trap crops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestManagement;