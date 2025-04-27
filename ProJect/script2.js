document.addEventListener('DOMContentLoaded', function() {
    const videoOption = document.getElementById('video-option');
    const imageOption = document.getElementById('image-option');
    const audioOption = document.getElementById('audio-option');
    const uploadArea = document.getElementById('upload-area');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results');
    const loading = document.querySelector('.loading');
    const resultContent = document.getElementById('result-content');
    const probabilityBar = document.getElementById('probability-bar');
    const probabilityValue = document.getElementById('probability-value');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceValue = document.getElementById('confidence-value');
    const detailedList = document.getElementById('detailed-list');
    const visualizationCanvas = document.getElementById('visualization-canvas');
    const tryNowBtn = document.getElementById('try-now');
    
    // Current analysis type (video, image, or audio)
    let currentAnalysisType = null;
    
    // Event Listeners
    videoOption.addEventListener('click', () => selectAnalysisType('video'));
    imageOption.addEventListener('click', () => selectAnalysisType('image'));
    audioOption.addEventListener('click', () => selectAnalysisType('audio'));
    tryNowBtn.addEventListener('click', () => {
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
    });
    
    // File input handling
    fileInput.addEventListener('change', handleFileSelect);
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Analyze button
    analyzeBtn.addEventListener('click', analyzeMedia);
    
    // Functions
    function selectAnalysisType(type) {
        currentAnalysisType = type;
        
        // Update UI to show selected option
        document.querySelectorAll('.option-card').forEach(card => {
            card.style.border = '1px solid #e0e0e0';
        });

        const selectedCard = document.getElementById(`${type}-option`);
        selectedCard.style.border = `2px solid ${getColorForType(type)}`;

        // Update file input accept attribute based on type
        if (type === 'video') {
            fileInput.setAttribute('accept', 'video/*');
        } else if (type === 'image') {
            fileInput.setAttribute('accept', 'image/*');
        } else if (type === 'audio') {
            fileInput.setAttribute('accept', 'audio/*');
        }

        // Show upload area
        uploadArea.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        resultsSection.classList.add('hidden');
    }
    
    function getColorForType(type) {
        const colors = {
            video: '#4361ee',
            image: '#4cc9f0',
            audio: '#3f37c9'
        };
        return colors[type] || '#4361ee';
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.style.borderColor = getColorForType(currentAnalysisType);
        dropZone.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
    }
    
    function unhighlight() {
        dropZone.style.borderColor = '#ccc';
        dropZone.style.backgroundColor = 'transparent';
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length) {
            fileInput.files = files;
            handleFileSelect({ target: fileInput });
        }
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        const validTypes = {
            video: ['video/mp4', 'video/webm', 'video/ogg'],
            image: ['image/jpeg', 'image/png', 'image/gif'],
            audio: ['audio/mpeg', 'audio/ogg', 'audio/wav']
        }[currentAnalysisType];
        
        if (!validTypes.includes(file.type)) {
            alert(`Please select a valid ${currentAnalysisType} file`);
            return;
        }
        
        // Update UI
        fileName.textContent = file.name;
        fileInfo.classList.remove('hidden');
        resultsSection.classList.add('hidden');
    }
    
    function analyzeMedia() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }
        
        // Show loading state
        resultsSection.classList.remove('hidden');
        loading.classList.remove('hidden');
        resultContent.classList.add('hidden');
        
        // Simulate analysis (in a real app, this would be an API call)
        setTimeout(() => {
            loading.classList.add('hidden');
            resultContent.classList.remove('hidden');
            
            // Generate random results for demo purposes
            const fakeProbability = Math.floor(Math.random() * 100);
            const fakeConfidence = 80 + Math.floor(Math.random() * 20);
            
            // Update progress bars
            probabilityBar.style.width = `${fakeProbability}%`;
            probabilityValue.textContent = `${fakeProbability}%`;
            confidenceBar.style.width = `${fakeConfidence}%`;
            confidenceValue.textContent = `${fakeConfidence}%`;
            
            // Color the probability bar based on value
            if (fakeProbability > 70) {
                probabilityBar.style.backgroundColor = 'var(--danger-color)';
            } else if (fakeProbability > 30) {
                probabilityBar.style.backgroundColor = 'var(--warning-color)';
            } else {
                probabilityBar.style.backgroundColor = 'var(--success-color)';
            }
            
            detailedList.innerHTML = '';
            const indicators = generateFakeIndicators(currentAnalysisType);
            indicators.forEach(indicator => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${indicator.name}:</strong> ${indicator.value}`;
                detailedList.appendChild(li);
            });
            
            // Draw visualization
            drawVisualization(visualizationCanvas, currentAnalysisType);
        }, 3000);
    }
    
    function generateFakeIndicators(type) {
        const baseIndicators = [
            { name: 'File Type', value: type },
            { name: 'Analysis Timestamp', value: new Date().toLocaleString() }
        ];
        
        if (type === 'video') {
            return [
                ...baseIndicators,
                { name: 'Frame Inconsistencies', value: `${Math.floor(Math.random() * 20)}%`},
                { name: 'Audio-Visual Sync', value: `${80 + Math.floor(Math.random() * 20)}% match` },
                { name: 'Blink Rate', value: `${Math.floor(Math.random() * 10)} blinks/min (normal: 15-30)` },
                { name: 'Facial Micro-expressions', value: `${Math.floor(Math.random() * 100)}% natural` }
            ];
        } else if (type === 'image') {
            return [
                ...baseIndicators,
                { name: 'Facial Landmark Consistency', value: `${80 + Math.floor(Math.random() * 20)}% `},
                { name: 'Skin Texture Analysis', value: `${Math.floor(Math.random() * 100)}% natural` },
                { name: 'Lighting Consistency', value: `${70 + Math.floor(Math.random() * 30)}% `},
                { name: 'Edge Artifacts', value: `${Math.floor(Math.random() * 30)} detected `}
            ];
        } else if (type === 'audio') {
            return [
                ...baseIndicators,
                { name: 'Synthetic Voice Patterns', value: `${Math.floor(Math.random() * 100)}% detected` },
                { name: 'Background Noise Consistency', value: `${70 + Math.floor(Math.random() * 30)}%` },
                { name: 'Spectral Analysis', value: `${Math.floor(Math.random() * 100)}% natural` },
                { name: 'Voice Emotion Analysis', value: `${Math.floor(Math.random() * 100)}% consistent` }
            ];
        }
        
        return baseIndicators;
    }
    
    function drawVisualization(canvas, type) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        ctx.clearRect(0, 0, width, height);
 
        // Draw different visualizations based on type
        if (type === 'video') {
            // Draw a waveform-like visualization for video
            ctx.fillStyle = 'rgba(67, 97, 238, 0.2)';
            ctx.strokeStyle = '#4361ee';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            for (let x = 0; x < width; x += 5) {
                const y = height / 2 + Math.sin(x / 20) * (height / 4) * Math.random();
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Add some random spikes for "anomalies"
                if (Math.random() > 0.9) {
                    const spikeHeight = 10 + Math.random() * 30;
                    ctx.lineTo(x, y - spikeHeight);
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        } else if (type === 'image') {
            // Draw grid visualization for image
            const gridSize = 20;
            const cols = Math.ceil(width / gridSize);
            const rows = Math.ceil(height / gridSize);
            
            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    const x = col * gridSize;
                    const y = row * gridSize;
                    
                    // Randomly color some cells as anomalies
                    if (Math.random() > 0.9) {
                        ctx.fillStyle = 'rgba(239, 35, 60, 0.3)';
                    } else {
                        ctx.fillStyle = 'rgba(67, 97, 238, 0.1)';
                    }
                    
                    ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
                }
            }
        } else if (type === 'audio') {
            // Draw a spectrogram-like visualization for audio
            const bands = 30;
            const bandWidth = width / bands;
            
            for (let i = 0; i < bands; i++) {
                const bandHeight = 20 + Math.random() * (height - 40);
                const y = (height - bandHeight) / 2;
                
                // Randomly color some bands as anomalies
                if (Math.random() > 0.85) {
                    ctx.fillStyle = 'rgba(239, 35, 60, 0.5)';
                } else {
                    ctx.fillStyle = 'rgba(67, 97, 238, 0.5)';
                }
                
                ctx.fillRect(i * bandWidth, y, bandWidth - 2, bandHeight);
            }
        }
    }
});