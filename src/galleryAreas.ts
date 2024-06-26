import { Color3, Quaternion, Vector3 } from "@dcl/sdk/math";
import { engine, Transform, Entity, MeshRenderer } from "@dcl/sdk/ecs";
import * as utils from '@dcl-sdk/utils';
import { createWearableReward } from "./claim-dropin/rewards";
import { createImageArt } from "./Art/imageArt";
import { groundVideo, logoImage, logoURL } from "./Art/artData";
import { gallery1Pos1, gallery1Pos2, gallery1Pos3, gallery1Pos4, gallery1Pos5, gallery1Rot1, gallery1Rot2, gallery1Rot3, gallery1Rot4, gallery1Rot5 } from "./Art/artPositions";
import { createToggleableArt } from "./Art/videoArt";
import { urn1, urn2, urn3 } from "./Art/artData";
import { createNFT, canvasFrame } from "./Art/nft";


// Add the assets you want to appear in each gallery area within the corresponding functions below (createGallery0, createGallery1, etc.) and they will load or offload depending on player proximity


// Ground floor
async function createGallery0() {
    const area = galleryAreas[0];
    const entity1 = createImageArt(
        logoImage,
        gallery1Pos4,
        gallery1Rot4,
        Vector3.create(1, 1, 1),
        'Click',
        logoURL,
        true
    );
    const entity2 = createImageArt(
        logoImage,
        gallery1Pos5,
        gallery1Rot5,
        Vector3.One(),
        'Click',
        logoURL,
        true
    )
    const e3 = await createToggleableArt(
        gallery1Pos2,
        gallery1Rot2,
        Vector3.create(.005 * 1096, .005 * 720, 1),
        logoImage,
        groundVideo,
        'Click',
        logoURL,
        Vector3.create(5, 5, 7)
    )
    const e4 = createNFT(
        gallery1Pos1,
        gallery1Rot1,
        Vector3.create(4, 4, 4),
        urn2,
        Color3.Yellow(),
        canvasFrame,
        'Click'
    )
    const e5 = createNFT(
        gallery1Pos3,
        gallery1Rot3,
        Vector3.create(4, 4, 4),
        urn3,
        Color3.Yellow(),
        canvasFrame,
        'Click'
    )
   
    area.entities.push(entity1, entity2, e3, e4, e5);

}

// First floor
function createGallery1() {
    const area = galleryAreas[1];
    const entity3 = createGalleryEntity(Vector3.create(16, 10, 16), Vector3.create(0, 0, 0));
    const entity4 = createGalleryEntity(Vector3.create(15, 10, 13), Vector3.create(0, 0, 0));
    area.entities.push(entity3, entity4);

}

// Rooftop
function createGallery2() {
    const area = galleryAreas[2];
    let entity5 = createWearableReward()
    area.entities.push(entity5);

}


//let player = engine.PlayerEntity 

// Define gallery areas
export const galleryAreas: { position: Vector3, entities: Entity[] } [] = [
    //Ground floor gallery
    { position: Vector3.create(10, 0, 16), entities: [] },

    //First floor gallery
    { position: Vector3.create(10, 10, 16), entities: [] },

    //Rooftop area
    { position: Vector3.create(10, 20, 16), entities: [] },

    // Add more gallery areas as needed
];

// Load gallery area artworks
export function loadGalleryArea(index: number) {
    const area = galleryAreas[index];
    if (area) {
        const createFunction = index === 0 ? createGallery0 : (index === 1 ? createGallery1 : createGallery2);
        createFunction();
        console.log(`Loaded gallery area ${index}`);
    }
}

// Offload gallery area artworks
export function offloadGalleryArea(index: number) {
    const area = galleryAreas[index];
    if (area) {
        // Remove all entities from the area
        area.entities.forEach(entity => {
            engine.removeEntity(entity);
        });
        area.entities = []; // Reset the entities array
    }
}

// Trigger loading and offloading based on player's location
export function handleGalleryAreaTrigger(playerPosition: Vector3) {
    galleryAreas.forEach((area, index) => {
        const distance = Vector3.distance(playerPosition, area.position);
        if (distance < 1 && area.entities.length === 0) {
            // Load gallery area if player enters and area is empty
            loadGalleryArea(index);
            console.log('load gallery items');
        } else if (distance >= 1 && area.entities.length > 0) {
            // Offload gallery area if player exits and area has entities
            offloadGalleryArea(index);
            console.log('offload gallery items');
        }
    });
}


// Create trigger zones around gallery areas
export function createGalleryAreaTriggers(position: Vector3, scale: Vector3) {
    galleryAreas.forEach(area => {
        const triggerEntity = engine.addEntity();
        Transform.create(triggerEntity, {
            position: position, 
            scale: scale
        })

        utils.triggers.addTrigger(
            triggerEntity,
            utils.NO_LAYERS,
            utils.LAYER_1,
            [{
                type: 'box',
                position: { x: position.x, y: position.y, z: position.z },
                scale: { x: scale.x, y: scale.y, z: scale.z }
            }],
            function (otherEntity) {
                loadGalleryArea(galleryAreas.indexOf(area))
                console.log('load gallery items')
            },
            function (anotherEntity) {
                offloadGalleryArea(galleryAreas.indexOf(area))
                console.log('offload gallery items')

            }
        )
    });
}

function createGalleryEntity(position: Vector3, rotation: Vector3): Entity {
    const entity = engine.addEntity();

    Transform.create(entity, {
        position: position,
        rotation: Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)
    })

    MeshRenderer.setBox(entity)

    return entity;
}


// Initialize gallery areas and triggers
export function initializeGalleryAreas() {

    createGallery0()
   // createGallery1()
   // createGallery2()


    // Create trigger zones around gallery areas

    // Ground floor trigger area
    createGalleryAreaTriggers(
        Vector3.create(4, 1.5, 8), // position
        Vector3.create(16, 6, 20)); // scale
        
    /*
    //First floor trigger area
    createGalleryAreaTriggers(
        Vector3.create(6.65, 5.5, 8),
        Vector3.create(26.2, 10, 32)
    )

    //Rooftop trigger area
    createGalleryAreaTriggers(
        Vector3.create(6.65, 12.5, 8),
        Vector3.create(26.2, 10, 26)
    )
    */
}


// VON MISES POSTERS