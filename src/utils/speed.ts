export function calculateSpeed(t1: number, lat1: number, lng1: number, t2: number, lat2: number, lng2: number) {

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const lat1rad = toRad(lat1);
    const lat2rad = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1rad) * Math.cos(lat2rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.abs(distance / ((t1 - t2) / 1000 / 60 / 60));
}

function toRad(deg: number) {
    return deg * Math.PI / 180
}


// example:
// calculateSpeed(1615457821644, 59.915073, 30.510111, 1615459621644, 59.951854, 30.480750)
// result: ~8,5 km/h
