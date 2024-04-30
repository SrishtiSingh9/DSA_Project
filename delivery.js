// Define user's latitude and longitude
let userLat;
let userLng;

// Define hotel locations as objects with latitude and longitude
const hotelALocation = {
  latitude: 19.1966,
  longitude: 72.8045,
};

const hotelBLocation = {
  latitude: 19.1975,
  longitude: 72.8366,
};

// Define a function to get the user's current location using geolocation API
function getUserLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        const userLocation = `${userLat},${userLng}`; // Combine latitude and longitude
        callback(userLocation);
      },
      error => {
        console.error('Error getting user location:', error);
        callback(null); // Call the callback function with null if there's an error
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser');
    callback(null); // Call the callback function with null if geolocation is not supported
  }
}

// Function to calculate distance between two geographical points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Function to validate form fields
function validateForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const item = document.getElementById('item').value;

  if (name && email && phone && address && item) {
    return true; // All fields are filled
  } else {
    alert('Please fill in all fields.'); // Alert user to fill in all fields
    return false; // Not all fields are filled
  }
}

// Function to handle place order button click
function placeOrderButton(chosenHotel, event) {
  event.preventDefault(); // Prevent the default form submission behavior

  if (!validateForm()) {
    return; // Stop execution if form validation fails
  }

  getUserLocation(userLocation => {
    if (userLocation && chosenHotel) { // Check if user location is available and hotel is chosen
      // Calculate distances from user to both hotels
      const distanceFromUserToHotelA = calculateDistance(userLat, userLng, hotelALocation.latitude, hotelALocation.longitude);
      const distanceFromUserToHotelB = calculateDistance(userLat, userLng, hotelBLocation.latitude, hotelBLocation.longitude);

      // Provide acknowledgment message based on the chosen hotel
      let acknowledgmentMessage;
      if (chosenHotel === 'Hotel A') {
        acknowledgmentMessage = `Hotel A is approximately ${distanceFromUserToHotelA.toFixed(2)} KM away from you. Enjoy your meal!`;
      } else if (chosenHotel === 'Hotel B') {
        acknowledgmentMessage = `Hotel B is approximately ${distanceFromUserToHotelB.toFixed(2)} KM away from you. Your food can come very soon.`;
      } else {
        acknowledgmentMessage = `Invalid hotel selection.`;
      }

      // Display acknowledgment message
      alert(acknowledgmentMessage + "\n\nThanks for ordering from " + chosenHotel + " with the selected items.");
    } else {
      // Handle the case where user location is not available or hotel is not chosen
      console.error('User location is not available or hotel is not chosen');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const placeOrderButtonElementA = document.getElementById('placeOrderButtonA');
  const placeOrderButtonElementB = document.getElementById('placeOrderButtonB');

  // Attach event listener to place order button for Hotel A
  if (placeOrderButtonElementA) {
    placeOrderButtonElementA.addEventListener('click', (event) => placeOrderButton('Hotel A', event));
  }

  // Attach event listener to place order button for Hotel B
  if (placeOrderButtonElementB) {
    placeOrderButtonElementB.addEventListener('click', (event) => placeOrderButton('Hotel B', event));
  }
});




class Graph {
  constructor() {
    this.vertices = {};
  }

  addVertex(name, location) {
    if (!(name in this.vertices)) {
      this.vertices[name] = { location: location, edges: {} };
    }
  }

  addEdge(source, destination, distance) {
    if (source in this.vertices && destination in this.vertices) {
      this.vertices[source].edges[destination] = distance;
      this.vertices[destination].edges[source] = distance; // Assuming bidirectional edges
    }
  }

  // Dijkstra's algorithm to find the shortest path
  dijkstra(source, destination) {
    const distances = {};
    const visited = {};
    const previous = {};
    const queue = new PriorityQueue();

    // Initialize distances
    for (let vertex in this.vertices) {
      distances[vertex] = vertex === source ? 0 : Infinity;
      queue.enqueue(vertex, distances[vertex]);
    }

    while (!queue.isEmpty()) {
      const currentVertex = queue.dequeue().data;
      if (currentVertex === destination) {
        // Build the shortest path and return it
        const path = [];
        let vertex = destination;
        while (vertex !== source) {
          path.unshift(vertex);
          vertex = previous[vertex];
        }
        path.unshift(source);
        return path;
      }

      visited[currentVertex] = true;

      for (let neighbor in this.vertices[currentVertex].edges) {
        const distance = this.vertices[currentVertex].edges[neighbor];
        const totalDistance = distances[currentVertex] + distance;
        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          previous[neighbor] = currentVertex;
          queue.enqueue(neighbor, totalDistance);
        }
      }
    }

    // If destination is not reachable from source
    return [];
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(data, priority) {
    this.queue.push({ data, priority });
    this.sort();
  }

  dequeue() {
    return this.queue.shift();
  }

  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}