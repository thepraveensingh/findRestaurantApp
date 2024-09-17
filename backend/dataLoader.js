const fs = require('fs');
const path = require('path');

const loadRestaurantsData = () => {
    const files = [
        'file1.json',
        'file2.json',
        'file3.json', 
        'file4.json',
        'file5.json'
    ];
    let allRestaurants = [];

    files.forEach((file) => {
        const filePath = path.join(__dirname, 'data', file);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Assuming fileData is an array of restaurant objects
        fileData.forEach(item => {
            if (item.restaurant) {
                allRestaurants.push(item.restaurant);
            }
        });
    });
    console.log(allRestaurants);
    return allRestaurants;
};

module.exports = loadRestaurantsData;
