import { updatePositionArray } from "./webgl-demo.js";



export let x = 0;
export let y = 0;

function updatePosition(a){
    switch (a) {
        case 'ArrowUp':
            y += 0.2;
            
            break;
        case 'ArrowDown':
            y -= 0.2;
            
            break;
        case 'ArrowLeft':
            x -= 0.2;
            
            break;
        case 'ArrowRight':
            x += 0.2;
            
            break;
        case 'Space':
            x = 0;
            y = 0;
            
            break;
    
        default:
            console.log('Unrecognized Input Key: ' + a);
            break;
    }

    updatePositionArray(x, y);

    return[x,y];
}

window.addEventListener('keydown', function(event) {
    updatePosition(event.key);
});

function moveCharacter(position){
    const [x, y] = position;
    

}

function startKeyboardListening(){
    window.addEventListener('keydown', function(event) {
        const position = updatePosition(event.key);
        moveCharacter(position);
    });
}

export {startKeyboardListening};