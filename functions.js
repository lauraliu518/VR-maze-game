function mapWalls(){
    //create walls based on wall map
    for(let i = 0; i < worldSize; i++){
        for(let j = 0; j < worldSize; j++){
            if(checkIfMapPositionIsBlack(offset + i, offset + j)){
                let x = convert2Dto3D(offset + i);
                let y = wallHeight/2;
                let z = convert2Dto3D(offset + j);
                let wall = new AFrameP5.Box({
                    x: x,
                    y: y,
                    z: z,
                    width: blockSize,
                    height: wallHeight,
                    depth: blockSize,
                    asset: "brick",
                })
                world.add(wall);
            }
        }
    }
}

function checkIfMapPositionIsBlack(x, y){
    let redTotal = red(map.get(x, y));
    if(redTotal == 0){
        return true;
    }
    return false;
}

function convert2Dto3D(twoDim){
    let threeDim = twoDim - worldSize/2;
    return threeDim;
}
