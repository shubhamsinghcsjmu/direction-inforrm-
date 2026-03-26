// Direction Informar - Navigation System

class DirectionInformar {
    constructor() {
        this.start = '';
        this.destination = '';
        this.directions = [];
        this.totalDistance = 0;
        this.estimatedTime = 0;
        this.currentZoom = 1;
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadSampleData();
    }

    cacheElements() {
        this.startInput = document.getElementById('start');
        this.destinationInput = document.getElementById('destination');
        this.findDirectionBtn = document.getElementById('findDirection');
        this.routeInfo = document.getElementById('routeInfo');
        this.stepsList = document.getElementById('stepsList');
        this.totalDistanceEl = document.getElementById('totalDistance');
        this.estimatedTimeEl = document.getElementById('estimatedTime');
        this.transportModeEl = document.getElementById('transportMode');
        this.map = document.getElementById('map');
        this.zoomInBtn = document.getElementById('zoomIn');
        this.zoomOutBtn = document.getElementById('zoomOut');
        this.currentLocationBtn = document.getElementById('currentLocation');
    }

    attachEventListeners() {
        this.findDirectionBtn.addEventListener('click', () => this.findDirection());
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.currentLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        
        // Allow Enter key to trigger direction search
        this.destinationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.findDirection();
        });
    }

    loadSampleData() {
        // Pre-load with default locations
        this.findDirection();
    }

    findDirection() {
        this.start = this.startInput.value.trim();
        this.destination = this.destinationInput.value.trim();

        if (!this.start || !this.destination) {
            alert('Please enter both starting point and destination');
            return;
        }

        this.generateDirections();
        this.displayDirections();
        this.updateMap();
    }

    generateDirections() {
        // Simulated direction data based on start and destination
        const locationPairs = {
            'new york-los angeles': {
                distance: 4495,
                time: 65,
                directions: [
                    { instruction: 'Head west on 5th Avenue', distance: 2.5 },
                    { instruction: 'Turn left on 34th Street', distance: 1.8 },
                    { instruction: 'Merge onto I-78 West', distance: 12.3 },
                    { instruction: 'Continue on I-78 W toward Pennsylvania', distance: 45.2 },
                    { instruction: 'Merge onto I-80 West', distance: 287.6 },
                    { instruction: 'Take I-90 W toward Chicago', distance: 156.3 },
                    { instruction: 'Continue on I-90 West', distance: 342.1 },
                    { instruction: 'Merge onto I-15 South', distance: 892.4 },
                    { instruction: 'Continue on I-15 S toward Los Angeles', distance: 578.9 },
                    { instruction: 'Take exit 95 toward Los Angeles', distance: 23.4 },
                    { instruction: 'Arrive at destination', distance: 0 }
                ]
            },
            'new york-boston': {
                distance: 350,
                time: 4,
                directions: [
                    { instruction: 'Head east on 5th Avenue', distance: 2.1 },
                    { instruction: 'Merge onto I-84 East', distance: 45.3 },
                    { instruction: 'Continue on I-90 East', distance: 187.6 },
                    { instruction: 'Take I-93 North toward Boston', distance: 92.4 },
                    { instruction: 'Continue on I-93 North', distance: 18.2 },
                    { instruction: 'Arrive at Boston', distance: 0 }
                ]
            },
            'san francisco-los angeles': {
                distance: 800,
                time: 9,
                directions: [
                    { instruction: 'Head south on Market Street', distance: 3.2 },
                    { instruction: 'Merge onto I-101 South', distance: 42.1 },
                    { instruction: 'Continue on I-101 S', distance: 125.3 },
                    { instruction: 'Take I-5 South', distance: 389.6 },
                    { instruction: 'Continue on I-5 South toward Los Angeles', distance: 218.7 },
                    { instruction: 'Merge onto I-10 East', distance: 15.4 },
                    { instruction: 'Arrive at destination', distance: 0 }
                ]
            }
        };

        // Find matching route or generate generic one
        const key = `${this.start.toLowerCase()}-${this.destination.toLowerCase()}`;
        const reversedKey = `${this.destination.toLowerCase()}-${this.start.toLowerCase()}`;
        
        let routeData = locationPairs[key] || locationPairs[reversedKey];

        if (!routeData) {
            // Generate random route data
            const distance = Math.floor(Math.random() * 3000) + 100;
            const time = Math.floor(distance / 75) + 1;
            const numSteps = Math.floor(Math.random() * 5) + 6;
            
            routeData = {
                distance: distance,
                time: time,
                directions: this.generateRandomDirections(numSteps)
            };
        }

        this.totalDistance = routeData.distance;
        this.estimatedTime = routeData.time;
        this.directions = routeData.directions;
    }

    generateRandomDirections(count) {
        const instructions = [
            'Head north on Main Street',
            'Turn left on Oak Avenue',
            'Turn right on Elm Street',
            'Merge onto Highway 101',
            'Continue on Interstate 5',
            'Take exit toward downtown',
            'Merge onto local road',
            'Continue straight'
        ];

        const directions = [];
        const totalDist = this.totalDistance || 500;
        const distPerStep = totalDist / count;

        for (let i = 0; i < count; i++) {
            directions.push({
                instruction: instructions[Math.floor(Math.random() * instructions.length)],
                distance: (Math.random() * distPerStep * 0.8 + distPerStep * 0.2).toFixed(1)
            });
        }

        directions[directions.length - 1].instruction = `Arrive at ${this.destination}`;
        directions[directions.length - 1].distance = 0;

        return directions;
    }

    displayDirections() {
        // Update route information
        this.routeInfo.innerHTML = `
            <p><strong>From:</strong> ${this.start}</p>
            <p><strong>To:</strong> ${this.destination}</p>
            <p><strong>Total Distance:</strong> ${this.totalDistance} km</p>
            <p><strong>Estimated Duration:</strong> ${this.estimatedTime} hours</p>
            <p><strong>Route Status:</strong> ✅ Route found</p>
        `;

        // Update steps list
        this.stepsList.innerHTML = '';
        this.directions.forEach((direction, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step-item';
            stepElement.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <div class="step-instruction">${direction.instruction}</div>
                    <div class="step-distance">${direction.distance} km</div>
                </div>
            `;
            stepElement.addEventListener('click', () => this.highlightStep(index));
            this.stepsList.appendChild(stepElement);
        });

        // Update summary
        this.totalDistanceEl.textContent = `${this.totalDistance} km`;
        this.estimatedTimeEl.textContent = `${this.estimatedTime} hours`;
    }

    updateMap() {
        // Animate map update
        this.map.style.animation = 'none';
        setTimeout(() => {
            this.map.style.animation = 'fadeIn 0.5s ease-in';
        }, 10);
    }

    highlightStep(stepIndex) {
        const steps = document.querySelectorAll('.step-item');
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.style.background = '#e8d5ff';
                step.style.borderLeftColor = '#764ba2';
            } else {
                step.style.background = 'white';
                step.style.borderLeftColor = '#667eea';
            }
        });
    }

    zoomIn() {
        this.currentZoom = Math.min(this.currentZoom + 0.2, 3);
        this.updateMapZoom();
    }

    zoomOut() {
        this.currentZoom = Math.max(this.currentZoom - 0.2, 0.5);
        this.updateMapZoom();
    }

    updateMapZoom() {
        this.map.style.transform = `scale(${this.currentZoom})`;
        this.map.style.transition = 'transform 0.3s ease';
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.startInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    alert(`Current location set: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                },
                (error) => {
                    alert('Unable to get current location: ' + error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DirectionInformar();
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0.7;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
