/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Radius of the Earth in km
  const R = 6371;
  
  // Convert degrees to radians
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance in km
  return R * c;
};

/**
 * Converts numeric degrees to radians
 * @param {number} value - Value in degrees
 * @returns {number} Value in radians
 */
const toRad = (value) => {
  return value * Math.PI / 180;
};

module.exports = {
  calculateDistance,
  toRad
};
